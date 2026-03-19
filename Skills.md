# InsurClaw — Skills Registry
### Domain Skills & ClawHub-Compatible Skill Library

---

## Skill Registry Overview

InsurClaw skills are reusable, versioned packages of agent capabilities. Skills are loaded dynamically per turn based on user intent. Each domain skill maps to a feature module: [A] Prevention, [B] Event Coverage, [C] Underwriting, [D] Claim Assessment.

**Loading protocol:** Only skills relevant to the current intent are loaded. Skills are cached in `/workspace/sessions/{id}/skills_cache/` for the session duration.

---

## Domain Skills

### 1. prevention_as_service
**Agent:** `prevention_service` | **Module:** [A]

**Purpose:** Proactively detect, monitor, and prevent insurable losses before they occur. Reduce claim frequency → reduce premiums → save the user money.

**Trigger Conditions:**
- Weather alert detected for user's registered locations
- Property maintenance flag is overdue
- User has upcoming travel in calendar
- Seasonal storm window activates (Oct 1 – Mar 31)
- Behavioral risk signal exceeds threshold
- User explicitly asks about risk prevention

**Data Inputs:**
| Source | Data | Update Frequency |
|--------|------|------------------|
| EUMETNET / MeteoSwiss | Weather alerts, storm forecasts | Every 15 min (storm season) |
| Property registry | Building age, construction type, last inspection | On event |
| IoT / smart home sensors | Water leak, smoke, temperature anomalies | Real-time where connected |
| Travel calendar | Itinerary, destination, dates | On sync |
| Travel advisories | FCDO, EU travel warnings, local threat levels | Daily |
| Dark web monitoring | Credential breach alerts | Continuous |

**Core Behaviors:**
- Risk Detection: Classify by type (weather, property, travel, cyber, behavioral); score severity; identify relevant policies
- Intervention: Map risk to prevention actions; rank by impact × urgency ÷ user effort; include avoided-loss estimate
- Communication: Short, specific messages; lead with risk and action; two-message max

**Output Format:** [Risk Detected] [Prevention Action] [Avoided Loss Estimate] [Monitoring Status]

---

### 2. event_coverage
**Agent:** `event_coverage` | **Module:** [B]

**Purpose:** Detect insurable events in real-time, classify coverage applicability, and prepare the user's optimal next move — ideally before they know the event occurred. Speed is the product.

**Trigger Conditions:**
- User has active travel in calendar + flight data detected
- Weather event crosses parametric threshold at insured location
- Transit API reports major disruption on user's registered commute route
- User reports an event through any channel
- Passive monitoring detects ADS-B delay on a monitored flight

**Covered Event Types:**
| Event Type | Regulation / Framework | Auto-File Eligible |
|------------|-------------------------|-------------------|
| Flight delay (EU routes) | EC 261/2004 | Yes (if pre-authorized) |
| Flight cancellation | EC 261/2004 | Yes (if pre-authorized) |
| Extreme weather parametric | Policy-specific triggers | Yes (parametric payouts) |
| Commute disruption | Policy-specific | No — draft only |
| Travel interruption | Travel policy | No — draft + evidence |
| Avatar / eGame loss | Digital asset policy | No — draft + valuation |

**Core Behaviors:**
- Flight delay: Detect via ADS-B, calculate EC 261/2004 compensation, check extraordinary circumstances
- Parametric weather: Monitor triggers, fetch evidence, cross-reference policy schedule
- Avatar/eGame: Classify asset type, retrieve valuation, prepare evidence package

**Output Format:** [Event Detected] [Coverage View] [Evidence Checklist] [Next Action] [Confidence]

---

### 3. underwriting_engine
**Agent:** `risk_engine` | **Module:** [C]

**Purpose:** Structure insurable risk and route the user to the best-fit product. Reverse-engineer carrier pricing to surface undervalued coverage and overpriced renewals.

**Trigger Conditions:**
- User receives a renewal quote
- User requests a new policy or coverage comparison
- User is underinsured (detected from profile vs. asset values)
- Significant life event changes risk profile
- Portfolio optimization opportunity detected

**Risk Engine Inputs:**
| Input Category | Sources |
|----------------|---------|
| Property | Satellite imagery, CoreLogic EU, cadastral data |
| Location | EUMETNET climate risk, local authority flood maps |
| Behavioral | Telematics, wearables (with consent) |
| Portfolio | All active policies |
| Market | Carrier APIs, aggregator data |
| Claims history | Internal + declared history |

**Core Workflows:**
- Renewal Quote Analysis: Calculate market deviation, identify why, scan competitors, present switching savings
- New Policy / Product Comparison: Assess exposure, map coverage needs, compare carriers, score options
- Coverage Gap Detection: Map portfolio vs. assets, identify gaps, recommend products

**Output Format:** [Risk Profile] [Product Fit] [Recommendation] [Tradeoffs] [Missing Inputs] [Confidence]

---

### 4. claims_assessment
**Agent:** `claims_adjuster` | **Module:** [D]

**Purpose:** Build defensible claim packages that carriers cannot easily reject. Detect lowball settlement offers. Escalate disputes with precision.

**Trigger Conditions:**
- User reports a loss event
- Carrier issues a denial or partial settlement
- User has an open claim with no movement in 14+ days
- User receives a settlement offer
- Loss event detected passively (weather parametric, flight delay)

**Sub-Functions:**
| Sub-Agent | Role |
|-----------|------|
| loss_adjuster | Damage assessment, repair cost modeling, depreciation analysis |
| appraiser | Valuation disputes, third-party independent validation |
| assessor | Coverage applicability review, exclusion clause challenges |
| cost_estimator | Reserve analysis, settlement range prediction, market repair pricing |
| dispute_resolver | Escalation management, regulatory complaints (ACPR, BaFin, AFM, FCA) |

**Core Workflows:**
- FNOL Intake: Classify loss, identify policies, start evidence checklist
- Coverage Assessment: Map loss to coverage clause, test exclusions, calculate payout range
- Settlement Offer Analysis: Compare to cost_estimator range, prepare counteroffer
- Denial Reversal: Analyze denial letter, research legal validity, draft appeal

**Output Format:** [Loss Classification] [Claim Value Range] [Evidence Required] [Denial Risk] [Chronology] [Next Actions] [Approval Required]

---

## ClawHub-Compatible Skill Library

Insurance-specific skills distributed through a ClawHub-compatible registry:

| Skill Name | Description |
|------------|-------------|
| `insur-kyc` | Know Your Customer (KYC) verification using government ID APIs |
| `insur-telematics` | Integration with connected vehicle telematics platforms |
| `insur-claims-vision` | Computer vision tool for analyzing damage photos |
| `insur-fraud-detect` | Multi-layer fraud detection using rule-based and ML models |
| `insur-doc-gen` | Policy and claims document generation |
| `insur-payment` | Integration with payment gateways for claim settlements |
| `insur-weather` | Real-time weather data for proactive risk notifications |
| `insur-medical-codes` | Medical billing code validation for health claims |

---

## Web publishing (here.now)

**Skill:** `here_now` | **Source:** [heredotnow/skill](https://github.com/heredotnow/skill) (also: `npx skills add heredotnow/skill --skill here-now`)

**Purpose:** Publish static files or folders to a public URL instantly — useful for sharing claim summaries, policy comparison pages, or user-facing HTML exports.

**Trigger conditions:** User asks to publish, host, deploy, share a link, or put assets on the web.

**Location:** `skills/here_now/SKILL.md` — scripts in `skills/here_now/scripts/`.

---

## Skill File Locations

```
insurclaw/skills/
├── prevention_as_service/SKILL.md
├── event_coverage/SKILL.md
├── underwriting_engine/SKILL.md
├── claims_assessment/SKILL.md
└── here_now/
    ├── SKILL.md
    ├── scripts/
    └── references/
```

---

*InsurClaw Skills Registry v1.0 | EU Market | Mar 2026*
