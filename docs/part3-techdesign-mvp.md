# Part 3 — Technical Design (MVP)
### InsurClaw | Stack, APIs, Data Model, Agent Config
> Phase: TECH DESIGN | Vibe-Coding Stage: Idea → Research → PRD → **Tech Design**

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Runtime** | Node.js (TypeScript) | Async-native, strong ecosystem, Claw-compatible |
| **AI Orchestration** | Claude Opus 4.6 (Orchestrator), Claude Sonnet (Specialists) | Reasoning quality + cost efficiency per tier |
| **Agent Framework** | OpenClaw / custom agentic loop | Multi-agent coordination, workspace isolation |
| **Database** | SQLite + pgvector (Postgres for production) | Local-first for dev; vector search for risk profiles |
| **Cron / Scheduling** | Node-cron + persistent state file | Weather monitoring, flight polling, renewal checks |
| **Messaging** | Telegram Bot API (primary), WhatsApp Business API (Phase 2) | Where target users already live |
| **Containerization** | Docker | Workspace isolation per agent |
| **EU Data Residency** | Hetzner (Frankfurt) or Scaleway (Paris) | GDPR compliance; no US-only infrastructure |
| **Encryption** | AES-256 at rest, TLS 1.3 in transit | Insurance data sensitivity |
| **Monitoring** | Self-hosted (Prometheus + Grafana) or Uptime Kuma | Audit trail + operational health |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER CHANNELS                             │
│          Telegram Bot | WhatsApp (Ph2) | Web (Ph3)          │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  GATEWAY (Node.js Daemon)                                   │
│  - Parse intent, authenticate, session management           │
│  - Route to Orchestrator                                    │
│  - Audit log all inbound messages                           │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  CONSUMER_ADVOCATE (Orchestrator — Claude Opus)             │
│  - Load user context from memory layer                      │
│  - Classify intent → delegate to specialist                 │
│  - Manage approval gates                                    │
│  - Synthesize multi-agent outputs                           │
└──────┬───────────┬───────────┬───────────┬─────────────────┘
       ▼           ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│PREVENTION│ │ EVENT    │ │UNDERWRITE│ │ CLAIMS   │
│ AGENT    │ │ AGENT    │ │ AGENT    │ │ AGENT    │
│(Sonnet)  │ │(Sonnet)  │ │(Opus)    │ │(Opus+CV) │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
       ▼           ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────┐
│  TOOLS & EXTERNAL APIs                                      │
│  ADS-B | EUMETNET | Carrier APIs | Aggregators | Legal DB   │
└─────────────────────────────────────────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────┐
│  MEMORY LAYER (SQLite + vector)                             │
│  User profile | Policies | Claims | Consent | Audit log     │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Model

### `users` table
```sql
CREATE TABLE users (
  id          TEXT PRIMARY KEY,           -- UUID
  telegram_id TEXT UNIQUE,
  jurisdiction TEXT DEFAULT 'EU',         -- e.g., 'FR', 'DE', 'NL'
  timezone    TEXT DEFAULT 'Europe/Paris',
  tier        TEXT DEFAULT 'free',        -- 'free' | 'premium'
  gdpr_consent_at DATETIME,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `policies` table
```sql
CREATE TABLE policies (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id),
  carrier     TEXT,
  type        TEXT,                       -- 'home' | 'travel' | 'auto' | 'health'
  policy_number TEXT,
  start_date  DATE,
  end_date    DATE,
  premium_annual REAL,
  coverage_summary TEXT,                  -- JSON blob
  raw_document_path TEXT,                 -- encrypted local path
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `claims` table
```sql
CREATE TABLE claims (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id),
  policy_id   TEXT REFERENCES policies(id),
  event_type  TEXT,                       -- 'flight_delay' | 'water_damage' | etc.
  event_date  DATE,
  status      TEXT,                       -- 'draft' | 'submitted' | 'open' | 'settled' | 'denied'
  estimated_value_min REAL,
  estimated_value_max REAL,
  settled_value REAL,
  evidence_paths TEXT,                    -- JSON array of encrypted file paths
  audit_trail TEXT,                       -- JSON array of timestamped actions
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `risk_profiles` table
```sql
CREATE TABLE risk_profiles (
  user_id         TEXT PRIMARY KEY REFERENCES users(id),
  properties      TEXT,                   -- JSON array of property objects
  travel_frequency TEXT,                  -- 'low' | 'medium' | 'high'
  registered_routes TEXT,                 -- JSON array of commute routes
  risk_scores     TEXT,                   -- JSON: {weather, property, travel, cyber}
  last_updated    DATETIME
);
```

### `audit_log` table
```sql
CREATE TABLE audit_log (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id),
  timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_id    TEXT,
  action_type TEXT,                       -- 'recommendation' | 'approval_gate' | 'external_action'
  action_detail TEXT,
  outcome     TEXT,
  approved_by TEXT,                       -- 'user' | 'auto' | 'escalated'
  gdpr_basis  TEXT                        -- legal basis for any data processing
);
```

---

## External API Dependencies (MVP)

| API | Purpose | Provider | Auth |
|-----|---------|----------|------|
| ADS-B Exchange / OpenSky | Flight delay detection | OpenSky (free EU) | API key |
| EUMETNET / MeteoSwiss | Weather alert monitoring | EUMETNET (subscription) | API key |
| Aggregator (Trivago / Check24 style) | Renewal market comparison | TBD — research Phase 1 | API key |
| EC 261/2004 calculator | Compensation rules | Internal (build) | N/A |
| Telegram Bot API | User channel delivery | Telegram | Bot token |

**Phase 2 additions:** WhatsApp Business API, CoreLogic EU property data, ACPR/BaFin regulatory feeds

---

## Agent Configuration (YAML)

```yaml
# agent_config.yaml

orchestrator:
  id: consumer_advocate
  model: claude-opus-4-6
  max_turns: 20
  approval_gates:
    - submit_claim
    - bind_policy
    - send_external_email
    - accept_settlement
    - share_data_external

agents:
  - id: prevention_service
    model: claude-sonnet
    workspace: /workspace/prevention_agent/
    cron:
      weather_check: "*/15 * 10 1-3,10-12 *"   # Every 15 min, Oct-Mar
      weather_check_low_season: "0 9 * * *"      # Daily 9am, Apr-Sep
    skills:
      - skills/prevention_as_service/SKILL.md
      - skills/event_coverage/SKILL.md

  - id: event_coverage
    model: claude-sonnet
    workspace: /workspace/event_agent/
    cron:
      flight_poll: "*/5 * * * *"                 # Every 5 min (travel-window only)
    skills:
      - skills/event_coverage/SKILL.md

  - id: risk_engine
    model: claude-opus-4-6
    workspace: /workspace/underwriting_agent/
    skills:
      - skills/underwriting_engine/SKILL.md

  - id: claims_adjuster
    model: claude-opus-4-6
    workspace: /workspace/claims_agent/
    skills:
      - skills/claims_assessment/SKILL.md
```

---

## Security Controls

- All agent workspaces containerized (Docker, no host access)
- Pre-commit hook: block `.env`, `*.pem`, `*.key` commits
- Auto-redact PII from Telegram outbound messages (policy numbers, IBANs)
- Financial data restricted to DM channels — group chat detection + block
- Nightly audit log integrity check (hash chain verification)
- Monthly: scan memory files for prompt injection artifacts

---

## Failure Modes & Mitigations

| Failure | Detection | Mitigation |
|---------|-----------|-----------|
| ADS-B data lag | Timestamp comparison vs. airline status API | Fallback to airline API on >10 min lag |
| EUMETNET API outage | Heartbeat + last-data-age check | Alert user, pause weather monitoring, use backup source |
| Agent timeout | Max_turns exceeded | Escalate to user with partial result |
| Approval gate ignored | Audit log check | Hard-block action until gate cleared |
| Memory corruption | SQLite integrity check on boot | Restore from last backup |

---

## Rollout Plan

| Phase | Features | Timeline |
|-------|----------|---------|
| Alpha | Flight delay detection + EC 261/2004 draft | Weeks 1–3 |
| Beta 1 | Weather prevention alerts | Weeks 4–5 |
| Beta 2 | Renewal quote analysis | Weeks 6–7 |
| Beta 3 | Claim FNOL preparation | Weeks 8–9 |
| v1.0 | All MVP features + Telegram delivery | Week 10 |
| v1.1 | Settlement analysis + dispute escalation | Week 12 |
