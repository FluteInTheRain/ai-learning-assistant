from dataclasses import dataclass

import tiktoken

# Target chunk size in tokens. Deliberately zero overlap (v0 simplification):
# document_chunks doubles as the lossless full-text source for content
# generation (reconstructed by concatenating chunks in chunk_index order),
# and overlap would duplicate text in that reconstruction.
DEFAULT_CHUNK_SIZE_TOKENS = 600

_ENCODING = tiktoken.encoding_for_model("text-embedding-3-small")


@dataclass(frozen=True)
class Chunk:
    chunk_index: int
    page_number: int
    content: str


def chunk_pages(
    pages: list[tuple[int, str]],
    chunk_size: int = DEFAULT_CHUNK_SIZE_TOKENS,
) -> list[Chunk]:
    """Split parsed (page_number, text) pairs into token-bounded chunks.

    Chunking is done per page with a sliding window of `chunk_size` tokens
    and zero overlap, so concatenating the resulting chunks' content in
    `chunk_index` order losslessly reconstructs the concatenation of the
    original page texts.
    """
    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive")

    chunks: list[Chunk] = []
    chunk_index = 0

    for page_number, text in pages:
        tokens = _ENCODING.encode(text)
        if not tokens:
            continue

        for start in range(0, len(tokens), chunk_size):
            token_slice = tokens[start : start + chunk_size]
            content = _ENCODING.decode(token_slice)
            chunks.append(
                Chunk(
                    chunk_index=chunk_index,
                    page_number=page_number,
                    content=content,
                )
            )
            chunk_index += 1

    return chunks
