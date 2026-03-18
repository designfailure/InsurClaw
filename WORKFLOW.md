# InsurClaw — Workflow
### Runtime Context Assembly, Cron, Tools, Vibe-Coding Spine

---

## Dynamic Context Injection (Per-Turn)

Tools are loaded per turn based on classified user intent — not globally.

### Intent = "flight delay"
- `flight.fetch_status(flight_number)` — ADS-B / airline real-time data
- `ec261.calculate_compensation(hours, km)` — EU regulation lookup
- `claim.draft_parametric(event, evidence)` — Pre-fill claim package
- `user.request_approval(action, summary)` — Gate submission
- `messaging.notify(channel, message)` — Deliver to Telegram/WhatsApp

### Intent = "policy comparison" / "renewal review"
- `underwriting.risk_assess(property_data)` — Risk modeling
- `market.scan_policies(coverage_req)` — Live carrier comparison
- `portfolio.optimize(current_policies)` — Bundling + correlation analysis
- `market.price_deviation(quote, zone)` — "23% above market" detection

### Intent = "claim filing" / "dispute"
- `claims.analyze_coverage(policy_id, event)` — Coverage applicability
- `claims.analyze_denial(denial_letter)` — Exclusion parsing
- `legal.search_precedent(jurisdiction, issue)` — Case law lookup
- `dispute.generate_appeal(claim_id, grounds)` — Draft documentation
- `cost.estimate_settlement_range(claim_data)` — Reserve analysis

### Intent = "risk prevention"
- `weather.fetch_alerts(location, 72h)` — EUMETNET/MeteoSwiss
- `property.check_vulnerabilities(property_id)` — Maintenance flags
- `travel.assess_itinerary(itinerary)` — Real-time risk scoring
- `prevention.generate_actions(risk_profile)` — Ranked intervention list

---

## Workspace Structure

```
/workspace/sessions/{session_id}/
├── user_risk_profile.json
├── active_policies/
│   ├── home_{policy_id}.json
│   ├── travel_{policy_id}.json
│   └── auto_{policy_id}.json
├── claim_history/
│   └── {claim_id}.json
├── skills_cache/
│   └── {loaded_skills_for_session}
├── agent_outputs/
│   └── {agent_id}_{timestamp}.json
└── compliance_state/
    ├── gdpr_consent.json
    ├── jurisdiction.json
    └── approval_log.json
```

---

## Cron Schedules

| Task | Schedule | Trigger |
|------|----------|---------|
| Weather monitoring | Every 15 min | Storm season (Oct–Mar), alert threshold |
| Flight delay polling | Every 5 min | Active travel window (calendar-aware) |
| Policy renewal checks | Daily at 09:00 CET | 30, 14, 7, 3 days before renewal |
| Claims status checks | Every 30 min | Active open claims only |
| Market price scan | Weekly | On significant portfolio events |
| GDPR consent review | Monthly | Automated data minimization check |
| Audit log integrity | Daily at 03:30 | Tamper detection scan |
| Agent performance update | After each resolved task | Confidence calibration |

**Cron philosophy:** Alert only when something needs attention. Silence = healthy.

---

## Heartbeats

**Heartbeat prompt:** "Confirm operational status. Check for urgent alerts."  
**Ack behavior:** Silent unless exception detected.

**Daily checks:**
- Weather monitoring data is fresh (< 15 min old during storm season)
- Flight polling active during calendar-detected travel windows
- No recurring errors in agent logs
- GDPR consent state is valid and current
- Audit log integrity check passed

**Weekly checks:**
- All skill files load without errors
- Agent performance scores updated
- No data residency violations detected

**Monthly checks:**
- Compliance state files reviewed for stale data
- User data minimization pass completed
- EU AI Act transparency log exported

---

## Runtime Metadata Injection

```yaml
# Injected at session start
host: [server hostname]
os: [operating system]
model: Claude Opus / GPT-4.5
repo_root: /insurclaw/
session_id: [uuid]
user_id: [anonymized]
user_tier: free | premium
thinking_level: standard | deep
jurisdiction: [EU member state or "EU-default"]
timezone: Europe/Ljubljana
business_hours: 09:00-18:00 CET
storm_season: true | false
current_timestamp: [UTC]
gdpr_consent_status: [loaded from compliance_state/]
active_approval_gates: [list of pending approvals]
```

---

## Vibe-Coding Workflow Spine

**Workflow:** Idea → Research → PRD → Tech Design → Agent Config → Build MVP

**Rules (non-negotiable):**
- Do not skip discovery — ask clarifying questions before writing a PRD
- Break complex systems into smaller iterative builds
- Test after every meaningful change
- Never assume generated code works — run it, verify it
- Propose the smallest viable slice first
- Show what is built now, what is deferred, and why
- Use explicit success criteria
- Keep architecture grounded in realistic implementation detail

**Phase outputs (per iteration):**
- part1-deepresearch.md — EU market analysis, competitor gaps, regulatory mapping
- part2-prd-mvp.md — Feature definition, user stories, acceptance criteria
- part3-techdesign-mvp.md — Stack, APIs, data model, agent config
- part4-notes-for-agent.md — Agent prompts, skill definitions, test cases

**Build stance:**
- Modular architecture
- Event-driven orchestration where useful
- Strong audit logs (tamper-proof, human-readable)
- Explicit approval checkpoints
- Reversible actions preferred over destructive ones
- Privacy-first storage (GDPR Article 25 — data minimization by design)
- Staged rollout by feature domain (A → B → C → D)

---

## Channel Configuration

| Channel | Priority | Style | Max Messages/Task |
|---------|----------|-------|-------------------|
| Telegram | Primary | Direct, emoji-native, quick actions | 2 |
| WhatsApp | Secondary | Slightly formal, rich media | 2 |
| Email | Approval-only | Formal, full documentation | 1 draft |
| In-App (future) | Dashboard | Full visualization, deep dives | Unlimited |

**Telegram quick action format:**
```
[Status update — 1 sentence]
[Recommendation — 1-2 sentences]
[Decision options: Approve / Reject / Modify]
```

---

## Skill Loading Protocol

Only skills relevant to the current intent are loaded per turn:

```yaml
# Example: Weather event detected, travel in calendar
skills_loaded:
  - prevention_as_service/SKILL.md
  - event_coverage/SKILL.md
  - parametric_claims/SKILL.md

# Example: Renewal quote received
skills_loaded:
  - underwriting_engine/SKILL.md
  - market_comparison/SKILL.md
  - portfolio_optimizer/SKILL.md
```

---

*InsurClaw Workflow v1.0 | EU Market | Mar 2026*
