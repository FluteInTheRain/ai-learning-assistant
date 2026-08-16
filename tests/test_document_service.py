import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.ingestion.parser import PdfParseError
from app.repositories.chunk_repository import ChunkRepository
from app.repositories.document_repository import DocumentRepository
from app.services.document_service import DocumentService
from app.services.exceptions import (
    DocumentParsingError,
    NotFoundError,
    UnsupportedFileTypeError,
)
from app.services.session_service import SessionService
from tests.fakes import FakeEmbeddingClient, FakeFailingEmbeddingClient


@pytest.fixture
async def session_id(db_session: AsyncSession) -> int:
    session_service = SessionService(db_session)
    session = await session_service.create_session("Test session")
    return session.id


class TestUploadDocument:
    async def test_upload_success_sets_status_ready_and_stores_chunks(
        self, db_session: AsyncSession, session_id: int, sample_pdf_bytes: bytes
    ) -> None:
        fake_embeddings = FakeEmbeddingClient()
        service = DocumentService(db_session, embedding_client=fake_embeddings)

        document = await service.upload_document(
            session_id=session_id, filename="notes.pdf", file_bytes=sample_pdf_bytes
        )

        assert document.status == "READY"
        assert document.file_type == "pdf"

        chunk_repo = ChunkRepository(db_session)
        chunks = await chunk_repo.list_by_document(document.id)
        assert len(chunks) > 0
        assert [c.chunk_index for c in chunks] == list(range(len(chunks)))
        assert fake_embeddings.calls, "embedding client should have been called"

    async def test_upload_unknown_session_raises_not_found(
        self, db_session: AsyncSession, sample_pdf_bytes: bytes
    ) -> None:
        service = DocumentService(db_session, embedding_client=FakeEmbeddingClient())

        with pytest.raises(NotFoundError):
            await service.upload_document(
                session_id=999_999, filename="notes.pdf", file_bytes=sample_pdf_bytes
            )

    async def test_upload_non_pdf_filename_raises_unsupported_file_type(
        self, db_session: AsyncSession, session_id: int, sample_pdf_bytes: bytes
    ) -> None:
        service = DocumentService(db_session, embedding_client=FakeEmbeddingClient())

        with pytest.raises(UnsupportedFileTypeError):
            await service.upload_document(
                session_id=session_id, filename="notes.txt", file_bytes=b"hi"
            )

        documents = await service.list_documents(session_id)
        assert documents == []

    async def test_upload_invalid_pdf_bytes_marks_document_failed(
        self, db_session: AsyncSession, session_id: int
    ) -> None:
        service = DocumentService(db_session, embedding_client=FakeEmbeddingClient())

        with pytest.raises(PdfParseError):
            await service.upload_document(
                session_id=session_id,
                filename="bad.pdf",
                file_bytes=b"this is not a real pdf",
            )

        document_repo = DocumentRepository(db_session)
        documents = await document_repo.list_by_session(session_id)
        assert len(documents) == 1
        assert documents[0].status == "FAILED"

    async def test_upload_embedding_failure_marks_failed_and_raises_parsing_error(
        self, db_session: AsyncSession, session_id: int, sample_pdf_bytes: bytes
    ) -> None:
        service = DocumentService(
            db_session, embedding_client=FakeFailingEmbeddingClient()
        )

        with pytest.raises(DocumentParsingError):
            await service.upload_document(
                session_id=session_id,
                filename="notes.pdf",
                file_bytes=sample_pdf_bytes,
            )

        document_repo = DocumentRepository(db_session)
        documents = await document_repo.list_by_session(session_id)
        assert len(documents) == 1
        assert documents[0].status == "FAILED"


class TestListAndGetDocument:
    async def test_list_documents_unknown_session_raises_not_found(
        self, db_session: AsyncSession
    ) -> None:
        service = DocumentService(db_session, embedding_client=FakeEmbeddingClient())
        with pytest.raises(NotFoundError):
            await service.list_documents(999_999)

    async def test_get_document_unknown_raises_not_found(
        self, db_session: AsyncSession
    ) -> None:
        service = DocumentService(db_session, embedding_client=FakeEmbeddingClient())
        with pytest.raises(NotFoundError):
            await service.get_document(999_999)
