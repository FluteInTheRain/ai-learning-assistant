import pytest

from app.ai.embedding_client import MAX_INPUT_TOKENS, _batch_by_token_budget


class TestBatchByTokenBudget:
    def test_single_small_text_returns_one_batch(self) -> None:
        batches = _batch_by_token_budget(["hello world"], max_batch_tokens=1000)
        assert batches == [["hello world"]]

    def test_no_texts_returns_no_batches(self) -> None:
        assert _batch_by_token_budget([], max_batch_tokens=1000) == []

    def test_splits_into_multiple_batches_when_budget_exceeded(self) -> None:
        # Each text is ~1 token ("a", "b", ...); budget of 2 forces pairs.
        texts = ["a", "b", "c", "d", "e"]
        batches = _batch_by_token_budget(texts, max_batch_tokens=2)

        assert sum(len(b) for b in batches) == len(texts)
        assert [t for batch in batches for t in batch] == texts
        assert len(batches) > 1

    def test_does_not_split_a_single_text_across_batches(self) -> None:
        texts = ["a " * 50, "b " * 50]
        batches = _batch_by_token_budget(texts, max_batch_tokens=10)

        for text in texts:
            assert any(text in batch for batch in batches)

    def test_text_exceeding_per_input_limit_raises(self) -> None:
        huge_text = "word " * (MAX_INPUT_TOKENS + 10)
        with pytest.raises(ValueError):
            _batch_by_token_budget([huge_text], max_batch_tokens=1_000_000)
