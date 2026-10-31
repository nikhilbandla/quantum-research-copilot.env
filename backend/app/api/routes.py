from fastapi import APIRouter
from app.core.config import get_settings
from app.services.dependencies import ollama_status, postgres_status, qdrant_status

router = APIRouter()
settings = get_settings()


@router.get("/health", tags=["system"])
async def health() -> dict:
    return {"status": "ok", "application": settings.app_name, "environment": settings.app_env}


@router.get("/system/dependencies", tags=["system"])
async def dependencies() -> dict:
    postgres, qdrant, ollama = await postgres_status(), await qdrant_status(), await ollama_status()
    return {"postgres": postgres, "qdrant": qdrant, "ollama": ollama}


@router.get("/ready", tags=["system"])
async def ready() -> dict:
    from fastapi.responses import JSONResponse
    from fastapi import Response
    postgres, qdrant, ollama = await postgres_status(), await qdrant_status(), await ollama_status()
    required_ok = postgres["status"] == "ok" and qdrant["status"] == "ok"
    body = {
        "status": "ready" if required_ok else "not_ready",
        "required_dependencies": {"postgres": postgres, "qdrant": qdrant},
        "optional_dependencies": {"ollama": ollama},
    }
    return JSONResponse(status_code=200 if required_ok else 503, content=body)
