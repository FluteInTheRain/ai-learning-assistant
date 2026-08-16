import json

import pytest
from httpx import AsyncClient
from openai import OpenAIError

from app.ai.embedding_client import EmbeddingClient
from app.ai.llm_client import LLMClient


@pytest.fixture(autouse=True)
def patch_ai_clients(monkeypatch: pytest.MonkeyPatch) -> None:
    """Prevent any test from making real OpenAI network calls."""

    async def fake_embed_texts(
        self: EmbeddingClient, texts: list[str]
    ) -> list[list[float]]:
        return [[0.0] * 1536 for _ in texts]

    async def fake_complete(
        self: LLMClient, messages: list[dict], response_format: dict | None = None
    ) -> str:
        if response_format is not None:
            return json.dumps(
                {
                    "questions": [
                        {
                            "question": "What is this document about?",
                            "options": ["A", "B", "C", "D"],
                            "correct_answer_index": 0,
                            "explanation": "Because.",
                        }
                    ]
                }
            )
        return "A fake summary of the document."

    monkeypatch.setattr(EmbeddingClient, "embed_texts", fake_embed_texts)
    monkeypatch.setattr(LLMClient, "complete", fake_complete)


async def test_cors_allows_configured_frontend_origin(client: AsyncClient) -> None:
    response = await client.get(
        "/sessions", headers={"Origin": "http://localhost:5173"}
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


class TestSessionsApi:
    async def test_create_and_get_session(self, client: AsyncClient) -> None:
        response = await client.post("/sessions", json={"name": "My session"})
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "My session"

        get_response = await client.get(f"/sessions/{data['id']}")
        assert get_response.status_code == 200
        assert get_response.json()["id"] == data["id"]

    async def test_list_sessions(self, client: AsyncClient) -> None:
        await client.post("/sessions", json={"name": "Session A"})
        await client.post("/sessions", json={"name": "Session B"})

        response = await client.get("/sessions")
        assert response.status_code == 200
        names = {s["name"] for s in response.json()}
        assert {"Session A", "Session B"}.issubset(names)

    async def test_get_unknown_session_returns_404(self, client: AsyncClient) -> None:
        response = await client.get("/sessions/999999")
        assert response.status_code == 404

    async def test_create_session_validation_error(self, client: AsyncClient) -> None:
        response = await client.post("/sessions", json={"name": ""})
        assert response.status_code == 422


class TestDocumentsApi:
    async def test_upload_document_and_generate_summary(
        self, client: AsyncClient, sample_pdf_bytes: bytes
    ) -> None:
        session_response = await client.post("/sessions", json={"name": "S"})
        session_id = session_response.json()["id"]

        upload_response = await client.post(
            f"/sessions/{session_id}/documents",
            files={"file": ("notes.pdf", sample_pdf_bytes, "application/pdf")},
        )
        assert upload_response.status_code == 201
        document = upload_response.json()
        assert document["status"] == "READY"

        list_response = await client.get(f"/sessions/{session_id}/documents")
        assert list_response.status_code == 200
        assert len(list_response.json()) == 1

        get_response = await client.get(f"/documents/{document['id']}")
        assert get_response.status_code == 200

        generate_response = await client.post(
            f"/documents/{document['id']}/generate", json={"action": "summary"}
        )
        assert generate_response.status_code == 200
        generated = generate_response.json()
        assert generated["action_type"] == "summary"
        assert generated["content"] == "A fake summary of the document."

        generated_list = await client.get(f"/documents/{document['id']}/generated")
        assert generated_list.status_code == 200
        assert len(generated_list.json()) == 1

    async def test_generate_quiz(
        self, client: AsyncClient, sample_pdf_bytes: bytes
    ) -> None:
        session_response = await client.post("/sessions", json={"name": "S"})
        session_id = session_response.json()["id"]
        upload_response = await client.post(
            f"/sessions/{session_id}/documents",
            files={"file": ("notes.pdf", sample_pdf_bytes, "application/pdf")},
        )
        document_id = upload_response.json()["id"]

        response = await client.post(
            f"/documents/{document_id}/generate", json={"action": "quiz"}
        )
        assert response.status_code == 200
        content = json.loads(response.json()["content"])
        assert "questions" in content

    async def test_upload_to_unknown_session_returns_404(
        self, client: AsyncClient, sample_pdf_bytes: bytes
    ) -> None:
        response = await client.post(
            "/sessions/999999/documents",
            files={"file": ("notes.pdf", sample_pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 404

    async def test_upload_non_pdf_returns_400(self, client: AsyncClient) -> None:
        session_response = await client.post("/sessions", json={"name": "S"})
        session_id = session_response.json()["id"]

        response = await client.post(
            f"/sessions/{session_id}/documents",
            files={"file": ("notes.txt", b"hello", "text/plain")},
        )
        assert response.status_code == 400

    async def test_generate_invalid_action_returns_422(
        self, client: AsyncClient, sample_pdf_bytes: bytes
    ) -> None:
        session_response = await client.post("/sessions", json={"name": "S"})
        session_id = session_response.json()["id"]
        upload_response = await client.post(
            f"/sessions/{session_id}/documents",
            files={"file": ("notes.pdf", sample_pdf_bytes, "application/pdf")},
        )
        document_id = upload_response.json()["id"]

        response = await client.post(
            f"/documents/{document_id}/generate", json={"action": "not-a-real-action"}
        )
        assert response.status_code == 422

    async def test_get_unknown_document_returns_404(self, client: AsyncClient) -> None:
        response = await client.get("/documents/999999")
        assert response.status_code == 404

    async def test_generate_returns_502_when_llm_call_fails(
        self,
        client: AsyncClient,
        sample_pdf_bytes: bytes,
        monkeypatch: pytest.MonkeyPatch,
    ) -> None:
        async def failing_complete(
            self: LLMClient,
            messages: list[dict],
            response_format: dict | None = None,
        ) -> str:
            raise OpenAIError("simulated OpenAI API failure")

        monkeypatch.setattr(LLMClient, "complete", failing_complete)

        session_response = await client.post("/sessions", json={"name": "S"})
        session_id = session_response.json()["id"]
        upload_response = await client.post(
            f"/sessions/{session_id}/documents",
            files={"file": ("notes.pdf", sample_pdf_bytes, "application/pdf")},
        )
        document_id = upload_response.json()["id"]

        response = await client.post(
            f"/documents/{document_id}/generate", json={"action": "summary"}
        )
        assert response.status_code == 502
