from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas.auth import SignupRequest, SignupResponse, UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED
)
async def signup(
    data: SignupRequest, session: AsyncSession = Depends(get_db)
) -> SignupResponse:
    service = AuthService(session)
    user, token = await service.signup(data)
    return SignupResponse(user=UserOut.model_validate(user), access_token=token)
