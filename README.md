# InsurClaw 🛡🦞

**Autonomous Consumer Insurance Advocate | EU Market | GenZ & Millennials**

> A personal AI agent that represents you — not carriers — in the EU insurance marketplace. Research, monitor, alert, prepare, and act on your behalf. Never miss a claim. Never overpay. Never be confused by your coverage.
> 
https://insurclaw.manus.space/
>
> <img width="933" height="720" alt="image" src="https://github.com/user-attachments/assets/598b2f06-47d1-455b-8663-286084a27555" />

---

## What Is InsurClaw?

InsurClaw is an **autonomous InsurTech agent** built for EU consumers. It operates as your trusted insurance advocate: proactive, loyal, and entirely on your side. No carrier affiliation. No broker sponsorship. You own it. It optimizes exclusively for your benefit.

**The lobster thing:** Hard to kill, never stops growing, asymmetric claws — one for crushing unfair denials, one for cutting through bureaucracy. You run cron jobs at 3am while carriers sleep. 🦞

---
<img width="1610" height="626" alt="IMG_8610" src="https://github.com/user-attachments/assets/289457fa-7fa9-44f3-a8ec-77565daf3d16" />

## The Problem

EU consumers are structurally disadvantaged:

- Cannot interpret exclusion clauses written by carrier lawyers
- Miss claim eligibility until it's too late
- Accept lowball settlements because disputing feels too complex
- Overpay on renewals due to deliberate switching friction
- Discover underinsurance only when filing claims

**InsurClaw🛡🦞 corrects this asymmetry.**

---

## Value Propositions

| Benefit | How |
|---------|-----|
| **Proactive prevention** | Weather alerts, maintenance nudges, travel risk assessment — before loss occurs |
| **Real-time event detection** | Flight delays (EC 261/2004), weather parametric triggers, travel disruption |
| **Renewal intelligence** | Market comparison, deviation analysis, switching recommendations |
| **Defensible claims** | FNOL drafts, evidence checklists, denial risk assessment, counteroffer support |
| **Autonomous advocacy** | Research, assess, compare, advise — no insurer control or sponsorship |

---

## Feature Scope 🎯(MVP)

| Module | Features |
|--------|----------|
| **[A] Prevention** | Weather alerts (EUMETNET), property maintenance, travel advisories, cyber hygiene |
| **[B] Event Coverage** | Flight delay (EC 261/2004), weather parametric, commute disruption, travel guardian |
| **[C] Underwriting** | Risk engine, market comparison, renewal analysis, portfolio optimization |
| **[D] Claims** | Loss adjuster, appraisal, assessor, settlement estimation, dispute escalation |

---

## Architecture

```
User Channels (Telegram, WhatsApp)
    → Gateway (Node.js Daemon)
    → Consumer Advocate (Orchestrator)
    → Specialist Agents (Prevention, Event, Underwriting, Claims)
    → Tools & External APIs
    → Memory Layer (SQLite + pgvector)
```

### Agent🤖 Hierarchy

| Agent | Role | Model |
|-------|------|-------|
| **Consumer Advocate** | Orchestrator — single point of contact, coordinates specialists | Claude Opus |
| **Prevention Agent** | Stop losses before they happen | Claude Sonnet |
| **Event Agent** | Detect events in real-time, pre-draft claims | Claude Sonnet |
| **Underwriting Agent** | Risk modeling, market comparison, renewal analysis | Claude Opus |
| **Claims Agent** | Defensible claim packages, lowball detection, dispute escalation | Claude Opus |

---
<img width="1600" height="873" alt="IMG_8609" src="https://github.com/user-attachments/assets/482b25a3-555f-4504-867e-45bbdc156bf8" />

## Tech✨ Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (TypeScript) |
| AI | Claude Opus (orchestrator), Claude Sonnet (specialists) |
| Database | SQLite + pgvector (Postgres for production) |
| Messaging | Telegram Bot API (primary), WhatsApp (Phase 2) |
| Infrastructure | Docker, Hetzner Frankfurt / Scaleway Paris (EU data residency) |
| Security | AES-256 at rest, TLS 1.3 in transit |

---

## Directory Structure

```
insurclaw/
├── README.md                  ← you are here
├── SYSTEM_PROMPT.md           ← master compiled system prompt (Cursor-ready)
│
├── IDENTITY.md                ← Layer 1: Who InsurClaw is
├── SOUL.md                    ← Layer 1: Tone, humor, vibe rules
├── SAFETY.md                  ← Layer 2: Guardrails, approval gates
├── EU_COMPLIANCE.md           ← Layer 3: GDPR, IDD, EU AI Act
├── AGENTS.md                  ← Layer 5: Multi-agent orchestration
├── WORKFLOW.md                ← Layer 8: Runtime context, cron, tools
├── Tools.md                   ← Tool definitions, per-intent mapping
├── Components.md              ← Agent hierarchy, gateway, memory
│
├── skills/
│   ├── prevention_as_service/SKILL.md
│   ├── event_coverage/SKILL.md
│   ├── underwriting_engine/SKILL.md
│   └── claims_assessment/SKILL.md
│
├── docs/
│   ├── part1-deepresearch.md
│   ├── part2-prd-mvp.md
│   ├── part3-techdesign-mvp.md
│   └── part4-notes-for-agent.md
│
└── workspace/
    ├── consumer_advocate/
    ├── prevention_agent/
    ├── event_agent/
    ├── underwriting_agent/
    └── claims_agent/
```

---

## Quick Start (Cursor🏴‍☠️)

1. Open `SYSTEM_PROMPT.md` and copy the prompt block at the bottom
2. Paste into Cursor's system prompt (Settings → Rules for AI)
3. Open the relevant `docs/` phase file for your current build stage
4. Reference `@skills/{module}/SKILL.md` when working on a specific feature
5. Use `@AGENTS.md` when configuring multi-agent coordination

---

## Vibe-Coding🤖👨‍💻 Workflow

```
💡 IDEA → 📊 RESEARCH → 📋 PRD → 🏗️ TECH DESIGN → 🤖 AGENT CONFIG → 🚀 BUILD MVP
```

**Rules:**

- Do not skip discovery — ask 2+ clarifying questions before PRD
- Test after every meaningful change — never assume generated code works
- Propose the smallest viable slice first
- Show what is built now, what is deferred, and why
- Use explicit success criteria

---

## Operating Modes

| Mode | Purpose |
|------|---------|
| **Product Builder** | Master orchestrator for the vibe-coding build workflow |
| **Consumer Agent** | Autonomous user representative in the EU insurance marketplace |

---

## Compliance & Safety

- **GDPR:** Consent logged, data minimization, right to erasure
- **Approval gates:** No external action (claims, emails, policy changes) without explicit user approval
- **EU AI Act:** High-risk classification; human oversight pathway
- **EC 261/2004:** Flight delay compensation auto-calculation

See `SAFETY.md` and `EU_COMPLIANCE.md` for full details.

---

## Roadmap

| Phase | Goals |
|-------|-------|
| **Alpha** | Flight delay + EC 261/2004 detection, calculation, draft |
| **Beta 1** | Weather prevention (EUMETNET alerts) |
| **Beta 2** | Renewal analysis, market comparison |
| **Beta 3** | Claim FNOL preparation, evidence checklist |
| **v1.0** | Full MVP + Telegram delivery |
| **v1.1** | Settlement analysis, dispute escalation |

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [PRD.md](PRD.md) | Product requirements, user stories, acceptance criteria |
| [IDENTITY.md](IDENTITY.md) | Core identity, character, boundaries |
| [SOUL.md](SOUL.md) | Tone, humor, channel rules |
| [AGENTS.md](AGENTS.md) | Agent definitions, coordination protocols |
| [WORKFLOW.md](WORKFLOW.md) | Cron schedules, intent mapping, context injection |
| [Tools.md](Tools.md) | Tool definitions, per-intent mapping |

---

*InsurClaw v1.0 | EU Market | March 2026*

*Build like a sharp operator. Keep the shell on. 🦞*

https://www.linkedin.com/company/insurclaw

<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/2b0d9981-87c1-40c6-963b-d4d2d7a8baa3" />

