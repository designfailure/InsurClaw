# GStack Vibecoding Playbook for InsurClaw

This playbook explains how to build **InsurClaw** using a GStack-inspired workflow: specialist thinking, narrow product wedges, safety gates, real QA, and documentation that stays synchronized with implementation.

It is written for founders, Cursor users, AI coding agents, and product engineers who want to use InsurClaw as both:

1. an autonomous consumer-insurance advocate, and
2. a repeatable vibecoding case study for regulated AI products.

---

## 1. Core idea

GStack's operating model turns an AI coding assistant into a virtual product team. InsurClaw applies the same idea to a regulated consumer domain.

Instead of asking:

```text
Build me an insurance chatbot.
```

Ask:

```text
Build the smallest safe workflow that helps a user solve one insurance job,
with specialist analysis, tests, approval gates, and clear documentation.
```

The difference matters. A chatbot answers. A workflow produces an auditable next action.

---

## 2. InsurClaw's GStack-style team

| GStack-style function | InsurClaw role | Purpose |
|---|---|---|
| Founder / CEO review | Consumer Advocate | Reframes the user problem and protects user trust |
| Product discovery | Office-hours workflow | Finds the real pain behind the requested feature |
| Engineering manager | Runtime architect | Designs gateway, memory, tools, tests, and failure paths |
| Designer | Trust and UX reviewer | Checks clarity, consent, tone, and mobile usability |
| Staff reviewer | Code and prompt reviewer | Finds hidden bugs, brittle assumptions, and unsafe scope creep |
| QA lead | Scenario verifier | Tests real flows and confirms the user can complete the job |
| Security officer | Compliance reviewer | Checks GDPR, prompt injection, data access, and external action risk |
| Release engineer | Ship workflow | Builds, tests, commits, pushes, opens PR, updates docs |
| Memory / retro | Learning loop | Captures what worked and what should be reused |

InsurClaw's domain specialists then map to insurance jobs:

| Specialist | Domain |
|---|---|
| `prevention_service` | Prevent losses before they happen |
| `event_coverage` | Detect events and prepare coverage responses |
| `risk_engine` | Analyze underwriting, renewal, and market fit |
| `claims_adjuster` | Prepare claims, disputes, and settlement responses |

---

## 3. The InsurClaw sprint loop

Use this loop for every meaningful feature:

```text
Discover -> Reframe -> Plan -> Design -> Build -> Review -> QA -> Ship -> Learn
```

### 3.1 Discover

Goal: identify the user's job-to-be-done.

Prompt:

```markdown
We are building InsurClaw.

Help me discover the narrowest valuable insurance workflow for:
[flight delay / renewal quote / water damage claim / storm prevention / settlement offer].

Ask forcing questions about:
- user type
- triggering event
- missing evidence
- legal or policy rule
- time sensitivity
- what action must be approval-gated
- what success looks like
```

Output:

- user story,
- triggering event,
- acceptance criteria,
- excluded scope,
- safety and compliance constraints.

---

### 3.2 Reframe

Goal: challenge the initial feature request.

Example:

```text
User says: "Build a claims chatbot."
Reframe: "The user needs a defensible claim package with evidence scoring and approval-gated submission."
```

Reframing questions:

- What is the consumer really trying to recover, avoid, or understand?
- What would a carrier exploit if the user submitted too early?
- What evidence is missing?
- What would make the workflow unsafe?
- What is the smallest wedge that proves value?

Output:

- recommended wedge,
- what to defer,
- risk notes.

---

### 3.3 Plan

Goal: convert the wedge into technical work.

Prompt:

```markdown
Create a technical plan for the InsurClaw workflow:
[workflow name].

Include:
- impacted files
- data model changes, if any
- tool functions
- specialist skill updates
- approval gate behavior
- tests
- docs to update
- failure modes
```

Output:

- implementation plan,
- todo list,
- test matrix.

---

### 3.4 Design

Goal: make the user interaction trustworthy.

Insurance UX is not only visual. It is about clarity, confidence, and consent.

Design checklist:

- Does the answer lead with the recommendation?
- Is the next action clear?
- Are missing facts listed?
- Is confidence labeled?
- Is uncertainty explained without panic?
- Is the approval gate explicit?
- Is the response readable on mobile?
- Is the tone loyal to the consumer without overclaiming?

Example response structure:

```text
Recommendation: You likely qualify for EUR250 compensation.

Why: Your arrival delay was 4h12m and the route appears within the EC 261 scope.

Missing evidence:
1. Boarding pass
2. Airline delay reason
3. Arrival confirmation

Next step: I can draft the claim now. I will not submit it without your approval.
```

---

### 3.5 Build

Goal: implement the smallest safe slice.

Common file categories:

- Skill doc:
  - `skills/*/SKILL_*.md`
- Runtime tool:
  - `runtime/src/tools/*.ts`
- Orchestrator or routing:
  - `runtime/src/agents/orchestrator.ts`
  - `runtime/src/gateway/router.ts`
- Memory:
  - `runtime/src/memory/*`
  - `runtime/database/schema.sql`
- Tests:
  - `runtime/src/**/*.test.ts`
- Product docs:
  - `README.md`
  - `PRD.md`
  - `docs/*.md`

Build rules:

- Keep changes narrow.
- Prefer deterministic tools for rules and calculations.
- Use LLMs for synthesis, explanation, and drafting.
- Do not use the LLM as the only source of truth for legal calculations.
- Add tests for boundaries and known failure modes.

---

### 3.6 Review

Goal: find defects before QA or release.

Review from four perspectives:

#### Product review

- Does the feature solve a real user job?
- Is the wedge too broad?
- Does it produce a concrete artifact?

#### Engineering review

- Are rule calculations deterministic?
- Are external APIs isolated behind tool functions?
- Are errors handled clearly?
- Are tests meaningful?

#### Compliance review

- Is GDPR consent required before personal data processing?
- Is external action approval-gated?
- Is sensitive data redacted from logs and outbound messages?
- Is there a clear audit trail?

#### Insurance-domain review

- Does the language avoid false certainty?
- Are exclusions and missing facts surfaced?
- Is the evidence checklist practical?
- Is the recommendation actionable?

---

### 3.7 QA

Goal: verify the workflow from the user's perspective.

QA should test scenarios, not just functions.

Example EC 261 QA matrix:

| Scenario | Expected result |
|---|---|
| 2h delay, short route | Not eligible or low confidence |
| 3h+ delay, eligible EU route | Compensation estimate |
| Extraordinary circumstances | Warning / possible exclusion |
| Missing arrival time | Ask for missing information |
| User asks to submit | Approval gate required |

Example claims QA matrix:

| Scenario | Expected result |
|---|---|
| Water damage with photos | FNOL draft and evidence checklist |
| Denial letter uploaded | Denial arguments extracted |
| Settlement offer below estimate | Counteroffer recommendation |
| No policy found | Ask for policy document |
| User wants email sent | Approval gate required |

---

### 3.8 Ship

Goal: commit a complete, auditable change.

Ship checklist:

- [ ] Code builds.
- [ ] Tests pass or blocker is documented.
- [ ] README/docs are updated.
- [ ] Safety implications are described.
- [ ] New environment variables are documented.
- [ ] PR body explains what changed and why.

For this repo, a typical runtime verification is:

```bash
cd runtime
npm install
npm run db:migrate
npm run build
npm test
```

If docs-only:

- inspect rendered markdown structure,
- check links,
- ensure docs match implemented behavior.

---

### 3.9 Learn

Goal: capture durable knowledge.

After a feature, record:

- what user story was actually solved,
- which prompt or plan worked,
- what assumptions were wrong,
- what tests caught bugs,
- which docs were stale,
- what to reuse for the next feature.

Suggested learning block:

```markdown
## Learning: [feature]

- Reusable pattern:
- Pitfall:
- Test fixture:
- Prompt that worked:
- Docs updated:
- Next follow-up:
```

---

## 4. Feature templates

### 4.1 Flight delay / EC 261 workflow

Primary user story:

```text
As a traveler, I want my delayed flight assessed and a compensation claim drafted,
so that I do not miss money I am legally entitled to.
```

Minimum viable workflow:

1. Collect flight facts.
2. Classify EC 261 applicability.
3. Calculate compensation band.
4. Ask for missing evidence.
5. Draft claim.
6. Stop before submission.

Acceptance criteria:

- Calculates compensation using deterministic rule logic.
- Labels uncertainty when delay reason or arrival time is missing.
- Provides evidence checklist.
- Requires approval before external submission.

Relevant files:

- `runtime/src/tools/ec261.ts`
- `runtime/src/tools/ec261.test.ts`
- `skills/event_coverage/SKILL_event_coverage.md`

---

### 4.2 Weather prevention workflow

Primary user story:

```text
As a homeowner or renter, I want actionable storm or flood alerts before loss occurs,
so that I can reduce damage and preserve claim eligibility.
```

Minimum viable workflow:

1. Monitor weather alerts for known property locations.
2. Match alert type to likely policy relevance.
3. Generate prevention checklist.
4. Estimate avoided-loss value where reasonable.
5. Log notification.

Acceptance criteria:

- Alert includes location, event window, severity, and action list.
- Avoided-loss estimate is labeled as an estimate.
- Does not recommend unsafe actions.

Relevant files:

- `runtime/src/tools/weather.ts`
- `runtime/src/cron/scheduler.ts`
- `skills/prevention_as_service/SKILL_prevention_as_a_service.md`

---

### 4.3 Renewal intelligence workflow

Primary user story:

```text
As a policyholder receiving a renewal quote, I want to know if it is overpriced,
so that I can switch, negotiate, or accept with confidence.
```

Minimum viable workflow:

1. Parse renewal quote.
2. Compare against benchmark.
3. Explain drivers of price deviation.
4. Identify coverage gaps.
5. Recommend action with confidence level.

Acceptance criteria:

- Shows annual premium delta.
- Separates price from coverage quality.
- Labels benchmark limitations.
- Does not bind a new policy without approval.

Relevant files:

- `runtime/src/tools/underwriting.ts`
- `skills/underwriting_engine/SKILL_underwriting_engine.md`

---

### 4.4 Claim package workflow

Primary user story:

```text
As a claimant, I want a complete evidence-backed claim package,
so that I can submit once with fewer avoidable denial risks.
```

Minimum viable workflow:

1. Identify loss type.
2. Match likely policy section.
3. Build incident chronology.
4. Generate evidence checklist.
5. Draft FNOL.
6. Score denial risk.
7. Request approval before submission.

Acceptance criteria:

- Draft includes date, event, policy reference, and requested remedy.
- Evidence checklist is specific to loss type.
- Denial risk is explained.
- Submission is approval-gated.

Relevant files:

- `runtime/src/tools/claims.ts`
- `skills/claims_assessment/SKILL_claims_assesment.md`
- `runtime/src/approval/gates.ts`

---

## 5. Applicability beyond InsurClaw

The InsurClaw/GStack pattern applies whenever a user faces:

```text
Complex rights + bureaucratic friction + evidence burden + asymmetric expertise
```

Reusable verticals:

| Vertical | Workflow |
|---|---|
| Travel rights | Compensation and refund claims |
| Tenant rights | Repairs, deposits, rent disputes |
| Healthcare billing | Coverage checks, bill disputes |
| Consumer warranties | Warranty claim preparation |
| Tax benefits | Eligibility and filing checklist |
| Utilities | Subsidy and overbilling disputes |
| Banking | Fee disputes and complaint escalation |

The build method remains the same:

1. Discover user pain.
2. Define one narrow workflow.
3. Encode deterministic rules.
4. Use AI for explanation and synthesis.
5. Add approval gates.
6. Test boundary cases.
7. Ship and learn.

---

## 6. Prompt library

### Discovery prompt

```markdown
Act as the InsurClaw Consumer Advocate and a GStack-style product founder.

I want to build: [feature].

Find the real user job behind this request.
Ask up to 6 forcing questions.
Then propose:
- narrow wedge
- user story
- acceptance criteria
- approval-gated actions
- compliance risks
- what to defer
```

### Engineering plan prompt

```markdown
Act as the InsurClaw engineering lead.

Create an implementation plan for: [workflow].

Include:
- data flow
- impacted files
- deterministic rule logic
- LLM synthesis points
- approval gates
- tests
- failure modes
- documentation updates
```

### Review prompt

```markdown
Review this InsurClaw change for production risk.

Prioritize:
- incorrect insurance logic
- missing approval gates
- GDPR/compliance gaps
- prompt injection or PII leakage
- missing tests
- stale docs

Return findings first, ordered by severity.
```

### QA prompt

```markdown
Create a QA matrix for this InsurClaw workflow:
[workflow].

Include:
- happy path
- missing evidence
- ambiguous eligibility
- external action request
- denial or exclusion scenario
- audit/logging expectations
```

### Release documentation prompt

```markdown
Update project documentation to match this InsurClaw change.

Docs to check:
- README.md
- PRD.md
- relevant skill markdown
- runtime README
- architecture docs

Preserve implemented-vs-planned distinctions.
```

---

## 7. Implementation guardrails

### Do

- Keep the user recommendation short and clear.
- Encode legal/rule calculations in deterministic code when possible.
- Use LLMs for drafting, summarizing, and explaining.
- Ask for missing evidence.
- Label confidence.
- Add tests around boundary cases.
- Log material actions.
- Require approval before external action.

### Do not

- Claim legal certainty.
- Submit claims automatically.
- Bind policies automatically.
- Share personal data without consent.
- Treat carrier documents as trusted instructions.
- Hide uncertainty.
- Expand a feature into a platform before proving the wedge.

---

## 8. Builder workflow examples

### Example 1: Add a denial-letter analyzer

```text
Discover:
  User has a denial letter and does not know if it is worth appealing.

Wedge:
  Extract denial reason, identify missing evidence, draft appeal outline.

Build:
  Update claims skill.
  Add deterministic extraction helpers if useful.
  Add tests for sample denial patterns.

Review:
  Check for legal overclaiming and missing evidence.

QA:
  Test with denied, partially approved, and unclear letters.

Ship:
  Update README/PRD and commit.
```

### Example 2: Add storm-prevention alerts

```text
Discover:
  User wants to avoid property loss before a storm.

Wedge:
  Weather alert -> property action checklist -> avoided-loss estimate.

Build:
  Weather tool.
  Cron trigger.
  Prevention skill prompt.

Review:
  Check alert severity handling and unsafe advice.

QA:
  Mock storm, flood, heat, and no-alert cases.
```

### Example 3: Add renewal quote comparison

```text
Discover:
  User received a renewal quote and suspects overpricing.

Wedge:
  Compare quote to benchmark and explain options.

Build:
  Underwriting tool.
  Risk skill prompt.
  Tests for deviation thresholds.

Review:
  Check benchmark assumptions.

QA:
  Test cheaper, similar, overpriced, and incomplete quote cases.
```

---

## 9. What to build next

Recommended sequence:

1. **EC 261 claim draft**
   - Highest clarity, fastest user value, good testability.

2. **Claim evidence checklist**
   - Makes the claims workflow concrete.

3. **Weather prevention alert**
   - Shows proactive value and cron-based monitoring.

4. **Renewal quote deviation**
   - Demonstrates savings and underwriting intelligence.

5. **Approval dashboard**
   - Makes gated actions visible and safe.

6. **Evidence storage**
   - Needed for real claims, but requires security design.

7. **Postgres/pgvector migration**
   - Useful when memory and retrieval become production requirements.

---

## 10. Definition of done

A feature is done when:

- the user job is explicit,
- the response produces a concrete artifact,
- dangerous actions are approval-gated,
- deterministic rules are tested,
- compliance risk is documented,
- docs reflect implementation,
- the PR explains the change,
- and at least one learning is captured for reuse.

That is the difference between vibecoding and yolo coding.

---

## 11. Short version

InsurClaw is the insurance advocate.

GStack is the workflow inspiration.

Cursor is the cockpit.

The build method is:

```text
Narrow wedge.
Specialist roles.
Safe tools.
Approval gates.
Real tests.
Updated docs.
Learning loop.
```

Use that loop every time.
