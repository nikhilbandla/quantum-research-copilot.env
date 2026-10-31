# Quantum Computing Research Copilot

A phased, locally runnable research platform built with React + TypeScript, FastAPI, PostgreSQL, Qdrant and Ollama.

## Phase 1 status

Implemented:
- React + TypeScript + Vite frontend with working navigation and backend status panel
- FastAPI backend with health, readiness and dependency-status endpoints
- PostgreSQL connection and schema initialization
- Qdrant connectivity check
- Ollama connectivity and model listing check
- Environment-based configuration
- Docker Compose for PostgreSQL and Qdrant
- Backend automated tests

Not yet implemented: quantum simulation, circuit generation, partial trace, Bloch sphere, RAG ingestion/retrieval, AI agents, algorithm lab, tomography, entanglement analysis, authentication and research exports. These are planned for later phases; the UI marks them as planned rather than pretending they work.

## Architecture

```text
React + TypeScript (5173)
        |
        | HTTP /api
        v
FastAPI (8000) ---- Ollama (11434)
        |
        +---------- PostgreSQL (5432)
        |
        +---------- Qdrant (6333, gRPC 6334)
```

## Prerequisites

- Windows 11 or supported Windows 10 build with WSL2
- Ubuntu 22.04 or 24.04 inside WSL2
- Docker Desktop with WSL integration enabled, or Docker Engine inside WSL2
- Node.js 20.19+ or 22.12+
- Python 3.11+
- Ollama for Windows or Linux

Use one Docker environment only. If Docker Desktop is integrated with WSL2, run Docker commands from the Ubuntu terminal.

## 1. Get the project into WSL2

Extract the ZIP inside your Ubuntu filesystem, preferably under `~/projects` rather than `/mnt/c`:

```bash
mkdir -p ~/projects
cd ~/projects
unzip ~/Downloads/Quantum-Research-Copilot.zip
cd Quantum-Research-Copilot
```

If you cloned/copied the folder by another method, `cd` into its root.

## 2. Configure environment

```bash
cp .env.example .env
```

The defaults are suitable for local Docker Compose. Change secrets before exposing services beyond localhost.

## 3. Start PostgreSQL and Qdrant

```bash
docker compose up -d postgres qdrant
docker compose ps
```

PostgreSQL is bound to `127.0.0.1:5432`; Qdrant HTTP and gRPC are bound to `127.0.0.1:6333` and `127.0.0.1:6334`.

## 4. Install and start Ollama

Install Ollama from https://ollama.com/download. Then:

```bash
ollama pull qwen2.5:7b
ollama list
```

You can use another Ollama model by changing `OLLAMA_MODEL` in `.env`. The app does not download models automatically.

If Ollama runs on Windows while FastAPI runs inside WSL2, set `OLLAMA_BASE_URL` in `.env` to an address reachable from WSL2. On many WSL2 setups, `http://127.0.0.1:11434` works with localhost forwarding. If not, use the Windows host gateway address shown by `ip route | awk '/default/ {print $3}'` only if Ollama is listening on an interface reachable from WSL2. Do not expose Ollama to an untrusted network.

## 5. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -e ".[dev]"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

Health: http://localhost:8000/api/health

Readiness: http://localhost:8000/api/ready

## 6. Start the frontend

Open another Ubuntu terminal:

```bash
cd ~/projects/Quantum-Research-Copilot/frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open http://localhost:5173

## 7. Run tests

With the backend virtual environment activated:

```bash
cd backend
pytest -q
```

Frontend checks:

```bash
cd frontend
npm run typecheck
npm run build
```

## Useful endpoints

- `GET /api/health`: process liveness
- `GET /api/ready`: readiness plus PostgreSQL, Qdrant and Ollama checks
- `GET /api/system/dependencies`: detailed dependency status

A dependency being unavailable does not crash the backend. The readiness endpoint returns HTTP 503 when required services (PostgreSQL or Qdrant) are unavailable. Ollama is reported as optional in Phase 1.

## Troubleshooting

- PostgreSQL connection refused: `docker compose ps` and `docker compose logs postgres`.
- Qdrant unavailable: `docker compose logs qdrant`; verify port 6333.
- Ollama unavailable: `ollama serve` (if not already running), `ollama list`, then check `OLLAMA_BASE_URL`.
- Frontend cannot reach backend: confirm backend is on port 8000; Vite proxies `/api` to `http://localhost:8000`.
- Port already in use: change the host-side port in `docker-compose.yml` or stop the conflicting process.
- WSL filesystem performance: keep project files in `~/projects`, not `/mnt/c`.

## Security note

This is a local development foundation, not a production deployment. Do not expose PostgreSQL, Qdrant or Ollama publicly. Before production, add authentication, authorization, TLS, secret management, migrations, rate limiting, upload scanning, isolated job execution, observability and backups.
