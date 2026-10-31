import httpx
from qdrant_client import AsyncQdrantClient
from app.core.config import get_settings
from app.db.session import check_database

settings = get_settings()


async def postgres_status() -> dict:
    try:
        await check_database()
        return {"status": "ok", "detail": "Connection successful"}
    except Exception as exc:
        return {"status": "error", "detail": f"{type(exc).__name__}: {exc}"}


async def qdrant_status() -> dict:
    client = AsyncQdrantClient(url=settings.qdrant_url, timeout=3)
    try:
        await client.get_collections()
        return {"status": "ok", "detail": "Qdrant API reachable"}
    except Exception as exc:
        return {"status": "error", "detail": f"{type(exc).__name__}: {exc}"}
    finally:
        await client.close()


async def ollama_status() -> dict:
    url = settings.ollama_base_url.rstrip("/") + "/api/tags"
    try:
        async with httpx.AsyncClient(timeout=settings.ollama_timeout_seconds) as client:
            response = await client.get(url)
            response.raise_for_status()
            payload = response.json()
        models = [item.get("name", "") for item in payload.get("models", [])]
        return {
            "status": "ok",
            "detail": "Ollama API reachable",
            "configured_model": settings.ollama_model,
            "model_available": settings.ollama_model in models,
            "models": models,
        }
    except Exception as exc:
        return {
            "status": "unavailable",
            "detail": f"{type(exc).__name__}: {exc}",
            "configured_model": settings.ollama_model,
            "model_available": False,
            "models": [],
        }
