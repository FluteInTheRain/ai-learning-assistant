import tiktoken

from app.services.generation_service import (
    _build_quiz_messages,
    _build_summary_messages,
    _truncate_to_token_budget,
)


class TestTruncateToTokenBudget:
    def test_short_text_is_unchanged(self) -> None:
        text = "A short document."
        assert _truncate_to_token_budget(text, "gpt-4o-mini", 100) == text

    def test_long_text_is_truncated_to_budget(self) -> None:
        text = " ".join(f"word{i}" for i in range(5000))
        truncated = _truncate_to_token_budget(text, "gpt-4o-mini", 100)

        encoding = tiktoken.encoding_for_model("gpt-4o-mini")
        assert len(encoding.encode(truncated)) == 100
        assert truncated != text

    def test_unknown_model_falls_back_to_default_encoding(self) -> None:
        text = "Some document text."
        # Should not raise even for a model tiktoken doesn't recognize.
        result = _truncate_to_token_budget(text, "not-a-real-model", 1000)
        assert result == text


class TestBuildMessages:
    def test_summary_messages_include_document_text(self) -> None:
        messages = _build_summary_messages("The document body.")
        contents = [m.get("content") for m in messages]
        assert any(
            isinstance(content, str) and "The document body." in content
            for content in contents
        )
        assert messages[0]["role"] == "system"
        assert messages[-1]["role"] == "user"

    def test_quiz_messages_include_document_text(self) -> None:
        messages = _build_quiz_messages("The document body.")
        contents = [m.get("content") for m in messages]
        assert any(
            isinstance(content, str) and "The document body." in content
            for content in contents
        )
        assert messages[0]["role"] == "system"
        assert messages[-1]["role"] == "user"
