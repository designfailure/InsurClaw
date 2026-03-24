# InsurClaw — Docker (local dev)

Phase 1 provides **PostgreSQL with pgvector** for alignment with [docs/part3-techdesign-mvp.md](../docs/part3-techdesign-mvp.md). There is no gateway container in this phase yet.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2

## Quick start

1. From the `insurclaw` repository root:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set a strong `POSTGRES_PASSWORD` (and update `DATABASE_URL` to match).

3. Start Postgres:

   ```bash
   docker compose up -d
   ```

4. Wait until healthy:

   ```bash
   docker compose ps
   docker inspect --format "{{.State.Health.Status}}" insurclaw-postgres
   ```

5. Verify from the host (using `psql` if installed):

   ```bash
   psql "postgresql://insurclaw:YOUR_PASSWORD@127.0.0.1:5432/insurclaw" -c "SELECT 1"
   ```

## Configuration

| Variable        | Purpose |
|----------------|---------|
| `POSTGRES_*`    | Database name, user, password, host port (see `.env.example`) |
| `DATABASE_URL`  | Use `@postgres:5432` from another Compose service; use `@127.0.0.1` from the host |

Postgres listens on **`127.0.0.1:POSTGRES_PORT`** only (not exposed on all interfaces).

## Validate

```bash
docker compose config
docker compose up -d
```

## Workspace layout (see [WORKFLOW.md](../WORKFLOW.md))

Runtime session files under `workspace/sessions/` are gitignored; the directory is kept with `workspace/sessions/.gitkeep`. When you add a gateway, bind-mount that tree or mirror it into your agent workspace.

## IronClaw / worker pattern (reference)

For **sandboxed tool execution**, see [ironclaw-main Dockerfile.worker](../../ironclaw-main/Dockerfile.worker): a separate worker image with `/workspace` and tooling for isolated jobs. InsurClaw may adopt similar patterns when a gateway exists.

## OpenClaw alignment (Phase 2+)

[OpenClaw](https://github.com/openclaw/openclaw) provides a production-grade **gateway** (WebSocket control plane, default port **18789**, health **`/healthz`**), multi-agent routing, workspace skills, and optional Docker sandboxes for non-main sessions.

Upstream [docker-compose.yml](https://github.com/openclaw/openclaw/blob/main/docker-compose.yml) uses:

- **`openclaw-gateway`**: `node dist/index.js gateway`, ports `18789` / `18790`, `restart: unless-stopped`, healthcheck on `http://127.0.0.1:18789/healthz`
- Volumes: `OPENCLAW_CONFIG_DIR` → `/home/node/.openclaw`, `OPENCLAW_WORKSPACE_DIR` → `/home/node/.openclaw/workspace`
- **`openclaw-cli`**: `network_mode: service:openclaw-gateway` for CLI attached to the same network stack

Optional **sandbox** (commented upstream): mount `/var/run/docker.sock` and `group_add` with host `DOCKER_GID` only after threat-modeling; build the image with Docker CLI enabled per upstream `Dockerfile` (`OPENCLAW_INSTALL_DOCKER_CLI=1`).

**Binding note:** With bridge networking, loopback-only bind inside the gateway can block host access; upstream documents using `--bind lan` when publishing ports and setting auth appropriately.

**Suggested integration:** combine this Compose stack with a second file or profile so `postgres` and `openclaw-gateway` share a Docker network; point `OPENCLAW_WORKSPACE_DIR` at this InsurClaw repo (or a copy) so `AGENTS.md`, `SOUL.md`, `skills/`, and `workspace/` remain the source of truth.

See [docs/OPENCLAW_INTEGRATION.md](../docs/OPENCLAW_INTEGRATION.md) for mapping InsurClaw agents to OpenClaw sessions and policies.

## Stop / reset

```bash
docker compose down
```

Remove data volume (destructive):

```bash
docker compose down -v
```
