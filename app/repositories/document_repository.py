from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Document


class DocumentRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(
        self, session_id: int, filename: str, file_type: str, status: str = "PENDING"
    ) -> Document:
        document = Document(
            session_id=session_id,
            filename=filename,
            file_type=file_type,
            status=status,
        )
        self._db.add(document)
        await self._db.commit()
        await self._db.refresh(document)
        return document

    async def list_by_session(self, session_id: int) -> list[Document]:
        result = await self._db.execute(
            select(Document)
            .where(Document.session_id == session_id)
            .order_by(Document.created_at)
        )
        return list(result.scalars().all())

    async def get_by_id(self, document_id: int) -> Document | None:
        return await self._db.get(Document, document_id)

    async def update_status(self, document: Document, status: str) -> Document:
        document.status = status
        await self._db.commit()
        await self._db.refresh(document)
        return document
