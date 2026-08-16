from typing import Any

from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam

from app.config import get_settings


class LLMClient:
    """Thin wrapper around the OpenAI chat completions API."""

    def __init__(self, client: AsyncOpenAI | None = None) -> None:
        settings = get_settings()
        self._client = client or AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._model = settings.OPENAI_MODEL

    @property
    def model(self) -> str:
        return self._model

    async def complete(
        self,
        messages: list[ChatCompletionMessageParam],
        response_format: dict[str, Any] | None = None,
    ) -> str:
        """Run a chat completion and return the assistant message content."""
        kwargs: dict[str, Any] = {"model": self._model, "messages": messages}
        if response_format is not None:
            kwargs["response_format"] = response_format

        response = await self._client.chat.completions.create(**kwargs)
        content = response.choices[0].message.content
        if content is None:
            raise ValueError("LLM returned an empty completion")
        return content
