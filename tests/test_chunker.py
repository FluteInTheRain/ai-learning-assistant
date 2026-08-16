import pytest
import tiktoken

from app.ingestion.chunker import chunk_pages

_ENCODING = tiktoken.encoding_for_model("text-embedding-3-small")


class TestChunkPages:
    def test_empty_pages_returns_no_chunks(self) -> None:
        assert chunk_pages([]) == []

    def test_short_page_produces_single_chunk(self) -> None:
        pages = [(1, "Hello world, this is a short page.")]
        chunks = chunk_pages(pages, chunk_size=600)

        assert len(chunks) == 1
        assert chunks[0].chunk_index == 0
        assert chunks[0].page_number == 1
        assert chunks[0].content == pages[0][1]

    def test_chunk_index_is_monotonic_across_pages(self) -> None:
        pages = [(1, "First page content."), (2, "Second page content.")]
        chunks = chunk_pages(pages, chunk_size=2)

        indices = [c.chunk_index for c in chunks]
        assert indices == list(range(len(chunks)))

    def test_page_number_tracks_source_page(self) -> None:
        pages = [(1, "a b c d e"), (2, "f g h i j")]
        chunks = chunk_pages(pages, chunk_size=2)

        page_numbers = {c.page_number for c in chunks if c.page_number == 1}
        assert page_numbers == {1}
        assert any(c.page_number == 2 for c in chunks)

    def test_splits_long_page_into_multiple_chunks_by_token_size(self) -> None:
        text = " ".join(f"word{i}" for i in range(1000))
        pages = [(1, text)]
        chunks = chunk_pages(pages, chunk_size=100)

        assert len(chunks) > 1
        for chunk in chunks[:-1]:
            assert len(_ENCODING.encode(chunk.content)) == 100

    def test_zero_overlap_reconstruction_is_lossless(self) -> None:
        text = " ".join(f"token{i}" for i in range(500))
        pages = [(1, text)]
        chunks = chunk_pages(pages, chunk_size=50)

        reconstructed = "".join(c.content for c in chunks)
        assert reconstructed == text

    def test_multi_page_reconstruction_equals_concatenated_pages(self) -> None:
        pages = [
            (1, "Page one content about topic A."),
            (2, "Page two content about topic B."),
            (3, "Page three content about topic C."),
        ]
        chunks = chunk_pages(pages, chunk_size=5)

        reconstructed = "".join(c.content for c in chunks)
        assert reconstructed == "".join(text for _, text in pages)

    def test_invalid_chunk_size_raises(self) -> None:
        with pytest.raises(ValueError):
            chunk_pages([(1, "text")], chunk_size=0)
