# InsurClaw Public Spec Paper

**A consumer-side AI insurance advocate for the EU market, built with a GStack-style vibecoding operating model.**

---

## 0. Broadcast summary

Insurance is still designed around institutional advantage: carriers understand the contract, the timelines, the evidence rules, the exclusions, and the claims process. Consumers usually do not.

**InsurClaw** proposes a different default: every consumer gets an AI advocate that works only for them.

It monitors risks, detects claimable events, compares renewals, prepares evidence-backed claim packages, explains uncertainty, and stops before any external action until the user explicitly approves.

The product is also a build thesis: regulated AI products should be developed with a **vibecoding workflow that behaves like a specialist team**, not a single prompt. The GStack pattern - discover, plan, build, review, QA, ship, and learn - becomes the operating system for creating safe, auditable, useful AI workflows.

---

## 1. Title

**InsurClaw: A GStack-Inspired Specification for Consumer Insurance Advocacy**

Subtitle:

**From insurance chatbot to approval-gated AI operating system for policyholders.**

---

## 2. Abstract

InsurClaw is a proposed AI insurance advocate for EU consumers. It addresses a structural asymmetry in insurance: carriers have expertise, process control, and contract fluency; consumers usually face complexity only after something has gone wrong.

The system combines a user-facing **Consumer Advocate** with specialist agents for prevention, event coverage, underwriting, and claims. These agents are supported by deterministic tools, policy memory, audit logs, approval gates, and compliance constraints.

This document is not a product requirements document. It is a public specification paper: a structured explanation of what InsurClaw is, why it matters, how it works, how it can be built with vibecoding methods, and where this pattern can be applied beyond insurance.

---

## 3. The thesis

The next valuable AI products will not be generic chatbots. They will be **domain-specific advocate systems** that combine:

- specialist agents,
- deterministic tools,
- domain rules,
- user memory,
- approval gates,
- audit trails,
- compliance constraints,
- and iterative human-supervised delivery.

InsurClaw applies this thesis to consumer insurance.

Its promise:

```text
Never miss a claim.
Never overpay without knowing why.
Never face a carrier with weaker documentation than they have.
Never let automation act externally without approval.
```

---

## 4. Why insurance needs an advocate

Insurance has a knowledge imbalance built into the market.

### 4.1 What carriers know

- The exact policy wording.
- The historical denial patterns.
- Which evidence changes outcomes.
- How settlement ranges are calculated.
- Which exclusions are commonly invoked.
- How long consumers tolerate process friction.

### 4.2 What consumers usually know

- Something happened.
- They may have a policy.
- The claim process looks annoying.
- The renewal is more expensive than last year.
- The denial letter sounds official.
- They are not sure whether fighting is worth it.

### 4.3 The gap

The gap is not only informational. It is procedural.

Consumers lose value because they:

- miss deadlines,
- fail to collect evidence,
- submit weak first notices,
- accept low settlements,
- do not compare renewal pricing,
- cannot interpret exclusions,
- and do not know when escalation is justified.

InsurClaw is designed to close that gap from the consumer side.

---

## 5. What InsurClaw is

InsurClaw is an AI system that represents the user's insurance interests.

It is not:

- a carrier,
- a broker,
- a generic chatbot,
- a legal substitute,
- or an autopilot for financial commitments.

It is:

- a monitor,
- an explainer,
- a claim-preparation engine,
- a renewal analyst,
- a coverage triage assistant,
- a prevention service,
- and a human-approval-gated action layer.

The personality is intentional: loyal, direct, skeptical of carrier incentives, and protective of the user.

---

## 6. Core product primitives

### 6.1 User context

InsurClaw maintains a working memory of:

- user jurisdiction,
- GDPR consent status,
- policy portfolio,
- claim history,
- risk profile,
- travel patterns,
- property exposure,
- approval state,
- and audit events.

### 6.2 Events

Events are the system's trigger points:

- flight delay,
- storm alert,
- water damage,
- policy renewal,
- settlement offer,
- denial letter,
- travel disruption,
- cancellation,
- underinsurance warning.

### 6.3 Specialist analysis

Each event is routed to the appropriate specialist:

- Prevention Agent,
- Event Coverage Agent,
- Underwriting / Risk Engine,
- Claims Agent.

### 6.4 Deterministic tools

Rules that can be calculated should be calculated deterministically.

Examples:

- EC 261/2004 compensation bands,
- claim status filters,
- renewal price deviation thresholds,
- evidence completeness scoring,
- approval-gate eligibility.

### 6.5 LLM synthesis

Language models are used for:

- explanation,
- drafting,
- summarization,
- evidence checklist generation,
- negotiation framing,
- and user-facing recommendations.

The LLM should not be the only source of truth for legal or financial calculations.

### 6.6 Approval gates

External actions require explicit approval:

- submit claim,
- bind policy,
- send external email,
- accept settlement,
- share user data externally.

This is the difference between useful autonomy and unsafe automation.

---

## 7. Agent model

### 7.1 Consumer Advocate

The Consumer Advocate is the single user-facing orchestrator.

It:

- receives the user's request,
- loads relevant context,
- classifies intent,
- delegates to specialists,
- synthesizes findings,
- labels confidence,
- asks for missing information,
- and protects trust.

It never delegates user trust away to a specialist.

### 7.2 Prevention Agent

Prevents losses before they happen.

Examples:

- storm preparation,
- flood risk warning,
- travel advisory,
- maintenance reminder,
- cyber hygiene nudge.

Output style:

```text
Risk detected.
Likely consequence.
What to do now.
Estimated avoided loss.
Coverage note.
```

### 7.3 Event Coverage Agent

Detects claimable events in real time.

Examples:

- delayed flight,
- canceled trip,
- parametric weather trigger,
- commute disruption,
- event cancellation.

Output style:

```text
Likely covered / possibly covered / likely excluded.
Why.
Evidence needed.
Draft next step.
Approval required before submission.
```

### 7.4 Underwriting / Risk Engine

Analyzes policy economics and coverage fit.

Examples:

- renewal quote increase,
- market comparison,
- coverage gap,
- underinsurance warning,
- switching recommendation.

Output style:

```text
Price deviation.
Coverage difference.
Risk driver.
Alternative path.
Confidence level.
```

### 7.5 Claims Agent

Builds defensible claim packages.

Examples:

- FNOL draft,
- evidence checklist,
- denial response,
- lowball settlement review,
- counteroffer draft,
- escalation path.

Output style:

```text
Claim theory.
Required evidence.
Potential exclusions.
Carrier counterarguments.
Draft language.
Approval checkpoint.
```

---

## 8. System architecture

Conceptual flow:

```text
User channel
  -> Gateway
  -> Intent routing
  -> Consumer Advocate
  -> Specialist agents
  -> Tools and external APIs
  -> Memory and audit layer
  -> Approval gate
  -> User response or authorized action
```

Implemented runtime flow in this repository:

```text
Slack
  -> GatewayRouter
  -> SQLite user/session lookup
  -> audit log
  -> InsurTech Claw session loop
  -> ConsumerAdvocateOrchestrator
  -> tools or specialist delegation
  -> approval request or Slack response
```

Future production flow:

```text
Slack / Telegram / WhatsApp / Web
  -> Gateway and auth
  -> Consumer Advocate
  -> specialist sessions
  -> deterministic insurance tools
  -> external evidence and event APIs
  -> Postgres + vector memory
  -> encrypted evidence store
  -> compliance and audit service
  -> user approval surface
```

---

## 9. Feature specification

### 9.1 Flight delay compensation

User job:

```text
I had a delayed flight. Tell me if I can claim and prepare the claim.
```

System actions:

- collect flight facts,
- classify EC 261/2004 applicability,
- calculate compensation estimate,
- identify missing evidence,
- draft claim text,
- stop before submission.

User outcome:

- clear eligibility estimate,
- compensation band,
- evidence checklist,
- claim draft.

---

### 9.2 Weather prevention

User job:

```text
Warn me before weather creates an avoidable insurance loss.
```

System actions:

- monitor weather alerts,
- match alert to property or trip,
- generate prevention actions,
- estimate avoided-loss value where possible,
- notify user.

User outcome:

- practical prevention steps before damage occurs.

---

### 9.3 Renewal intelligence

User job:

```text
Tell me if this renewal is overpriced or under-covering me.
```

System actions:

- parse renewal terms,
- compare premium to benchmark,
- check coverage changes,
- identify market alternatives,
- explain confidence.

User outcome:

- switch, negotiate, or accept with better information.

---

### 9.4 Claim package preparation

User job:

```text
Help me file a claim that a carrier cannot easily reject.
```

System actions:

- identify loss type,
- match policy section,
- build chronology,
- generate evidence checklist,
- draft FNOL,
- assess denial risk,
- prepare approval-gated submission.

User outcome:

- stronger first claim package.

---

### 9.5 Settlement and denial response

User job:

```text
Tell me whether this denial or settlement offer is fair, and what to do next.
```

System actions:

- parse denial or offer,
- identify stated reasons,
- compare to claim facts,
- estimate settlement range,
- draft counterargument,
- recommend escalation if justified.

User outcome:

- informed appeal, counteroffer, or acceptance.

---

## 10. GStack-inspired build model

InsurClaw should be built like a specialist sprint, not like a one-shot prompt.

```text
Discover -> Reframe -> Plan -> Design -> Build -> Review -> QA -> Ship -> Learn
```

### 10.1 Discover

Ask what consumer pain is being solved.

Not:

```text
Build claims feature.
```

But:

```text
A user received a lowball water-damage settlement and needs to know whether to appeal.
```

### 10.2 Reframe

Find the actual product:

```text
Not a chatbot.
A denial-risk and evidence-strength workflow.
```

### 10.3 Plan

Define:

- inputs,
- outputs,
- deterministic rules,
- LLM synthesis points,
- tests,
- approval gates,
- docs.

### 10.4 Design

Make trust visible:

- lead with recommendation,
- show missing facts,
- label confidence,
- explain uncertainty,
- ask before acting.

### 10.5 Build

Implement the smallest safe wedge.

### 10.6 Review

Review for:

- product scope,
- insurance logic,
- GDPR risk,
- prompt injection,
- approval-gate gaps,
- test coverage.

### 10.7 QA

Test scenarios:

- happy path,
- missing evidence,
- ambiguous facts,
- exclusion risk,
- external action request.

### 10.8 Ship

Commit, push, open PR, update docs.

### 10.9 Learn

Capture reusable prompts, tests, fixtures, pitfalls, and decisions.

---

## 11. Why vibecoding fits this product

Vibecoding is powerful when the builder can rapidly explore product shape, but dangerous when there are no guardrails.

InsurClaw is a strong vibecoding use case because it has:

- clear user pain,
- high domain specificity,
- many specialist workflows,
- strong safety constraints,
- measurable outputs,
- narrow MVP wedges,
- and high documentation value.

The lesson:

```text
Vibecoding should not mean yolo automation.
It should mean faster iteration with stronger structure.
```

For InsurClaw, the structure is:

- specialist agents,
- deterministic rules,
- approval gates,
- tests,
- audit logs,
- compliance docs,
- and public specs.

---

## 12. Applicability beyond insurance

The InsurClaw pattern applies anywhere consumers face institutional complexity.

| Domain | Advocate system |
|---|---|
| Travel rights | Flight, hotel, cancellation compensation advocate |
| Healthcare billing | Coverage, coding, denial, and bill dispute advocate |
| Tenant rights | Deposit, repair, rent, and eviction-process advocate |
| Warranties | Product warranty and refund claim advocate |
| Utilities | Overbilling, subsidy, and switching advocate |
| Banking | Fee dispute and chargeback advocate |
| Tax benefits | Credit, deduction, and filing navigator |

Reusable formula:

```text
Complex rules
+ evidence burden
+ procedural deadlines
+ consumer asymmetry
+ approval-gated external action
= advocate-agent opportunity
```

---

## 13. Design principles

### 13.1 Consumer alignment

The agent works for the user, not the carrier.

### 13.2 Explicit consent

Personal data and external actions require clear consent.

### 13.3 Deterministic where possible

Rules should be encoded in code where practical.

### 13.4 Confidence over certainty

The system should label confidence and missing information.

### 13.5 Evidence first

Every claim workflow should improve the user's evidence position.

### 13.6 Auditability

Important actions should be logged.

### 13.7 Human approval

External actions should remain human-approved.

---

## 14. What should be built next

Recommended sequence:

1. **EC 261/2004 claim draft**
   - Clear rules, immediate user value, testable logic.

2. **Evidence completeness score**
   - Makes claim preparation concrete.

3. **Weather prevention alert**
   - Demonstrates proactive advocacy.

4. **Renewal quote analyzer**
   - Shows annual savings potential.

5. **Denial-letter analyzer**
   - High emotional and financial value.

6. **Approval dashboard**
   - Makes autonomy safer and visible.

7. **Secure evidence vault**
   - Required for real claim handling.

8. **Production memory layer**
   - Postgres/vector search when retrieval becomes central.

---

## 15. Social post versions

### 15.1 Short post

```text
Insurance is asymmetric by design: carriers know the clauses, timelines, evidence rules, and denial patterns. Consumers usually learn them after something goes wrong.

InsurClaw is a consumer-side AI insurance advocate: monitor risks, detect claimable events, compare renewals, prepare evidence-backed claims, and stop before external action until the user approves.

Not a chatbot. An approval-gated advocate system.
Built with a GStack-style vibecoding loop: discover, plan, build, review, QA, ship, learn.
```

### 15.2 Founder post

```text
I am reframing InsurClaw as "GStack for consumer insurance advocacy."

The product thesis:
Consumers do not need another insurance chatbot. They need a loyal AI advocate that understands their policies, monitors events, prepares claims, compares renewals, and protects them from acting too early or too weakly.

The build thesis:
Regulated AI products should be vibecoded with structure: specialist agents, deterministic tools, approval gates, tests, audit logs, and documentation that stays current.

Insurance is the first vertical. The pattern applies anywhere consumers face institutional complexity.
```

### 15.3 Technical post

```text
Architecture idea:

User channel
-> Gateway
-> Consumer Advocate orchestrator
-> specialist agents
-> deterministic domain tools
-> memory + audit layer
-> approval gate
-> response or authorized action

For InsurClaw, specialists map to:
- prevention
- event coverage
- underwriting / renewal intelligence
- claims

The key design choice: LLMs draft and explain, deterministic tools calculate and validate, humans approve external action.
```

### 15.4 Vibecoding post

```text
Vibecoding should not mean yolo coding.

For InsurClaw, the loop is:
Discover -> Reframe -> Plan -> Design -> Build -> Review -> QA -> Ship -> Learn

Every feature starts as a narrow consumer job:
"I had a delayed flight. Can I claim?"
"My renewal jumped 28%. Is that fair?"
"My claim was denied. Should I appeal?"

Then the AI team turns that job into a safe workflow with tests, approval gates, and docs.
```

---

## 16. Closing statement

InsurClaw is a proposal for a new class of AI product: the consumer advocate.

It does not replace human judgment. It makes the consumer better prepared before judgment is needed.

It does not remove consent. It makes consent explicit.

It does not promise certainty. It makes uncertainty visible.

It does not ask the user to trust a carrier-controlled workflow. It gives the user their own operating system for insurance decisions.

The lobster metaphor matters:

```text
One claw cuts through bureaucracy.
The other crushes weak outcomes.
```

The broader message:

```text
The future of applied AI is not just faster software creation.
It is stronger consumer agency.
```
