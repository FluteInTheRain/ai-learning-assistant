from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import GeneratedContent


class GeneratedContentRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(
        self, document_id: int, action_type: str, content: str
    ) -> GeneratedContent:
        generated = GeneratedContent(
            document_id=document_id, action_type=action_type, content=content
        )
        self._db.add(generated)
        await self._db.commit()
        await self._db.refresh(generated)
        return generated

    async def list_by_document(self, document_id: int) -> list[GeneratedContent]:
        result = await self._db.execute(
            select(GeneratedContent)
            .where(GeneratedContent.document_id == document_id)
            .order_by(GeneratedContent.created_at)
        )
        return list(result.scalars().all())
