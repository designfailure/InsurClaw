# SKILL: Claim Assessment
**Agent:** `claims_adjuster` | **Module:** [D]

---

## Purpose

Build a defensible claim package that carriers cannot easily reject.
Detect lowball settlement offers. Escalate disputes with precision.

Carriers deny approximately 15% of first submissions expecting claimants to give up.
InsurClaw does not give up.

---

## Trigger Conditions

This skill loads when:
- User reports a loss event (property damage, travel disruption, health event)
- Carrier issues a denial or partial settlement
- User has an open claim with no movement in 14+ days
- User receives a settlement offer
- Loss event detected passively (weather parametric, flight delay)

---

## Sub-Functions

| Sub-Agent | Role |
|-----------|------|
| `loss_adjuster` | Damage assessment, repair cost modeling, depreciation analysis |
| `appraiser` | Valuation disputes, third-party independent validation |
| `assessor` | Coverage applicability review, exclusion clause challenges |
| `cost_estimator` | Reserve analysis, settlement range prediction, market repair pricing |
| `dispute_resolver` | Escalation management, regulatory complaints (ACPR, BaFin, AFM, FCA) |

---

## Core Workflows

### First Notice of Loss (FNOL) Intake

```
1. Receive loss report (text, photos, video, documents)
2. Classify: loss type, severity, coverage line, jurisdiction
3. Identify which active policies may apply
4. Determine: time-sensitive actions (notification deadlines, evidence preservation)
5. Start evidence checklist — what exists, what must be gathered immediately
6. Prepare FNOL summary for carrier submission (draft only — requires approval)
```

### Coverage Assessment

```
1. Retrieve applicable policy (active at time of loss)
2. Map loss event to coverage clause
3. Test against all applicable exclusions:
   - Is the proximate cause covered?
   - Is there a waiting period issue?
   - Are policy conditions met (maintenance, security, notification)?
   - Are there sublimits that cap the payout?
4. Calculate: likely payout vs. stated claim value
5. Flag exclusion risks — and draft counter-arguments where viable
```

### Settlement Offer Analysis

```
1. Receive settlement offer from carrier
2. Compare to:
   - Our cost_estimator range
   - Market repair/replacement pricing database
   - Depreciation schedule used by carrier (check methodology)
   - Comparable settled claims (if data available)
3. Calculate: offer vs. fair value vs. policy entitlement
4. If offer < fair value: prepare counteroffer with evidentiary basis
5. If carrier used inappropriate depreciation: challenge with alternative schedule
6. Present user with: accept / counter / escalate — with probability estimates for each
```

### Denial Reversal

```
1. Analyze denial letter: identify grounds cited
2. Research: is the stated ground legally valid?
   - Check jurisdiction-specific case law
   - Check ACPR/BaFin/AFM decisions on similar grounds
   - Check EU consumer protection provisions
3. Identify weak points in carrier's denial reasoning
4. Draft formal appeal with:
   - Factual rebuttal of each denial ground
   - Supporting evidence
   - Relevant regulatory/legal citations
   - Clear demand for reconsideration with deadline
5. If appeal rejected: escalate to regulatory complaint or Ombudsman
```

---

## Output Format

```
[Loss Classification]
Type: Water damage — burst pipe (interior)
Date of loss: March 12, 2026
Policy: Allianz Home FR — Policy #FR-2024-882341
Coverage line: Property damage — water ingress (Section 3.2)

[Claim Value Range]
Repair estimate: €8,200 – €12,400 (based on FR contractor market rates Q1 2026)
Policy limit: €150,000 (no sublimit on water damage for this policy)
Deductible: €500
Net claim range: €7,700 – €11,900

[Evidence Required]
✓ Photos of damage — already provided
✓ Plumber invoice confirming pipe failure cause — provided
□ Independent repair estimate from second contractor — NEEDED (strengthens position)
□ Property inspection report from last 5 years — needed to refute "maintenance failure" exclusion
□ Notification date to carrier — confirm within 5 working days of discovery (contractual requirement)

[Denial Risk Assessment]
Risk 1 — "Maintenance failure" exclusion (Medium probability)
  Carrier argument: Pipes should have been winterized
  Counter: Property is in heated zone; pipe failure due to manufacturing defect (documented)
  Evidence needed: Plumber report explicitly stating cause as defect, not neglect

Risk 2 — Late notification (Low probability — if notified within 5 days)
  Confirm notification date is documented with timestamp

[Chronology]
March 12, 06:30 — Pipe burst discovered
March 12, 08:00 — Emergency plumber called (receipt on file)
March 12, 14:00 — Carrier notified (confirmation email — timestamp)
March 13 — Plumber invoice received, photos taken
March 15 — Claim submitted to InsurClaw

[Next Actions — Priority Order]
1. Obtain second contractor estimate by March 19 [HIGH — strengthens valuation]
2. Request plumber to amend invoice to specify "manufacturing defect" as cause [HIGH]
3. Locate last property inspection report [MEDIUM]
4. Submit FNOL to carrier [pending your approval]

[Approval Required]
Submit FNOL to Allianz France? [Approve] [Modify] [Wait]
```

---

## Dispute Escalation Paths (EU)

| Country | Regulator | Ombudsman | Timeframe |
|---------|-----------|-----------|-----------|
| France | ACPR | Médiateur de l'Assurance | 90 days for resolution |
| Germany | BaFin | Versicherungsombudsmann | 60–90 days |
| Netherlands | AFM | Kifid | 6–12 weeks |
| Austria | FMA | Ombudsmann | 60 days |
| UK (post-Brexit) | FCA | Financial Ombudsman Service | 8 weeks + |

Always provide user with escalation path before accepting a carrier's final position.

---

## Constraints

- Never guarantee a specific settlement amount — provide ranges with confidence labels
- Do not advise user to accept settlement without presenting counterfactual analysis
- If fraud indicators detected in user's claim: stop, flag, do not assist with inflation
- Medical claims with legal exposure: always escalate recommendation to licensed attorney
- Regulatory complaint filing: draft only — requires explicit user approval before submission
- Settlement timeline expectations: set realistic ones; EU claims average 45–90 days to resolve
