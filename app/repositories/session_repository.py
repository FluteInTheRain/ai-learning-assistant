from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Session as SessionModel


class SessionRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(self, name: str) -> SessionModel:
        session = SessionModel(name=name)
        self._db.add(session)
        await self._db.commit()
        await self._db.refresh(session)
        return session

    async def list_all(self) -> list[SessionModel]:
        result = await self._db.execute(
            select(SessionModel).order_by(SessionModel.created_at)
        )
        return list(result.scalars().all())

    async def get_by_id(self, session_id: int) -> SessionModel | None:
        return await self._db.get(SessionModel, session_id)
