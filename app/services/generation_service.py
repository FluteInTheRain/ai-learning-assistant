import json
from typing import Any

import tiktoken
from openai import OpenAIError
from openai.types.chat import ChatCompletionMessageParam
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.llm_client import LLMClient
from app.ai.protocols import LLMClientLike
from app.db.models import GeneratedContent
from app.repositories.chunk_repository import ChunkRepository
from app.repositories.document_repository import DocumentRepository
from app.repositories.generated_content_repository import GeneratedContentRepository
from app.services.exceptions import (
    DocumentNotReadyError,
    GenerationFailedError,
    NotFoundError,
    UnsupportedActionError,
)

# Budget for the reconstructed document text fed into the chat model. v0 uses
# simple truncation (keep the first N tokens) rather than map-reduce /
# recursive summarization over long documents — a known v0 limitation.
MAX_DOCUMENT_TOKENS = 20_000

QUIZ_JSON_SCHEMA: dict[str, Any] = {
    "name": "quiz_questions",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "questions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "question": {"type": "string"},
                        "options": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                        "correct_answer_index": {"type": "integer"},
                        "explanation": {"type": "string"},
                    },
                    "required": [
                        "question",
                        "options",
                        "correct_answer_index",
                        "explanation",
                    ],
                    "additionalProperties": False,
                },
            }
        },
        "required": ["questions"],
        "additionalProperties": False,
    },
}


def _truncate_to_token_budget(text: str, model: str, max_tokens: int) -> str:
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")

    tokens = encoding.encode(text)
    if len(tokens) <= max_tokens:
        return text
    return encoding.decode(tokens[:max_tokens])


def _build_summary_messages(document_text: str) -> list[ChatCompletionMessageParam]:
    return [
        {
            "role": "system",
            "content": (
                "You are a helpful study assistant. Summarize the given "
                "document clearly and concisely for a student, capturing "
                "the key points."
            ),
        },
        {
            "role": "user",
            "content": f"Summarize the following document:\n\n{document_text}",
        },
    ]


def _build_quiz_messages(document_text: str) -> list[ChatCompletionMessageParam]:
    return [
        {
            "role": "system",
            "content": (
                "You are a helpful study assistant. Generate multiple-choice "
                "quiz questions to test understanding of the given document. "
                "Each question must have exactly 4 options, one correct "
                "answer index (0-based), and a brief explanation."
            ),
        },
        {
            "role": "user",
            "content": (
                "Generate quiz questions for the following document:\n\n"
                f"{document_text}"
            ),
        },
    ]


class GenerationService:
    def __init__(
        self, db: AsyncSession, llm_client: LLMClientLike | None = None
    ) -> None:
        self._document_repo = DocumentRepository(db)
        self._chunk_repo = ChunkRepository(db)
        self._generated_repo = GeneratedContentRepository(db)
        self._llm_client = llm_client or LLMClient()

    async def generate(self, document_id: int, action: str) -> GeneratedContent:
        document = await self._document_repo.get_by_id(document_id)
        if document is None:
            raise NotFoundError(f"Document {document_id} not found")
        if document.status != "READY":
            raise DocumentNotReadyError(
                f"Document {document_id} is not READY (status={document.status})"
            )

        document_text = await self._reconstruct_document_text(document_id)

        truncated_text = _truncate_to_token_budget(
            document_text, self._llm_client.model, MAX_DOCUMENT_TOKENS
        )

        try:
            if action == "summary":
                content = await self._generate_summary(truncated_text)
            elif action == "quiz":
                content = await self._generate_quiz(truncated_text)
            else:
                raise UnsupportedActionError(f"Unsupported action: {action}")
        except OpenAIError as exc:
            raise GenerationFailedError(f"LLM generation failed: {exc}") from exc
        except json.JSONDecodeError as exc:
            raise GenerationFailedError(
                f"LLM returned invalid JSON for quiz generation: {exc}"
            ) from exc

        return await self._generated_repo.create(
            document_id=document_id, action_type=action, content=content
        )

    async def list_generated(self, document_id: int) -> list[GeneratedContent]:
        document = await self._document_repo.get_by_id(document_id)
        if document is None:
            raise NotFoundError(f"Document {document_id} not found")
        return await self._generated_repo.list_by_document(document_id)

    async def _reconstruct_document_text(self, document_id: int) -> str:
        """Rebuild the document's full text from its stored chunks.

        Chunks within a page are concatenated directly (lossless, per the
        chunker's zero-overlap tiling). A separator is inserted between
        pages so the last word of one page's text can't run directly into
        the first word of the next (page text is stripped before chunking).
        """
        chunks = await self._chunk_repo.list_by_document(document_id)
        parts: list[str] = []
        previous_page: int | None = None
        for chunk in chunks:
            if previous_page is not None and chunk.page_number != previous_page:
                parts.append("\n\n")
            parts.append(chunk.content)
            previous_page = chunk.page_number
        return "".join(parts)

    async def _generate_summary(self, document_text: str) -> str:
        messages = _build_summary_messages(document_text)
        return await self._llm_client.complete(messages)

    async def _generate_quiz(self, document_text: str) -> str:
        messages = _build_quiz_messages(document_text)
        response_format = {"type": "json_schema", "json_schema": QUIZ_JSON_SCHEMA}
        raw_content = await self._llm_client.complete(
            messages, response_format=response_format
        )
        # Round-trip through json to validate and canonicalize before storage.
        parsed = json.loads(raw_content)
        return json.dumps(parsed)
