from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest, UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
async def signup(
    data: SignupRequest, session: AsyncSession = Depends(get_db)
) -> AuthResponse:
    service = AuthService(session)
    user, token = await service.signup(data)
    return AuthResponse(user=UserOut.model_validate(user), access_token=token)


@router.post("/login", response_model=AuthResponse)
async def login(
    data: LoginRequest, session: AsyncSession = Depends(get_db)
) -> AuthResponse:
    service = AuthService(session)
    user, token = await service.login(data)
    return AuthResponse(user=UserOut.model_validate(user), access_token=token)
