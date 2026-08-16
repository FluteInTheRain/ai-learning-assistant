from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Session as SessionModel
from app.repositories.session_repository import SessionRepository
from app.services.exceptions import NotFoundError


class SessionService:
    def __init__(self, db: AsyncSession) -> None:
        self._repo = SessionRepository(db)

    async def create_session(self, name: str) -> SessionModel:
        return await self._repo.create(name)

    async def list_sessions(self) -> list[SessionModel]:
        return await self._repo.list_all()

    async def get_session(self, session_id: int) -> SessionModel:
        session = await self._repo.get_by_id(session_id)
        if session is None:
            raise NotFoundError(f"Session {session_id} not found")
        return session
