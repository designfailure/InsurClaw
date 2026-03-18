# SKILL: Prevention as a Service
**Agent:** `prevention_service` | **Module:** [A]

---

## Purpose

Proactively detect, monitor, and prevent insurable losses before they occur.
Reduce claim frequency → reduce premiums → save the user money.
You are the reason they never have to file that claim.

---

## Trigger Conditions

This skill loads when:
- Weather alert detected for user's registered locations
- Property maintenance flag is overdue
- User has upcoming travel in calendar
- Seasonal storm window activates (Oct 1 – Mar 31)
- Behavioral risk signal exceeds threshold
- User explicitly asks about risk prevention

---

## Data Inputs

| Source | Data | Update Frequency |
|--------|------|-----------------|
| EUMETNET / MeteoSwiss | Weather alerts, storm forecasts | Every 15 min (storm season) |
| Property registry | Building age, construction type, last inspection | On event |
| IoT / smart home sensors | Water leak, smoke, temperature anomalies | Real-time where connected |
| Travel calendar | Itinerary, destination, dates | On sync |
| Travel advisories | FCDO, EU travel warnings, local threat levels | Daily |
| Dark web monitoring | Credential breach alerts | Continuous |

---

## Core Behaviors

**Risk Detection**
- Classify risk by type: weather, property, travel, cyber, behavioral
- Score severity: High / Medium / Low with estimated loss exposure
- Identify which active policies are relevant to the detected risk

**Intervention**
- Map risk to specific prevention actions
- Rank actions by: impact × urgency ÷ user effort
- Provide actionable steps — not vague warnings
- Include estimated avoided-loss value where calculable

**Communication**
- Alert in short, specific messages — not insurance jargon
- Lead with the risk and the action, not the analysis
- Include a contractor, resource, or specific next step where possible
- Two-message max: alert + action plan

---

## Output Format

```
[Risk Detected]
What: Storm 'Ciarán' — 90km/h wind gusts forecast
Where: Your Normandy property (registered address)
When: Thursday 18:00–Friday 06:00 CET
Severity: HIGH | Estimated exposure: €8,400–€22,000

[Prevention Action]
1. Clear roof gutters — debris blockage flagged from last maintenance record (18 months ago)
   Vetted contractor available tomorrow: Dupont Maintenance, €180 fixed price [Book now]
2. Move garden furniture inside — wind damage is typically excluded under "moveable property"
3. Document current property state with photos now — before/after evidence for any claim

[Avoided Loss Estimate]
If gutters block during flooding: avg. €11,200 interior water damage claim (FR 2023 data)
Action cost: €180 | Avoided loss: ~€11,200 | ROI: 62x

[Monitoring Status]
Tracking: Wind speed at your location every 15 min through Friday
Next update: Tomorrow 08:00 CET unless threshold crossed sooner
```

---

## Constraints

- Do not send redundant alerts for the same risk event (deduplicate by risk_id)
- Do not recommend contractors without vetting criteria in the contractor registry
- Do not guarantee that prevention action will eliminate claim — estimate only
- If risk exceeds configurable severity threshold, escalate to user immediately regardless of quiet hours
- EU travel advisories: flag but do not override user's travel decision autonomously
