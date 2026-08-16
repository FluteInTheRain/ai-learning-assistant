import tiktoken
from openai import AsyncOpenAI

from app.config import get_settings

_ENCODING = tiktoken.get_encoding("cl100k_base")

# Limits imposed by the OpenAI embeddings API.
MAX_INPUT_TOKENS = 8192
# Keep a safety margin under the ~300k total-tokens-per-request limit.
MAX_BATCH_TOKENS = 250_000


class EmbeddingClient:
    """Thin wrapper around the OpenAI embeddings API."""

    def __init__(self, client: AsyncOpenAI | None = None) -> None:
        settings = get_settings()
        self._client = client or AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._model = settings.EMBEDDING_MODEL

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        """Embed a batch of texts, splitting into multiple API calls as
        needed to respect the embeddings API's per-request token budget.
        """
        if not texts:
            return []

        embeddings: list[list[float]] = []
        for batch in _batch_by_token_budget(texts, MAX_BATCH_TOKENS):
            response = await self._client.embeddings.create(
                model=self._model, input=batch
            )
            embeddings.extend(item.embedding for item in response.data)
        return embeddings


def _batch_by_token_budget(texts: list[str], max_batch_tokens: int) -> list[list[str]]:
    """Group texts into batches whose total token count stays under
    `max_batch_tokens`, without splitting any single text across batches.
    """
    batches: list[list[str]] = []
    current_batch: list[str] = []
    current_tokens = 0

    for text in texts:
        token_count = len(_ENCODING.encode(text))
        if token_count > MAX_INPUT_TOKENS:
            # Should not happen given our ~600-token chunk size, but guard
            # against a pathological single input exceeding the per-input cap.
            raise ValueError(
                f"Text exceeds max embedding input tokens ({MAX_INPUT_TOKENS})"
            )

        if current_batch and current_tokens + token_count > max_batch_tokens:
            batches.append(current_batch)
            current_batch = []
            current_tokens = 0

        current_batch.append(text)
        current_tokens += token_count

    if current_batch:
        batches.append(current_batch)

    return batches
