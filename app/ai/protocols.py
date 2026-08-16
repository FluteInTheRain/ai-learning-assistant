"""Structural types for the AI service clients.

Services depend on these Protocols rather than the concrete OpenAI-backed
classes, so tests can inject lightweight fakes without real network calls.
"""

from typing import Any, Protocol

from openai.types.chat import ChatCompletionMessageParam


class EmbeddingClientLike(Protocol):
    async def embed_texts(self, texts: list[str]) -> list[list[float]]: ...


class LLMClientLike(Protocol):
    model: str

    async def complete(
        self,
        messages: list[ChatCompletionMessageParam],
        response_format: dict[str, Any] | None = None,
    ) -> str: ...
