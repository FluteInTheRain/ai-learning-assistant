from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = (
        "postgresql+asyncpg://aletheia:aletheia@localhost:5432/aletheia"
    )
    jwt_secret: str = "dev-secret-change-me-32-bytes-minimum"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 24 * 7
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
