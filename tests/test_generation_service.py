import json

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.document_repository import DocumentRepository
from app.services.document_service import DocumentService
from app.services.exceptions import (
    DocumentNotReadyError,
    GenerationFailedError,
    NotFoundError,
)
from app.services.generation_service import GenerationService
from app.services.session_service import SessionService
from tests.fakes import FakeEmbeddingClient, FakeFailingLLMClient, FakeLLMClient


@pytest.fixture
async def ready_document_id(db_session: AsyncSession, sample_pdf_bytes: bytes) -> int:
    session_service = SessionService(db_session)
    session = await session_service.create_session("Test session")

    document_service = DocumentService(
        db_session, embedding_client=FakeEmbeddingClient()
    )
    document = await document_service.upload_document(
        session_id=session.id, filename="notes.pdf", file_bytes=sample_pdf_bytes
    )
    return document.id


class TestGenerate:
    async def test_summary_action_stores_and_returns_content(
        self, db_session: AsyncSession, ready_document_id: int
    ) -> None:
        fake_llm = FakeLLMClient(summary_text="This is the summary.")
        service = GenerationService(db_session, llm_client=fake_llm)

        result = await service.generate(ready_document_id, "summary")

        assert result.action_type == "summary"
        assert result.content == "This is the summary."
        assert fake_llm.calls[0]["response_format"] is None

    async def test_quiz_action_stores_valid_json(
        self, db_session: AsyncSession, ready_document_id: int
    ) -> None:
        fake_llm = FakeLLMClient(quiz_questions=3)
        service = GenerationService(db_session, llm_client=fake_llm)

        result = await service.generate(ready_document_id, "quiz")

        assert result.action_type == "quiz"
        parsed = json.loads(result.content)
        assert len(parsed["questions"]) == 3
        assert fake_llm.calls[0]["response_format"] is not None

    async def test_generate_on_missing_document_raises_not_found(
        self, db_session: AsyncSession
    ) -> None:
        service = GenerationService(db_session, llm_client=FakeLLMClient())
        with pytest.raises(NotFoundError):
            await service.generate(999_999, "summary")

    async def test_generate_on_non_ready_document_raises(
        self, db_session: AsyncSession
    ) -> None:
        session_service = SessionService(db_session)
        session = await session_service.create_session("Test session")
        document_repo = DocumentRepository(db_session)
        document = await document_repo.create(
            session_id=session.id,
            filename="pending.pdf",
            file_type="pdf",
            status="PENDING",
        )

        service = GenerationService(db_session, llm_client=FakeLLMClient())
        with pytest.raises(DocumentNotReadyError):
            await service.generate(document.id, "summary")

    async def test_generate_with_unsupported_action_raises(
        self, db_session: AsyncSession, ready_document_id: int
    ) -> None:
        service = GenerationService(db_session, llm_client=FakeLLMClient())
        with pytest.raises(ValueError, match="Unsupported action"):
            await service.generate(ready_document_id, "translate")

    async def test_prompt_includes_reconstructed_document_text(
        self, db_session: AsyncSession, ready_document_id: int
    ) -> None:
        fake_llm = FakeLLMClient()
        service = GenerationService(db_session, llm_client=fake_llm)

        await service.generate(ready_document_id, "summary")

        user_message = fake_llm.calls[0]["messages"][-1]["content"]
        assert "Hello world" in user_message

    async def test_prompt_separates_text_at_page_boundaries(
        self, db_session: AsyncSession, ready_document_id: int
    ) -> None:
        # sample_pdf_bytes (see conftest.py) has page one ending in
        # "...test PDF document." and page two starting with "This is page
        # two...". Without a separator these would run together as
        # "document.This is page two".
        fake_llm = FakeLLMClient()
        service = GenerationService(db_session, llm_client=fake_llm)

        await service.generate(ready_document_id, "summary")

        user_message = fake_llm.calls[0]["messages"][-1]["content"]
        assert "document.This is page two" not in user_message
        assert "document.\n\nThis is page two" in user_message

    async def test_generate_wraps_llm_failure_in_generation_failed_error(
        self, db_session: AsyncSession, ready_document_id: int
    ) -> None:
        service = GenerationService(db_session, llm_client=FakeFailingLLMClient())

        with pytest.raises(GenerationFailedError):
            await service.generate(ready_document_id, "summary")


class TestListGenerated:
    async def test_list_generated_returns_all_created_content(
        self, db_session: AsyncSession, ready_document_id: int
    ) -> None:
        service = GenerationService(db_session, llm_client=FakeLLMClient())
        await service.generate(ready_document_id, "summary")
        await service.generate(ready_document_id, "quiz")

        results = await service.list_generated(ready_document_id)

        assert len(results) == 2
        assert {r.action_type for r in results} == {"summary", "quiz"}

    async def test_list_generated_unknown_document_raises_not_found(
        self, db_session: AsyncSession
    ) -> None:
        service = GenerationService(db_session, llm_client=FakeLLMClient())
        with pytest.raises(NotFoundError):
            await service.list_generated(999_999)
