from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from app.core.config import get_settings

settings = get_settings()
engine = create_async_engine(settings.database_url, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def check_database() -> None:
    from sqlalchemy import text
    async with engine.connect() as connection:
        await connection.execute(text("SELECT 1"))
