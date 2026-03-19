# InsurClaw — Product Requirements Document (PRD)
### EU Market | GenZ/Millennial Consumer Advocate | Autonomous InsurTech

---

## Document Metadata

- **Product Name:** InsurClaw
- **Status:** Active
- **Version:** 1.0
- **Last Updated:** March 2026
- **Canonical Location:** insurclaw/PRD.md

---

## 1. Executive Summary (What & Why)

### Context & Background

EU consumers are structurally disadvantaged in the insurance marketplace. They cannot interpret exclusion clauses, often miss claim eligibility, accept lowball settlements, overpay on renewals, and discover underinsurance only when filing claims. Carriers profit from this asymmetry. No product currently corrects it from the consumer side.

### Problem

- Consumers cannot interpret exclusion clauses written by carrier lawyers
- They don't know when they are eligible to claim until it's too late
- They accept lowball settlements because disputing feels too complex
- They overpay on renewals because switching friction is deliberately high
- They don't know they're underinsured until they file a claim

### Solution

InsurClaw is a personal AI agent that operates as a **trusted insurance advocate** for the user. It researches, monitors, alerts, prepares, and — with explicit user approval — acts. It is not affiliated with any carrier. It is owned entirely by the user and optimizes exclusively for their benefit.

### Primary Value Propositions

- Proactive risk prevention before loss occurs
- Real-time event detection and claim preparation (flight delay, weather, travel)
- Renewal quote analysis and market comparison
- Defensible claim packages with evidence checklists and denial risk assessment
- Autonomous consumer representation without insurer control or sponsorship

### Strategic Alignment

InsurClaw represents the consumer autonomously in the EU insurance marketplace — capable of research, assess, compare, advise, and potentially transact without the insurer's human-in-the-loop control or sponsorship.

---

## 2. Scope Definition

### In Scope (Phase 1)

| Feature | Priority | Complexity |
|---------|----------|------------|
| Flight delay detection + EC 261/2004 claim draft | Critical | Moderate |
| Weather alert monitoring (EUMETNET) | High | Low-Moderate |
| Property prevention alerts | High | Moderate |
| Renewal quote analysis + market comparison | High | Moderate |
| FNOL claim preparation + evidence checklist | Critical | Moderate |
| Settlement offer analysis + counteroffer draft | High | Moderate |
| Telegram channel delivery | Critical | Low |
| GDPR consent management | Critical | Moderate |
| Audit trail logging | Critical | Low |

### Out of Scope (Phase 1)

- Direct carrier API binding (policy purchase)
- Medical/health insurance products
- In-app dashboard (web/mobile UI)
- Carrier API direct integrations (aggregator fallback only in Phase 1)
- WhatsApp channel (Phase 2)
- Avatar/eGame coverage (Phase 2)

### Future Considerations (Phase 2+)

- WhatsApp Business API integration
- CoreLogic EU property data
- ACPR/BaFin regulatory feeds
- Avatar/eGame coverage
- In-app dashboard with risk heatmaps

---

## 3. Goals, Success, and Constraints

### One-Line Project Framing

> Make me an **autonomous insurance co-pilot** for **EU GenZ and Millennial consumers** that helps them **never miss a claim, never overpay, and never be confused by their coverage** by **researching, alerting, comparing, and preparing insurance actions autonomously on their behalf**.

### Primary Goal

Build and operate InsurClaw as an autonomous consumer insurance agent that can research, assess, compare, advise, and prepare transactions while enforcing approval gates and EU compliance constraints.

### Definition of Success

| Dimension | Success Criteria |
|-----------|------------------|
| **Business** | >80% of eligible flight delays detected and drafted; >€200 average savings per user per year |
| **User** | <10% first-submission denial rate; >4.3/5 satisfaction |
| **Technical** | <5 min time to claim draft from delay confirmation; 100% GDPR consent logged |

### Hard Constraints

- **Time:** Phased rollout by feature domain (A → B → C → D)
- **Compliance:** GDPR, IDD, EU AI Act, EC 261/2004
- **Platform:** EU data residency (Hetzner Frankfurt or Scaleway Paris)
- **Accessibility:** Mobile-first, WCAG 2.1 AA target
- **Approval:** No external action without explicit user approval

---

## 4. Target Market & User Analysis

### Ideal Customer Profile

- **Geography:** EU (primary: France, Germany, Netherlands, Nordics)
- **Age:** 20–38 (GenZ + Millennials)
- **Tech profile:** Mobile-native, Telegram/WhatsApp primary
- **Insurance:** Home/rental + travel + auto; has disputed or been confused by a claim at least once

### Personas

**Primary: "The Mobile Millennial"**
- Age: 28–38 | Location: Western EU | Income: Middle
- Has home/rental + travel + auto insurance
- Motivated by: savings detection, claim success, transparency
- Channel: Telegram primary, web app secondary

**Secondary: "The GenZ Traveler"**
- Age: 20–27 | Location: EU, mobile | Income: Entry-level
- Has travel insurance, possibly rental insurance
- Primary concern: flight delays, travel disruption, event cancellation
- Motivated by: instant value, no effort required, "AI handles it"
- Channel: WhatsApp or Telegram

---

## 5. User Stories and Acceptance Criteria

### [A] Prevention

- As a homeowner in a flood-risk zone, I want proactive weather alerts linked to my coverage, so that I can act before a loss event occurs.
- As a traveler, I want to know about travel risks at my destination before I depart, so that I can decide whether to purchase additional coverage.

**Acceptance:** Weather alert delivered before event window (>24h); alert includes specific action with contractor/resource link; estimated avoided-loss value included.

### [B] Event Coverage

- As a frequent flyer, I want my flight delays automatically detected and compensation claims pre-drafted, so that I don't have to remember to file or know the rules.
- As a music festival attendee, I want to know instantly if my cancellation insurance applies when the event is cancelled, so that I can file immediately.

**Acceptance:** Detects delay within 15 min of ADS-B confirmation; correctly calculates EC 261/2004 compensation for ≥95% of test cases; pre-drafts claim with all required fields; does not auto-submit without explicit user approval.

### [C] Underwriting

- As a policyholder receiving a renewal quote, I want to know if it is above market and what I could switch to, so that I can make an informed decision without hours of research.
- As a first-time homebuyer, I want help understanding what coverage I actually need vs. what I'm being sold, so that I don't overpay for unnecessary add-ons.

**Acceptance:** Market deviation identified within ±5% accuracy; at least one alternative product presented with coverage comparison; switching cost and timeline included; confidence level labeled clearly.

### [D] Claims

- As a user with a water damage claim, I want a complete evidence package prepared for me with the strongest possible framing, so that I can submit a claim the carrier cannot easily reject.
- As a user who received a lowball settlement, I want to know whether it's worth appealing and how to do it, so that I can recover the full amount I'm owed.

**Acceptance:** FNOL draft includes loss type, date, policy reference, coverage assessment; evidence checklist generated within 60 seconds; denial risk assessment included with counter-arguments; requires explicit user approval before any external submission.

---

## 6. Requirements

### Feature Requirements (Core)

| Feature | Overview | Priority | User Value |
|---------|----------|----------|------------|
| Flight delay + EC 261/2004 | Detect delay via ADS-B, calculate compensation, pre-draft claim | Critical | No missed claims; instant value |
| Weather prevention | EUMETNET monitoring, proactive alerts, avoided-loss estimate | High | Loss prevention; premium savings |
| Renewal analysis | Market comparison, deviation explanation, switching recommendation | High | €200+ annual savings |
| Claim preparation | FNOL draft, evidence checklist, denial risk, chronology | Critical | Higher settlement success |
| Settlement analysis | Lowball detection, counteroffer draft, counterfactual analysis | High | Full policy entitlement |

### Non-Functional Requirements

| NFR | Target |
|-----|--------|
| **Performance** | <5 min claim draft from delay confirmation; sub-second acknowledgment |
| **Security** | AES-256 at rest, TLS 1.3 in transit; auto-redact PII from outbound |
| **Reliability** | Audit log integrity; tamper detection |
| **Accessibility** | Mobile-first; 6-inch screen readable |
| **Compliance** | GDPR, IDD, EU AI Act; 100% consent logged |

### Dependencies & Integrations

- **External:** ADS-B/OpenSky, EUMETNET/MeteoSwiss, Telegram Bot API, aggregator APIs (Phase 1)
- **Internal:** SQLite + pgvector, Node.js Gateway, Docker workspaces
- **Phase 2:** WhatsApp Business API, CoreLogic EU, ACPR/BaFin feeds

---

## 7. Data, Domain, and Terminology

### Glossary

| Term | Definition |
|------|------------|
| **FNOL** | First Notice of Loss — initial claim report to carrier |
| **EC 261/2004** | EU regulation governing flight delay/cancellation compensation |
| **Parametric** | Insurance payout triggered by objective measurement (e.g., wind speed, flood depth) |
| **Approval gate** | Explicit user sign-off required before external action |
| **Consumer Advocate** | Orchestrator agent; user's sole representative |

---

## 8. Architecture (High-Level)

```
User Channels (Telegram, WhatsApp) 
    → Gateway (Node.js Daemon)
    → Consumer Advocate (Orchestrator)
    → Specialist Agents (Prevention, Event, Underwriting, Claims)
    → Tools & External APIs
    → Memory Layer (SQLite + vector)
```

Reference: [part3-techdesign-mvp.md](docs/part3-techdesign-mvp.md), [PROMPT_ANATOMY.md](PROMPT_ANATOMY.md)

---

## 9. Delivery Plan (Phases)

| Phase | Goals | Deliverables |
|-------|-------|--------------|
| **Alpha** | Flight delay + EC 261/2004 | Detection, calculation, draft |
| **Beta 1** | Weather prevention | EUMETNET alerts |
| **Beta 2** | Renewal analysis | Market comparison |
| **Beta 3** | Claim FNOL | Evidence checklist, denial risk |
| **v1.0** | Full MVP | All features + Telegram |
| **v1.1** | Settlement + dispute | Lowball detection, escalation |

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Carrier denies parametric claim despite trigger | Medium | High | Flag extraordinary circumstances; provide dispute path |
| EC 261/2004 misclassified | Low | Medium | Conservative classifier; flag ambiguous cases |
| User approves with incomplete evidence | Medium | Medium | Evidence completeness score before approval gate |
| ADS-B data lag | Low | Low | Buffer window + fallback to airline status API |
| GDPR consent not captured | Low | High | Hard-gate all personal data use behind consent check |

---

*InsurClaw PRD v1.0 | EU Market | Mar 2026*
