# InsurClaw and OpenClaw alignment

This note is a **roadmap** for integrating [OpenClaw](https://github.com/openclaw/openclaw) as the gateway/control plane while keeping InsurClaw’s domain docs, skills, and workspace layout as the product source of truth.

## Roles

| InsurClaw (this repo) | OpenClaw (upstream) |
|----------------------|---------------------|
| Consumer Advocate + 4 specialist agents ([AGENTS.md](../AGENTS.md)) | Multi-agent routing, per-agent workspaces and sessions |
| `skills/*/SKILL.md` | Workspace skills under the mounted workspace |
| `workspace/sessions/` ([WORKFLOW.md](../WORKFLOW.md)) | Injected context + files alongside OpenClaw session state |
| Postgres + pgvector (Compose `postgres` service) | Domain store for embeddings, policies, audit — connect via a small bridge or app layer when you implement it |

## Session naming (suggested)

When configuring OpenClaw, use stable session or agent labels that map to InsurClaw:

| Specialist | InsurClaw `agent_id` (from part3 / AGENTS) | Purpose |
|------------|---------------------------------------------|---------|
| Orchestrator | `consumer_advocate` | Single user-facing coordinator |
| Prevention | `prevention_service` | Weather, maintenance, travel risk |
| Event | `event_coverage` | Flight delay, parametric triggers |
| Underwriting | `risk_engine` | Renewal, market comparison |
| Claims | `claims_adjuster` | FNOL, disputes, evidence |

Use OpenClaw’s **session coordination** (`sessions_list`, `sessions_history`, `sessions_send`) where the orchestrator must hand off tasks or pull results from specialists without mixing channel context.

## Approval gates

InsurClaw defines approval gates for external actions (e.g. submit claim, bind policy, send email). Map these in OpenClaw via:

- Tool policy / deny-by-default for dangerous tools on non-main sessions
- Explicit human confirmation steps in prompts or channel flows (Telegram/WhatsApp) as implemented in your gateway config

Do not automate regulatory or financial commitments without explicit user approval, aligned with [SAFETY.md](../SAFETY.md) and [EU_COMPLIANCE.md](../EU_COMPLIANCE.md).

## Sandbox (`agents.defaults.sandbox`)

OpenClaw can run **non-main** sessions in Docker sandboxes when the image includes the Docker CLI and optional `docker.sock` access. That matches InsurClaw’s “tools in isolated Docker workspaces” intent.

Treat socket mount as **high privilege**: only enable on trusted hosts, with correct `DOCKER_GID`, and after reviewing [OpenClaw’s Docker install docs](https://docs.openclaw.ai/install/docker).

## Data residency (EU)

- Run Postgres and (if used) the OpenClaw gateway on **EU-region** infrastructure when operating for EU users.
- Keep channel credentials and OpenClaw config paths (`OPENCLAW_CONFIG_DIR`) off shared backups unless encrypted.
- Telegram and other channels process data according to your provider settings; document sub-processors in your privacy materials.

## Compose topology (Phase 2)

1. Keep `docker-compose.yml` with the `postgres` service.
2. Add `docker-compose.openclaw.yml` (or a Compose **profile**) that defines `openclaw-gateway` and attaches `networks` to the same project network as `postgres`.
3. Set `OPENCLAW_WORKSPACE_DIR` to a host path that contains this repository (or a symlinked tree) so `AGENTS.md`, `SOUL.md`, `skills/`, and `workspace/` are visible inside the container.

Until a bridge service exists, OpenClaw’s local config database and InsurClaw’s Postgres are separate; plan migrations or sync jobs when you model users, policies, and claims in SQL per [part3-techdesign-mvp.md](part3-techdesign-mvp.md).
