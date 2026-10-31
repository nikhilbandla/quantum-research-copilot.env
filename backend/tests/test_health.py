from contextlib import asynccontextmanager
from fastapi.testclient import TestClient
from app.main import app


@asynccontextmanager
async def test_lifespan(_app):
    # Route tests do not require live PostgreSQL/Qdrant/Ollama services.
    yield


def test_health_endpoint():
    original_lifespan = app.router.lifespan_context
    app.router.lifespan_context = test_lifespan
    try:
        with TestClient(app) as client:
            response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
    finally:
        app.router.lifespan_context = original_lifespan


def test_root_endpoint():
    original_lifespan = app.router.lifespan_context
    app.router.lifespan_context = test_lifespan
    try:
        with TestClient(app) as client:
            response = client.get("/")
        assert response.status_code == 200
        assert response.json()["docs"] == "/docs"
    finally:
        app.router.lifespan_context = original_lifespan
