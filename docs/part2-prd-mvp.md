# Part 2 — Product Requirements Document (MVP)
### InsurClaw | EU Market | GenZ/Millennial Consumer Advocate
> Phase: PRD | Vibe-Coding Stage: Idea → Research → **PRD**

---

## One-Line Framing

> Make me an **autonomous insurance co-pilot**
> for **EU GenZ and Millennial consumers**
> that helps them **never miss a claim, never overpay, and never be confused by their coverage**
> by **researching, alerting, comparing, and preparing insurance actions autonomously on their behalf**.

---

## Problem

EU consumers are structurally disadvantaged in the insurance marketplace:
- They cannot interpret exclusion clauses written by carrier lawyers
- They don't know when they are eligible to claim until it's too late
- They accept lowball settlements because disputing feels too complex
- They overpay on renewals because switching friction is deliberately high
- They don't know they're underinsured until they file a claim

Carriers profit from this asymmetry. No product currently corrects it from the consumer side.

---

## Solution

InsurClaw is a personal AI agent that operates as a **trusted insurance advocate** for the user.
It researches, monitors, alerts, prepares, and — with explicit user approval — acts.

It is not affiliated with any carrier. It is not compensated by any insurer.
It is owned entirely by the user and optimizes exclusively for their benefit.

---

## Target Users

### Primary Persona: "The Mobile Millennial"
- Age: 28–38 | Location: Western EU | Income: Middle
- Has home/rental + travel + auto insurance
- Has disputed or been confused by a claim at least once
- Motivated by: savings detection, claim success, transparency
- Channel: Telegram primary, web app secondary

### Secondary Persona: "The GenZ Traveler"
- Age: 20–27 | Location: EU, mobile | Income: Entry-level
- Has travel insurance, possibly rental insurance
- Primary concern: flight delays, travel disruption, event cancellation
- Motivated by: instant value, no effort required, "AI handles it"
- Channel: WhatsApp or Telegram

---

## User Stories

**[A] Prevention**
- As a homeowner in a flood-risk zone, I want proactive weather alerts linked to my coverage, so that I can act before a loss event occurs.
- As a traveler, I want to know about travel risks at my destination before I depart, so that I can decide whether to purchase additional coverage.

**[B] Event Coverage**
- As a frequent flyer, I want my flight delays automatically detected and compensation claims pre-drafted, so that I don't have to remember to file or know the rules.
- As a music festival attendee, I want to know instantly if my cancellation insurance applies when the event is cancelled, so that I can file immediately.

**[C] Underwriting**
- As a policyholder receiving a renewal quote, I want to know if it is above market and what I could switch to, so that I can make an informed decision without hours of research.
- As a first-time homebuyer, I want help understanding what coverage I actually need vs. what I'm being sold, so that I don't overpay for unnecessary add-ons.

**[D] Claims**
- As a user with a water damage claim, I want a complete evidence package prepared for me with the strongest possible framing, so that I can submit a claim the carrier cannot easily reject.
- As a user who received a lowball settlement, I want to know whether it's worth appealing and how to do it, so that I can recover the full amount I'm owed.

---

## MVP Scope

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

---

## Acceptance Criteria

**Flight delay claim:**
- [ ] Detects delay within 15 min of ADS-B confirmation
- [ ] Correctly calculates EC 261/2004 compensation amount for ≥95% of test cases
- [ ] Pre-drafts claim with all required fields populated
- [ ] Does not auto-submit without explicit user approval
- [ ] Flags "extraordinary circumstances" exclusion risk when applicable

**Prevention alerts:**
- [ ] Weather alert delivered before event window (>24h in advance where forecast available)
- [ ] Alert includes specific action with contractor/resource link
- [ ] Estimated avoided-loss value included
- [ ] No duplicate alerts for same risk event

**Claim preparation:**
- [ ] FNOL draft includes: loss type, date, policy reference, coverage assessment
- [ ] Evidence checklist generated within 60 seconds of FNOL intake
- [ ] Denial risk assessment included with counter-arguments where applicable
- [ ] Requires explicit user approval before any external submission

**Renewal analysis:**
- [ ] Market deviation identified within ±5% accuracy (vs. aggregator benchmark)
- [ ] At least one alternative product presented with coverage comparison
- [ ] Switching cost and timeline included
- [ ] Confidence level labeled clearly

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|------------|
| Flight delay claim rate | >80% of eligible delays detected and drafted | ADS-B vs. filed claims |
| Time to claim draft | <5 min from delay confirmation | Timestamp log |
| Renewal savings identified | >€200 average per user per year | User-confirmed switches |
| Claim submission quality | <10% first-submission denial rate | Carrier response tracking |
| User satisfaction | >4.3/5 | In-app feedback |
| GDPR compliance | 100% consent logged | Audit trail |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Carrier denies parametric claim despite trigger | Medium | High | Flag extraordinary circumstances; provide dispute path |
| EC 261/2004 "extraordinary circumstances" misclassified | Low | Medium | Conservative classifier; flag ambiguous cases |
| User approves submission with incomplete evidence | Medium | Medium | Evidence completeness score before approval gate |
| ADS-B data lag on short-haul routes | Low | Low | Buffer window + fallback to airline status API |
| GDPR consent not properly captured | Low | High | Hard-gate all personal data use behind consent check |
