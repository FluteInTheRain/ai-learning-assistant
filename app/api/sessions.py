from fastapi import APIRouter

from app.db.session import DbSession
from app.schemas.sessions import SessionCreate, SessionResponse
from app.services.session_service import SessionService

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse, status_code=201)
async def create_session(session_in: SessionCreate, db: DbSession) -> SessionResponse:
    service = SessionService(db)
    session = await service.create_session(session_in.name)
    return SessionResponse.model_validate(session)


@router.get("", response_model=list[SessionResponse])
async def list_sessions(db: DbSession) -> list[SessionResponse]:
    service = SessionService(db)
    sessions = await service.list_sessions()
    return [SessionResponse.model_validate(s) for s in sessions]


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: int, db: DbSession) -> SessionResponse:
    service = SessionService(db)
    session = await service.get_session(session_id)
    return SessionResponse.model_validate(session)
