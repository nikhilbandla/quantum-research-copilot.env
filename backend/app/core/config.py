from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Quantum Computing Research Copilot"
    app_env: str = "development"
    api_prefix: str = "/api"
    backend_cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    postgres_host: str = "127.0.0.1"
    postgres_port: int = 5432
    postgres_db: str = "quantum_copilot"
    postgres_user: str = "quantum"
    postgres_password: str = "change-this-local-password"

    qdrant_url: str = "http://127.0.0.1:6333"
    qdrant_collection: str = "quantum_research"

    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "qwen2.5:7b"
    ollama_timeout_seconds: float = 5.0

    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8", extra="ignore")

    @property
    def database_url(self) -> str:
        from urllib.parse import quote_plus
        password = quote_plus(self.postgres_password)
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
