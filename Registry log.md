# InsurClaw — Registry Log
### main_log, agentic_log, agent-NAME_log Structure

---

## Overview

InsurClaw maintains a hierarchical logging system for event registry and auditability. Each executed command and JTBD (Job To Be Done) trigger is registered. Invoked agents and triggered cron jobs have an agentic workflow with dedicated registry outputs.

**Storage:** Local File System (Markdown, YAML, .txt per architecture diagram)

---

## Log Types

### 1. main_log

**Purpose:** Event registry for all executed commands and JTBD triggers.

**Scope:**
- Every cron job execution
- Every tool invocation
- Every user-initiated action
- Every approval gate crossing

**Use case:** Central audit trail for compliance, debugging, and operational monitoring.

---

### 2. agentic_log

**Purpose:** Registry output for agentic workflow — invoked agents, triggered cron jobs, hierarchical workflow.

**Scope:**
- Agent delegation events (orchestrator → specialist)
- Cron job triggers and their outcomes
- Multi-agent coordination events (voting, consensus)
- Workflow step transitions (Ingest → Retrieve → Plan → Execute → Validate → Respond)

**Use case:** Trace agentic flow for debugging, performance analysis, and workflow optimization.

---

### 3. agent-NAME_log

**Purpose:** Per-agent specialized logs for domain-specific events.

**Examples:**
- `agent-prevention_log` — Weather alerts, prevention actions, risk detections
- `agent-event_log` — Flight delays, parametric triggers, event classifications
- `agent-underwriting_log` — Renewal analyses, market scans, risk assessments
- `agent-claims_log` — FNOL intakes, settlement analyses, denial reversals
- `agent-consumer_advocate_log` — Orchestration decisions, synthesis events

**Use case:** Domain-specific audit, agent performance tracking, specialized debugging.

---

## Log Format

### Standard Entry Structure

```yaml
timestamp: "2026-03-18T14:32:01Z"
event_type: "cron_execution" | "tool_invocation" | "agent_delegation" | "approval_gate" | "user_action"
agent_id: "prevention_service" | "event_coverage" | "risk_engine" | "claims_adjuster" | "consumer_advocate"
action: "weather_check" | "flight_poll" | "claim_draft" | ...
result: "success" | "partial" | "failure"
approval_gate_status: "pending" | "approved" | "rejected" | "n/a"
details: { ... }
session_id: "uuid"
user_id: "anonymized"
```

### Field Definitions

| Field | Description |
|-------|-------------|
| `timestamp` | ISO 8601 UTC |
| `event_type` | Category of event |
| `agent_id` | Agent that performed the action |
| `action` | Specific action performed |
| `result` | Outcome of the action |
| `approval_gate_status` | If action required approval, its status |
| `details` | Event-specific payload (redacted for PII) |
| `session_id` | Session context |
| `user_id` | Anonymized user reference |

---

## Storage Locations

```
insurclaw/
├── logs/
│   ├── main_log.txt          # or main_log.yaml, main_log.md
│   ├── agentic_log.txt
│   └── agent_logs/
│       ├── agent-prevention_log.txt
│       ├── agent-event_log.txt
│       ├── agent-underwriting_log.txt
│       ├── agent-claims_log.txt
│       └── agent-consumer_advocate_log.txt
```

**Format options:**
- `.txt` — Human-readable, append-only
- `.yaml` — Structured, machine-parseable
- `.md` — Markdown tables for readability

---

## Retention and Integrity

- **Retention:** Per GDPR and regulatory requirements; minimum 7 years for insurance-related events
- **Integrity:** Daily tamper detection scan (hash chain verification) at 03:30
- **Redaction:** PII (policy numbers, IBANs, SSNs) never logged in plain text
- **Access:** Audit logs are append-only; no agent can modify historical entries

---

## Relation to Audit Trail

The `audit_log` table (SQLite) stores material decisions and actions for regulatory compliance. The file-based logs (main_log, agentic_log, agent-NAME_log) provide the operational registry. Both feed into:

- GDPR Article 22 (right to explanation)
- EU AI Act (transparency log)
- IDD (advice disclosure audit)
- Internal performance and debugging

---

*InsurClaw Registry Log v1.0 | EU Market | Mar 2026*
