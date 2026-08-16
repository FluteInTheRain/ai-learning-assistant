"""Fake AI-service implementations used in tests to avoid real network calls."""

import json
from typing import Any

from openai import OpenAIError
from openai.types.chat import ChatCompletionMessageParam


class FakeEmbeddingClient:
    """Returns deterministic fixed-size vectors instead of calling OpenAI."""

    def __init__(self, dimension: int = 1536) -> None:
        self.dimension = dimension
        self.calls: list[list[str]] = []

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        self.calls.append(texts)
        return [[0.0] * self.dimension for _ in texts]


class FakeFailingEmbeddingClient:
    """Simulates the OpenAI SDK raising during an embeddings call."""

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        raise OpenAIError("simulated OpenAI API failure")


class FakeLLMClient:
    """Returns canned completions instead of calling OpenAI."""

    def __init__(
        self, summary_text: str = "A short summary.", quiz_questions: int = 2
    ) -> None:
        self.model = "fake-model"
        self.summary_text = summary_text
        self.quiz_questions = quiz_questions
        self.calls: list[dict[str, Any]] = []

    async def complete(
        self,
        messages: list[ChatCompletionMessageParam],
        response_format: dict[str, Any] | None = None,
    ) -> str:
        self.calls.append({"messages": messages, "response_format": response_format})
        if response_format is not None:
            return json.dumps(
                {
                    "questions": [
                        {
                            "question": f"Question {i + 1}?",
                            "options": ["A", "B", "C", "D"],
                            "correct_answer_index": 0,
                            "explanation": "Because.",
                        }
                        for i in range(self.quiz_questions)
                    ]
                }
            )
        return self.summary_text


class FakeFailingLLMClient:
    """Simulates the OpenAI SDK raising during a chat completion call."""

    def __init__(self) -> None:
        self.model = "fake-model"

    async def complete(
        self,
        messages: list[ChatCompletionMessageParam],
        response_format: dict[str, Any] | None = None,
    ) -> str:
        raise OpenAIError("simulated OpenAI API failure")
