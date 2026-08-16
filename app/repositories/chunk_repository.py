from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import DocumentChunk


class ChunkRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def bulk_create(
        self,
        document_id: int,
        chunks: list[tuple[int, int, str, list[float]]],
    ) -> list[DocumentChunk]:
        """Create chunks for a document.

        Each tuple is (chunk_index, page_number, content, embedding).
        """
        rows = [
            DocumentChunk(
                document_id=document_id,
                chunk_index=chunk_index,
                page_number=page_number,
                content=content,
                embedding=embedding,
            )
            for chunk_index, page_number, content, embedding in chunks
        ]
        self._db.add_all(rows)
        await self._db.commit()
        return rows

    async def list_by_document(self, document_id: int) -> list[DocumentChunk]:
        result = await self._db.execute(
            select(DocumentChunk)
            .where(DocumentChunk.document_id == document_id)
            .order_by(DocumentChunk.chunk_index)
        )
        return list(result.scalars().all())
