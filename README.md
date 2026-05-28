# InsurClaw - GStack for Consumer Insurance Advocacy

**InsurClaw** is a domain-specific AI operating system for EU insurance consumers: a loyal agent that monitors risk, detects claimable events, compares renewals, prepares claim packages, and protects the user with explicit approval gates.

This repository refactors the original **InsurClaw** concept through the lens of **GStack**: a specialist-driven, vibecoding software factory where an AI team helps define, design, decompose, deliver, review, QA, ship, and learn.

> GStack is not copied or vendored here. The concept is adapted as an operating model: clear specialist roles, command-like workflows, review gates, real QA, release discipline, and memory that compounds over time.
>
> 
<img width="684" height="1133" alt="insurclaw_claud-desktop" src="https://github.com/user-attachments/assets/53977c26-d16f-4e3c-9d89-c09694817048" />


---

## One-line framing

Make me an **AI insurance operating system** for **EU consumers and vibecoding builders** that helps people **never miss a claim, never overpay, and never get trapped by insurance complexity** by **turning insurance events into monitored workflows, specialist agent tasks, approval-gated actions, and auditable outcomes**.

---

## What this repo is

InsurClaw has two complementary identities:

1. **Consumer product**
   - A user-side insurance advocate.
   - Works for the policyholder, not the carrier.
   - Monitors events and policies.
   - Prepares claim and renewal actions.
   - Requires explicit approval for external commitments.

2. **Vibecoding case study**
   - A structured example of building an applied AI agent product with Cursor, Claude, OpenClaw-style sessions, and GStack-like workflow discipline.
   - Uses documentation, skills, agent roles, approval gates, cron jobs, and tests as the operating system for AI-assisted development.

The result is not just "an insurance chatbot." It is a model for building regulated-domain AI products with specialist agents and human oversight.

---

## Why refactor InsurClaw through GStack?

GStack's core insight is that AI coding becomes powerful when it stops being a blank chat box and starts behaving like a small product team:

- A founder challenges the problem.
- An engineering lead turns ambiguity into architecture.
- A designer catches weak UX.
- A reviewer finds production bugs.
- QA opens the app and verifies flows.
- Security reviews threat models.
- Release engineering ships and documents what changed.
- Memory captures what was learned.

InsurClaw needs exactly that discipline because insurance is a high-trust, high-context, regulated domain. The agent must not merely answer questions; it must:

- ask better questions,
- discover missing evidence,
- classify risk,
- explain uncertainty,
- protect personal data,
- avoid unauthorized external action,
- preserve an audit trail,
- and help builders iterate safely.

This README reframes InsurClaw as a **GStack-style applied AI product factory for insurance advocacy**.

---

## The consumer problem

EU consumers are structurally disadvantaged in insurance:

- They do not know which clauses matter until a claim is denied.
- They often miss flight-delay, travel, property, or settlement opportunities.
- They overpay at renewal because comparison is tedious and intentionally confusing.
- They accept lowball settlements because appeal paths are unclear.
- They do not know what evidence carriers expect.
- They are asked to trust agents, brokers, and insurers who may not be economically aligned with them.

InsurClaw corrects the asymmetry by becoming the consumer's own insurance advocate.

---

## Product promise

**Lead with the answer. Explain after. Protect the user before acting.**

InsurClaw should:

- detect relevant events,
- explain what is likely covered,
- prepare the strongest next action,
- show confidence and uncertainty,
- request approval before external action,
- and maintain a record that could survive carrier review or escalation.

---

## Core features

### 1. Consumer Advocate orchestrator

The Consumer Advocate is the user-facing coordinator.

Responsibilities:

- Maintains holistic user context:
  - jurisdiction,
  - GDPR consent,
  - policy portfolio,
  - claim history,
  - risk profile,
  - approval state.
- Routes tasks to specialists.
- Synthesizes specialist findings.
- Does not delegate trust away from the user.
- Explains tradeoffs in plain language.

Implemented reference:

- `runtime/src/agents/orchestrator.ts`
- `AGENTS.md`
- `SYSTEM_PROMPT.md`

---

### 2. Prevention Agent

Stops losses before they happen.

Example jobs:

- Storm warning linked to home policy.
- Property maintenance nudges.
- Travel advisories.
- Cyber hygiene prompts.
- Estimated avoided-loss value.

GStack-style role:

- This is the proactive "risk operator."
- It runs before the user asks.
- It turns monitoring into specific, actionable prevention.

Implemented reference:

- `skills/prevention_as_service/SKILL_prevention_as_a_service.md`
- `runtime/src/tools/weather.ts`
- `runtime/src/cron/scheduler.ts`

---

### 3. Event Coverage Agent

Detects real-world events and prepares coverage responses.

Example jobs:

- EC 261/2004 flight delay compensation.
- Travel disruption.
- Parametric weather events.
- Commute disruption.
- Event cancellation.

GStack-style role:

- This is the incident responder.
- It moves fast, classifies likely coverage, and prepares evidence requirements.

Implemented reference:

- `skills/event_coverage/SKILL_event_coverage.md`
- `runtime/src/tools/ec261.ts`
- `runtime/src/tools/flight.ts`

---

### 4. Underwriting / Risk Engine

Analyzes policy fit, pricing, renewal risk, and market deviation.

Example jobs:

- Renewal quote above market.
- Coverage gaps.
- Portfolio optimization.
- Risk profile scoring.
- Switch recommendation with confidence.

GStack-style role:

- This is the product-strategy and data-analysis specialist.
- It explains why a quote is overpriced or a policy is mismatched.

Implemented reference:

- `skills/underwriting_engine/SKILL_underwriting_engine.md`
- `runtime/src/tools/underwriting.ts`

---

### 5. Claims Agent

Builds defensible claim packages.

Example jobs:

- First Notice of Loss draft.
- Evidence checklist.
- Denial-risk analysis.
- Settlement range.
- Lowball counteroffer.
- Dispute escalation path.

GStack-style role:

- This is the war-room operator.
- It structures claim packages as if a carrier, regulator, or court could review them.

Implemented reference:

- `skills/claims_assessment/SKILL_claims_assesment.md`
- `runtime/src/tools/claims.ts`

---

### 6. Approval gates

InsurClaw must not take external action without explicit consent.

Gated actions include:

- submit claim,
- bind policy,
- send external email,
- accept settlement,
- share data externally.

Implemented reference:

- `runtime/src/approval/gates.ts`
- `SAFETY.md`
- `EU_COMPLIANCE.md`

---

### 7. Memory and audit layer

The runtime persists:

- users,
- policies,
- claims,
- risk profiles,
- audit log entries,
- pending approvals,
- admin triggers.

Implemented reference:

- `runtime/database/schema.sql`
- `runtime/src/memory/database.ts`
- `runtime/src/memory/manager.ts`

Current state:

- SQLite is implemented for the MVP runtime.
- Postgres/pgvector is documented as a future production path.

---

### 8. Slack runtime and admin channel

The implemented runtime is Slack-first:

- Slack inbound messages,
- intent routing,
- Claude orchestration,
- approval-button flow,
- optional WhatsApp admin notification.

Implemented reference:

- `runtime/src/main.ts`
- `runtime/src/gateway/gateway.ts`
- `runtime/src/gateway/slack-adapter.ts`
- `runtime/src/gateway/whatsapp-admin.ts`
- `runtime/README.md`

Documentation note:

- Earlier product docs mention Telegram as the primary channel. The current runnable implementation uses Slack.

---

## GStack-inspired operating model

InsurClaw can be built and operated using a GStack-like sprint:

```text
Think -> Plan -> Build -> Review -> Test -> Ship -> Learn
```

Mapped to this repo:

| GStack-style stage | InsurClaw equivalent | Output |
|---|---|---|
| Office hours | Product discovery | Clear user pain, segment, wedge, success criteria |
| CEO review | Strategic pressure test | Scope decision: expand, reduce, hold, or reframe |
| Engineering review | Architecture design | Data flow, modules, failure modes, tests |
| Design review | UX and trust review | Consent, clarity, accessibility, tone |
| Implementation | Runtime/docs/skills work | Code, prompts, tools, or product docs |
| Code review | Production-risk review | Bugs, edge cases, security findings |
| QA | Real flow validation | Verified scenario and regression tests |
| Ship | Commit, PR, release notes | Auditable delivery |
| Retro / Learn | Memory update | What changed, what failed, what to reuse |

This turns vibecoding from "ask AI to code" into a controlled production workflow.

---

## Vibecoding use case approach

InsurClaw is an excellent vibecoding use case because it combines:

- a concrete user pain,
- regulated constraints,
- multiple specialist workflows,
- strong documentation needs,
- narrow MVP slices,
- and measurable outcomes.

The recommended pattern:

1. **Define the user job**
   - Example: "A traveler wants compensation for a delayed flight without understanding EC 261/2004."

2. **Constrain the first slice**
   - Example: "Only calculate compensation and draft the claim. Do not submit."

3. **Create or update the skill**
   - Example: update `skills/event_coverage/SKILL_event_coverage.md`.

4. **Wire the runtime tool**
   - Example: `runtime/src/tools/ec261.ts`.

5. **Add tests**
   - Example: `runtime/src/tools/ec261.test.ts`.

6. **Run review and QA**
   - Ask the agent to review the diff for coverage, compliance, and failure modes.

7. **Ship and document**
   - Update README, PRD, skill docs, and runtime docs if behavior changes.

8. **Learn**
   - Capture what prompts, edge cases, and test fixtures should be reused.

The goal is not to produce the largest possible code diff. The goal is to create a reliable loop where each domain capability becomes clearer, safer, and more testable.

For a detailed workflow, see:

- [`docs/GSTACK_VIBECODING_PLAYBOOK.md`](docs/GSTACK_VIBECODING_PLAYBOOK.md)
- [`docs/INSURCLAW_PUBLIC_SPEC_PAPER.md`](docs/INSURCLAW_PUBLIC_SPEC_PAPER.md)

---

## How to use this repo

### Option A: Use it as a product concept

Read these files in order:

1. `README.md` - product and operating model.
2. `PRD.md` - product requirements and acceptance criteria.
3. `AGENTS.md` - multi-agent hierarchy.
4. `SAFETY.md` - guardrails and approval gates.
5. `EU_COMPLIANCE.md` - GDPR, IDD, EU AI Act considerations.
6. `WORKFLOW.md` - runtime workflow and cron patterns.
7. `docs/GSTACK_VIBECODING_PLAYBOOK.md` - how to build with a GStack-like workflow.
8. `docs/INSURCLAW_PUBLIC_SPEC_PAPER.md` - public-facing concept spec for posts, threads, and stakeholder sharing.

Use this path when you are evaluating the startup/product idea.

---

### Option B: Use it as a vibecoding project

Start with a narrow product slice:

```text
Build the EC 261/2004 flight delay claim-draft workflow.
It should classify eligibility, calculate compensation, ask for missing evidence,
and stop before submission unless the user approves.
```

Then run the GStack-style workflow:

```text
Discovery -> Plan -> Architecture -> Implementation -> Review -> QA -> Ship -> Learn
```

Suggested Cursor prompt:

```markdown
Follow the InsurClaw docs and use a GStack-style workflow.

Goal: implement the next narrow capability for [feature].
Context: EU consumer insurance, approval-gated, GDPR-aware.
Success means: user receives a clear recommendation and a safe next action.
Constraints: no external submission without approval; tests for critical rules.

First: review relevant docs and propose the smallest shippable slice.
Then: implement, test, update docs, and summarize risks.
```

---

### Option C: Run the implemented runtime

Requirements:

- Node.js `>=20`
- npm
- Slack app credentials
- Anthropic API key

Runtime setup:

```bash
cd runtime
npm install
npm run db:migrate
npm run build
```

Create `runtime/.env` or provide equivalent environment variables:

```env
SLACK_BOT_TOKEN=...
SLACK_SIGNING_SECRET=...
ANTHROPIC_API_KEY=...
SLACK_APP_TOKEN=...
INSURCLAW_DB_PATH=./data/insurclaw.db
```

Start:

```bash
npm start
```

Test:

```bash
npm test
```

Runtime architecture:

```text
Slack
  -> GatewayRouter
  -> MemoryManager + audit log
  -> InsurTechClaw session/logging loop
  -> ConsumerAdvocateOrchestrator
  -> tools or specialist agents
  -> approval gate or Slack response
```

---

## Repository map

```text
.
├── README.md
├── PRD.md
├── AGENTS.md
├── SAFETY.md
├── EU_COMPLIANCE.md
├── WORKFLOW.md
├── SYSTEM_PROMPT.md
├── Tools.md
├── Components.md
├── docs/
│   ├── GSTACK_VIBECODING_PLAYBOOK.md
│   ├── INSURCLAW_PUBLIC_SPEC_PAPER.md
│   ├── OPENCLAW_INTEGRATION.md
│   ├── part1-deepresearch.md
│   ├── part2-prd-mvp.md
│   ├── part3-techdesign-mvp.md
│   └── part4-notes-for-agent.md
├── skills/
│   ├── prevention_as_service/
│   ├── event_coverage/
│   ├── underwriting_engine/
│   └── claims_assessment/
├── runtime/
│   ├── src/
│   │   ├── agents/
│   │   ├── approval/
│   │   ├── claw/
│   │   ├── compliance/
│   │   ├── cron/
│   │   ├── gateway/
│   │   ├── memory/
│   │   └── tools/
│   ├── database/schema.sql
│   └── package.json
└── workspace/
    ├── consumer_advocate/
    ├── prevention_agent/
    ├── event_agent/
    ├── underwriting_agent/
    └── claims_agent/
```

---

## Architecture

### Conceptual architecture

```text
User channels
  -> Gateway
  -> Consumer Advocate
  -> Specialist agents
  -> Domain tools and external APIs
  -> Memory and audit layer
  -> Approval gates
```

### Implemented architecture

```text
Slack
  -> runtime/src/gateway/slack-adapter.ts
  -> runtime/src/gateway/router.ts
  -> runtime/src/claw/claw-mechanism.ts
  -> runtime/src/agents/orchestrator.ts
  -> runtime/src/tools/*
  -> runtime/src/agents/specialists/index.ts
  -> runtime/src/memory/*
  -> SQLite database
```

### Planned production architecture

```text
Slack / Telegram / WhatsApp / Web
  -> Gateway and auth
  -> Consumer Advocate orchestration
  -> Specialist agent sessions
  -> Tool layer
  -> Postgres + pgvector
  -> encrypted document store
  -> observability + audit integrity
  -> human approval surface
```

---

## What is next

### Product next steps

1. **Clarify canonical channel**
   - Decide whether Slack is the developer/admin channel and Telegram/WhatsApp are consumer channels.
   - Update docs and runtime plans accordingly.

2. **Ship one complete consumer wedge**
   - Best first wedge: EC 261/2004 flight delay claim draft.
   - Why: bounded rules, measurable compensation, clear evidence list, immediate user value.

3. **Harden approval gates**
   - Make every external action impossible without explicit user approval.
   - Add tests around approval resolution and audit entries.

4. **Separate product runtime from builder workflow**
   - Product runtime: consumer-facing agent.
   - Builder workflow: GStack-style docs, skills, reviews, QA, and release process.

5. **Resolve SQLite vs Postgres path**
   - Keep SQLite for local MVP.
   - Add Postgres/pgvector only when vector search, multi-user deployment, or production hosting requires it.

6. **Add evidence handling**
   - Secure upload/storage model.
   - Evidence completeness score.
   - Claim package export.

7. **Add real external integrations carefully**
   - Flight status provider.
   - Weather alert provider.
   - Carrier/aggregator APIs.
   - Regulatory reference feeds.

8. **Improve tests**
   - Gateway integration tests.
   - Approval gate end-to-end tests.
   - Specialist prompt fixture tests.
   - Cron job tests with mocked time and APIs.

---

### Vibecoding next steps

1. Create feature-specific plans in `docs/`.
2. Convert each plan into small todos.
3. Implement one capability at a time.
4. Run code review after each meaningful diff.
5. Run QA against real flows, not just unit tests.
6. Update docs before shipping.
7. Capture learnings in a durable playbook.

The aim is to make the repo a repeatable template for building regulated AI products, not only one insurance app.

---

## Envisioning applicability

InsurClaw's pattern can apply beyond insurance:

| Domain | Consumer pain | InsurClaw-like agent |
|---|---|---|
| Travel rights | Users miss refunds and compensation | Travel-rights advocate |
| Healthcare admin | Patients cannot interpret coverage and bills | Medical billing advocate |
| Tax credits | Citizens miss deductions and credits | Tax benefit navigator |
| Tenant rights | Renters do not know local protections | Housing rights advocate |
| Warranty claims | Consumers abandon claims after friction | Warranty recovery agent |
| Banking fees | Users miss unfair charges and disputes | Fee dispute advocate |
| Energy bills | Households overpay and miss subsidies | Utility savings advocate |

Common pattern:

```text
Complex rules + consumer asymmetry + evidence requirements + approval-gated action
```

That is where GStack-style vibecoding shines: the AI team can discover the domain, define the wedge, design safe workflows, implement tools, test edge cases, and keep documentation current.

---

## Safety principles

InsurClaw should remain useful without becoming reckless.

Non-negotiables:

- No external action without approval.
- No hidden carrier incentives.
- No false certainty on coverage.
- No personal data use without a lawful basis.
- No unlogged material decision.
- No medical/legal/financial overclaiming beyond the agent's role.
- No silent prompt-injection trust of external documents.

The agent can recommend, prepare, calculate, draft, compare, and explain. It should only submit, bind, send, or share after explicit approval.

---

## Success criteria

### Consumer success

- User understands what happened and what to do next.
- User gets a draft or checklist, not vague advice.
- User can approve or reject external action.
- User sees confidence, uncertainty, and missing evidence.

### Product success

- Flight-delay claims are detected and drafted quickly.
- Renewal overpricing is explained with evidence.
- Claim packages reduce avoidable denials.
- Prevention alerts are specific enough to act on.

### Engineering success

- Critical insurance rules have tests.
- Approval gates are tested.
- Audit logging is reliable.
- Runtime docs match implementation.
- Every feature has a documented user story and QA path.

### Vibecoding success

- The repo can be changed safely by AI agents.
- Plans are explicit before implementation.
- Reviews find real defects.
- QA verifies flows.
- Documentation changes with the product.
- Learnings compound across sessions.

---

## Suggested first build sprint

### Sprint: EC 261/2004 claim draft

Goal:

```text
Given flight delay facts, calculate likely compensation and prepare a claim draft,
without submitting anything externally.
```

Inputs:

- flight number,
- origin,
- destination,
- arrival delay,
- distance band,
- disruption reason,
- user jurisdiction,
- ticket / boarding pass evidence.

Outputs:

- eligibility classification,
- compensation estimate,
- evidence checklist,
- missing information questions,
- draft claim text,
- approval gate status.

Files likely involved:

- `runtime/src/tools/ec261.ts`
- `runtime/src/tools/ec261.test.ts`
- `skills/event_coverage/SKILL_event_coverage.md`
- `runtime/src/agents/orchestrator.ts`
- `PRD.md`
- `docs/GSTACK_VIBECODING_PLAYBOOK.md`

Review checklist:

- Does it avoid legal certainty when facts are missing?
- Does it correctly distinguish delay bands and distance bands?
- Does it stop before submission?
- Are tests covering boundary cases?
- Is the user-facing response short, clear, and useful?

---

## Relationship to GStack

GStack provides the inspiration:

- specialist roles,
- slash-command workflows,
- planning before building,
- design/engineering/security reviews,
- QA with real verification,
- shipping discipline,
- documentation updates,
- learning loops.

InsurClaw adapts those ideas into a regulated consumer-insurance context:

- Consumer Advocate instead of generic CEO/PM,
- domain specialists instead of generic software specialists,
- approval gates instead of blind automation,
- compliance and audit logs as first-class architecture,
- claim evidence and policy documents as core data,
- vibecoding as the build method.

---

## Current implementation status

Implemented:

- TypeScript runtime skeleton.
- Slack gateway.
- Claude orchestrator.
- Specialist delegation.
- SQLite memory.
- Approval gates.
- Audit logging.
- EC 261 calculator tests.
- Prompt-injection and redaction tests.
- Claw-style session/logging mechanism.
- Cron scheduler skeleton.

Partially implemented or planned:

- Real production external APIs.
- Telegram consumer channel.
- Postgres/pgvector persistence.
- Encrypted evidence storage.
- Full browser/web dashboard.
- Human review escalation console.
- Production monitoring and audit integrity hash chain.

---

## License

See [`LICENSE`](LICENSE).

---

## Closing idea

InsurClaw is what happens when vibecoding grows up: not "generate me an app," but "assemble a domain-aware AI team, give it a narrow consumer problem, enforce safety gates, test the risky parts, ship the wedge, and learn."

The lobster has two claws:

- one to cut through bureaucracy,
- one to crush bad insurance outcomes.

Keep both sharp.
