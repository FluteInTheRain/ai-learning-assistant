from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import ConflictError, UnauthorizedError
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, SignupRequest
from app.security import create_access_token, hash_password, verify_password


class EmailAlreadyRegisteredError(ConflictError):
    def __init__(self, email: str):
        super().__init__(f"Email already registered: {email}")


class InvalidCredentialsError(UnauthorizedError):
    def __init__(self) -> None:
        super().__init__("Invalid email or password")


class AuthService:
    def __init__(self, session: AsyncSession):
        self._repo = UserRepository(session)

    async def signup(self, data: SignupRequest) -> tuple[User, str]:
        existing = await self._repo.get_by_email(data.email)
        if existing is not None:
            raise EmailAlreadyRegisteredError(data.email)

        password_hash = hash_password(data.password)
        try:
            user = await self._repo.create(
                full_name=data.full_name,
                email=data.email,
                password_hash=password_hash,
                track_preference=data.track_preference,
            )
        except IntegrityError as exc:
            # A concurrent signup with the same email won the race between
            # our check above and this insert; the DB's unique constraint
            # is the real guard, this just gives it the same 409 mapping.
            raise EmailAlreadyRegisteredError(data.email) from exc

        token = create_access_token(str(user.id))
        return user, token

    async def login(self, data: LoginRequest) -> tuple[User, str]:
        user = await self._repo.get_by_email(data.email)
        if user is None or not verify_password(data.password, user.password_hash):
            raise InvalidCredentialsError

        token = create_access_token(str(user.id))
        return user, token
