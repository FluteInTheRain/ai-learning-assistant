from openai import OpenAIError
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embedding_client import EmbeddingClient
from app.ai.protocols import EmbeddingClientLike
from app.db.models import Document
from app.ingestion.chunker import chunk_pages
from app.ingestion.parser import parse_pdf
from app.repositories.chunk_repository import ChunkRepository
from app.repositories.document_repository import DocumentRepository
from app.repositories.session_repository import SessionRepository
from app.services.exceptions import (
    DocumentParsingError,
    NotFoundError,
    UnsupportedFileTypeError,
)

SUPPORTED_FILE_TYPE = "pdf"


class DocumentService:
    def __init__(
        self, db: AsyncSession, embedding_client: EmbeddingClientLike | None = None
    ) -> None:
        self._db = db
        self._session_repo = SessionRepository(db)
        self._document_repo = DocumentRepository(db)
        self._chunk_repo = ChunkRepository(db)
        self._embedding_client = embedding_client or EmbeddingClient()

    async def upload_document(
        self, session_id: int, filename: str, file_bytes: bytes
    ) -> Document:
        """Ingest an uploaded PDF: parse, chunk, embed, store.

        Sets the document's status to READY on success or FAILED if any
        ingestion step raises.
        """
        session = await self._session_repo.get_by_id(session_id)
        if session is None:
            raise NotFoundError(f"Session {session_id} not found")

        if not filename.lower().endswith(".pdf"):
            raise UnsupportedFileTypeError("Only PDF uploads are supported in v0")

        document = await self._document_repo.create(
            session_id=session_id,
            filename=filename,
            file_type=SUPPORTED_FILE_TYPE,
            status="PENDING",
        )

        try:
            pages = parse_pdf(file_bytes)
            chunks = chunk_pages(pages)
            if not chunks:
                raise DocumentParsingError("PDF produced no chunks")

            try:
                embeddings = await self._embedding_client.embed_texts(
                    [chunk.content for chunk in chunks]
                )
            except OpenAIError as exc:
                raise DocumentParsingError(
                    f"Embedding generation failed: {exc}"
                ) from exc

            await self._chunk_repo.bulk_create(
                document_id=document.id,
                chunks=[
                    (chunk.chunk_index, chunk.page_number, chunk.content, embedding)
                    for chunk, embedding in zip(chunks, embeddings, strict=True)
                ],
            )
        except Exception:
            await self._document_repo.update_status(document, "FAILED")
            raise

        return await self._document_repo.update_status(document, "READY")

    async def list_documents(self, session_id: int) -> list[Document]:
        session = await self._session_repo.get_by_id(session_id)
        if session is None:
            raise NotFoundError(f"Session {session_id} not found")
        return await self._document_repo.list_by_session(session_id)

    async def get_document(self, document_id: int) -> Document:
        document = await self._document_repo.get_by_id(document_id)
        if document is None:
            raise NotFoundError(f"Document {document_id} not found")
        return document
