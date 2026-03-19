# Part 4 — Notes for Agent
### Agent Prompts, Skill Definitions, Test Cases, Build Instructions
> Phase: AGENT CONFIG | Vibe-Coding Stage: Idea → Research → PRD → Tech Design → **Agent Config**

---

## How to Use This File in Cursor

Reference this file when:
- Configuring a new agent or sub-agent
- Writing or refining agent system messages
- Building test cases for a specific feature
- Debugging unexpected agent behavior

---

## Build Checklist (Per Feature Slice)

Before starting any build slice, confirm:

```
[ ] Stage identified (which vibe-coding phase am I in?)
[ ] Objective defined (what does this slice achieve?)
[ ] Smallest viable increment chosen (not the full feature)
[ ] Assumptions listed (what am I treating as known?)
[ ] Test plan defined (how will I verify this works?)
[ ] Approval points identified (what requires sign-off?)
[ ] Risks noted (what could break or cause compliance issues?)
```

---

## Feature Slice 1: Flight Delay Detection (Alpha Priority)

### Objective
Detect flight delays from ADS-B data, calculate EC 261/2004 entitlement, generate a pre-filled claim draft, and deliver to the user via Telegram with an approval gate before submission.

### Build Slice (smallest viable)
1. Poll OpenSky API for a hardcoded test flight number
2. Calculate delay at arrival gate
3. Apply EC 261/2004 compensation table
4. Print a formatted claim draft to console

### Agent Prompt (Event Agent — Flight Delay Sub-task)
```
You are processing a flight delay event.

Flight: {flight_number}
Departure: {departure_airport} | {scheduled_departure}
Arrival: {arrival_airport} | {scheduled_arrival} | {actual_arrival}
Delay at gate: {delay_minutes} minutes
Route distance: {distance_km} km
Carrier: {carrier_name} | Registered: {carrier_country}

EC 261/2004 applies if:
- Departure is from an EU airport, OR
- Arrival is at an EU airport AND carrier is EU-registered
- Applies: {ec261_applies: true/false}

Compensation table:
- <1,500 km + ≥2h delay: €250
- 1,500–3,500 km + ≥3h delay: €400
- >3,500 km + ≥4h delay: €600

Extraordinary circumstances flag: {extraordinary_flag: true/false}
If true: state which circumstance and explain risk to claim success.

Output:
1. Compensation amount (or "not eligible" with reason)
2. Extraordinary circumstances risk assessment
3. Draft claim summary (carrier, flight, delay, amount, filing deadline)
4. Evidence checklist
5. Confidence level (High / Medium / Low)
```

### Test Cases

```javascript
// Test 1: Clear-cut EC 261/2004 case
input: { delay_minutes: 252, distance_km: 1180, carrier_country: 'NL', departure_country: 'NL' }
expected: { eligible: true, compensation: 250, extraordinary_risk: 'LOW' }

// Test 2: Long-haul, marginally eligible
input: { delay_minutes: 240, distance_km: 3800, carrier_country: 'FR', departure_country: 'FR' }
expected: { eligible: true, compensation: 600, extraordinary_risk: 'LOW' }

// Test 3: Short delay, not eligible
input: { delay_minutes: 90, distance_km: 900, carrier_country: 'DE', departure_country: 'DE' }
expected: { eligible: false, compensation: 0 }

// Test 4: Extraordinary circumstances flagged
input: { delay_minutes: 300, distance_km: 1400, carrier_reason: 'bird_strike' }
expected: { eligible: 'uncertain', extraordinary_risk: 'HIGH', note: 'flag for human review' }
```

---

## Feature Slice 2: Weather Prevention Alert

### Objective
Monitor EUMETNET for weather events at user's registered location. When threshold crossed, generate a specific prevention alert with action and avoided-loss estimate. Deliver to Telegram.

### Build Slice (smallest viable)
1. Fetch EUMETNET weather alert for hardcoded coordinates (Paris, FR)
2. Check if alert severity crosses threshold (ORANGE or RED)
3. Map alert type to prevention action from lookup table
4. Generate alert message
5. Print to console (no Telegram yet)

### Agent Prompt (Prevention Agent — Weather Sub-task)
```
You are processing a weather alert for the user's registered property.

Alert data:
- Type: {alert_type} (storm / flood / freeze / heatwave)
- Severity: {severity} (GREEN / ORANGE / RED)
- Location: {address}
- Forecast window: {start_time} to {end_time}
- Expected conditions: {conditions}

User's property profile:
- Construction: {construction_type}
- Last inspection: {last_inspection_date}
- Known vulnerabilities: {vulnerabilities}
- Active coverage: {coverage_summary}

Tasks:
1. Assess which vulnerabilities are activated by this alert type
2. Generate 2–3 specific prevention actions (ranked by impact × urgency ÷ effort)
3. Estimate avoided-loss value if available from claims database
4. Identify whether standard home policy covers the alert-type risk
5. Format as a short Telegram-ready alert (≤3 sentences + action list)

Tone: Direct, specific, no jargon. Include estimated €value where possible.
```

### Prevention Action Lookup Table

```json
{
  "storm_wind": [
    "Clear roof gutters of debris",
    "Move unsecured garden furniture inside",
    "Check and reinforce garage door if >15 years old",
    "Document property exterior with photos now"
  ],
  "flood": [
    "Move valuables above ground floor level",
    "Install temporary flood barriers if available",
    "Locate and know how to operate water shut-off valve",
    "Photograph property interior and valuables for claims evidence"
  ],
  "freeze": [
    "Insulate exposed pipe sections in unheated spaces",
    "Keep heating above 10°C even when absent",
    "Know location of main water shut-off in case of burst",
    "Check that boiler service is current"
  ]
}
```

---

## Feature Slice 3: Claim FNOL Preparation

### Build Slice (smallest viable)
1. Accept user's loss description via Telegram message
2. Parse: loss type, date, estimated value, existing evidence
3. Match to active policy coverage
4. Generate evidence checklist
5. Produce FNOL draft summary
6. Present with approval gate: [Submit Draft] [Modify] [Save for Later]

### Agent Prompt (Claims Agent — FNOL)
```
You are preparing a First Notice of Loss (FNOL) for the user.

User's loss description: {user_message}
Active policies: {policies_json}
Date of loss: {date}
Current evidence available: {evidence_list}

Tasks:
1. Classify loss type (water damage / theft / fire / travel / other)
2. Identify which policy or policies may apply
3. Assess: Likely Covered / Possibly Covered / Likely Excluded
   - State which coverage clause applies
   - State which exclusions are relevant and assess their applicability
4. Generate evidence checklist (what exists vs. what is still needed)
5. Calculate: policy notification deadline from date of loss
6. Draft FNOL summary in carrier-standard format
7. Identify top 2 denial risks and draft counter-arguments

Output format:
- Loss classification
- Coverage assessment
- Evidence checklist (✓ have / □ need)
- FNOL draft (ready to submit pending approval)
- Denial risk assessment with counter-arguments
- Approval gate: [Submit] [Modify] [Save]

Do not submit. Present draft and wait for explicit user approval.
```

---

## Debugging Notes

**If agent repeats "I cannot do that" unnecessarily:**
Check SAFETY.md — agent may be misclassifying a Tier 1 action as Tier 2.
Tier 1 (autonomous): research, analysis, drafting, internal calculations.
Only gate when external action is involved.

**If confidence scores are consistently too low:**
Check that the agent has access to the relevant policy text in context.
Low confidence often means missing input, not genuine uncertainty.

**If coverage assessment is too conservative:**
Remind agent: "Flag exclusion risk clearly, but do not assume exclusion applies without reading the exact clause."

**If Telegram messages are too long:**
Enforce two-message rule: acknowledgment (1 sentence) + result (structured output).
Long messages should use progressive disclosure: core recommendation first, details on request.

---

## Test Suite Structure

```
/tests/
├── unit/
│   ├── ec261-calculator.test.ts      # EC 261/2004 compensation logic
│   ├── weather-threshold.test.ts     # EUMETNET alert classification
│   ├── coverage-matcher.test.ts      # Policy-to-event coverage matching
│   └── redaction.test.ts             # PII auto-redaction from outbound messages
├── integration/
│   ├── flight-delay-flow.test.ts     # Full: ADS-B → calculation → draft → approval gate
│   ├── prevention-alert-flow.test.ts # Full: weather API → alert → Telegram delivery
│   └── fnol-flow.test.ts             # Full: user message → classification → draft
└── compliance/
    ├── gdpr-consent-gate.test.ts     # Verify data use blocked without consent
    ├── approval-gate.test.ts         # Verify external actions require approval
    └── audit-log-integrity.test.ts   # Verify audit trail completeness
```

**Test after every meaningful change. Never assume it works. Run the suite.**
