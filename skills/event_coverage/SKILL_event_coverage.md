# SKILL: Event Coverage
**Agent:** `event_coverage` | **Module:** [B]

---

## Purpose

Detect insurable events in real-time, classify coverage applicability, and
prepare the user's optimal next move — ideally before they even know the event occurred.

Speed is the product.

---

## Covered Event Types

| Event Type | Regulation / Framework | Auto-File Eligible |
|-----------|----------------------|-------------------|
| Flight delay (EU routes) | EC 261/2004 | Yes (if pre-authorized) |
| Flight cancellation | EC 261/2004 | Yes (if pre-authorized) |
| Extreme weather parametric | Policy-specific triggers | Yes (parametric payouts) |
| Commute disruption | Policy-specific | No — draft only |
| Travel interruption | Travel policy | No — draft + evidence |
| Trip cancellation | Travel policy | No — draft + evidence |
| Avatar / eGame loss | Digital asset policy | No — draft + valuation |

---

## Trigger Conditions

This skill loads when:
- User has active travel in calendar + flight data detected
- Weather event crosses parametric threshold at insured location
- Transit API reports major disruption on user's registered commute route
- User reports an event through any channel
- Passive monitoring detects ADS-B delay on a monitored flight

---

## Flight Delay — EC 261/2004 Workflow

```
1. Detect delay via ADS-B monitoring (calendar + flight number lookup)
2. Calculate delay at arrival gate (not departure)
3. Determine flight distance (great-circle)
4. Apply EC 261/2004 compensation table
5. Check for "extraordinary circumstances" exclusion
   - Technical failure: NOT extraordinary (Wallentin-Hermann ruling)
   - Bird strike: extraordinary — flag, do not auto-claim
   - Severe weather without advance warning: extraordinary — flag
6. Draft claim package with: flight number, delay duration, departure/arrival data,
   compensation amount, airline contact, filing deadline
7. Request user approval before submission
```

**EC 261/2004 Compensation Table:**

| Delay at Arrival | Route Distance | Compensation |
|-----------------|----------------|-------------|
| ≥ 2 hours | < 1,500 km | €250 |
| ≥ 3 hours | 1,500–3,500 km | €400 |
| ≥ 3 hours | > 3,500 km (intra-EU) | €400 |
| ≥ 4 hours | > 3,500 km | €600 |

---

## Parametric Weather Workflow

```
1. Monitor registered locations against parametric policy triggers
   - Wind speed: e.g., sustained ≥ 70 km/h for ≥ 3 hours
   - Flood depth: e.g., ≥ 30 cm at registered address
   - Rainfall: e.g., ≥ 50mm in 24 hours
2. Trigger detected → fetch timestamped weather station data as evidence
3. Cross-reference with policy parametric schedule
4. Calculate payout amount (pre-defined by policy terms)
5. Request user approval before submission
6. File automatically if pre-authorized by user
```

---

## Avatar / eGame Coverage Workflow

```
1. User reports event: account theft, tournament cancellation, digital asset loss
2. Classify asset type: gaming account, NFT, esports prize, digital currency
3. Retrieve digital asset valuation (market price at time of loss)
4. Identify applicable coverage in active policies
5. Prepare evidence package:
   - Transaction history / ownership proof
   - Platform incident report
   - Asset valuation snapshot
   - Timeline of events
6. Draft claim package → request user approval
```

---

## Output Format

```
[Event Detected]
Type: Flight delay — KL1234 AMS → LHR
Actual arrival: 23:47 CET | Scheduled: 19:35 CET
Delay at gate: 4 hours 12 minutes
Distance: 357 km

[Coverage View]
Status: LIKELY COVERED under EC 261/2004
Reason: Delay > 3h on route < 1,500 km, EU carrier, EU departure airport
Exclusion risk: LOW — delay logged as technical failure (not extraordinary)
Compensation: €250

[Evidence Checklist]
✓ Flight number and route — confirmed
✓ Actual arrival time — confirmed via ADS-B
✓ Delay cause — technical failure (from airline system)
□ Boarding pass — please attach if requested by airline

[Next Action]
Claim pre-drafted. Ready to submit to KLM customer care.
Filing deadline: 3 years from flight date (NL jurisdiction)
[Approve Submission] [Modify Draft] [Save for Later]

[Confidence: HIGH — 91%]
```

---

## Constraints

- Parametric auto-filing requires explicit pre-authorization from user (set in preferences)
- Never claim "extraordinary circumstances" exclusion doesn't apply without reviewing airline's stated reason
- Digital asset valuations are estimates — label confidence level clearly
- For commute claims: do not auto-file — transit disruption evidence is often contested
- All EC 261/2004 claims: flag that user has right to escalate to national enforcement body if airline rejects
