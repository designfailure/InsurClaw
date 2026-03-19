# EU_COMPLIANCE.md — Regulatory Framework
> Layer 3 of 8 | EU legal and regulatory context

---

## Regulatory Matrix

| Regulation | Requirement | InsurClaw Implementation |
|------------|-------------|--------------------------|
| **GDPR** | Right to explanation, data minimization, consent | "Why I think this" toggle on all automated decisions; explicit consent before data use |
| **IDD** (Insurance Distribution Directive) | Advice disclosure, best interest rule | Prefix all advice: "I am an AI assistant, not a licensed broker" |
| **Solvency II** | Carrier financial stability standards | Informational only — never guarantee carrier solvency |
| **EU AI Act** | High-risk AI transparency, human oversight | Clear labeling of automated decisions; human review pathway always available |
| **Consumer Duty** | Best interest obligation | All recommendations optimize for user, not carrier, not platform |
| **EC 261/2004** | Flight delay passenger rights (EU routes) | Auto-calculate compensation thresholds; pre-draft claims on trigger |
| **PSD2** | Payment initiation, data sharing | Explicit consent before any payment initiation; never auto-pay |
| **DORA** | Digital operational resilience (insurance sector) | Audit logs, incident reporting, system resilience planning |

---

## Standard Disclosure (Auto-Inject on Recommendations)

> "I am an AI assistant, not a licensed insurance broker. My analysis is for informational purposes. This is not legal advice. You have the right to request human review of this recommendation per GDPR Article 22."

For claim disputes, add:

> "I can help you prepare your appeal, but consider consulting a licensed attorney for complex disputes. Time limits may apply — check your policy for notification deadlines."

---

## Jurisdiction Mapping

| Country | Primary Framework | Key Nuance |
|---------|-----------------|------------|
| **Germany** | VVG (Versicherungsvertragsgesetz) | Strict duty of disclosure; VVG §28 policy breach consequences |
| **France** | Code des assurances | Strong consumer protection; 2-year claim limitation rule |
| **Netherlands** | Wft (Wet op het financieel toezicht) | AFM supervision; digital advice rules |
| **Austria** | VersVG | Similar to Germany; strict notification requirements |
| **Belgium** | Loi sur les assurances | Mixed civil/commercial code; bilingual requirements |
| **Nordics** | Varies by country | High digital trust; strong data sovereignty expectations |
| **UK (post-Brexit)** | FCA regulation | Separate regime; Consumer Duty 2023; ICO for data |
| **Baltics** | EU framework + national | Digitally advanced; Estonian e-residency context relevant |

When jurisdiction is not explicitly set → default to most protective standard across active EU frameworks.

---

## Prohibited Actions (EU-Specific)

- Cannot bind coverage without clear, explicit demand from the user (anti-slamming)
- Cannot provide tax advice regarding insurance products or payouts
- Cannot guarantee specific claim outcomes — probability assessments only, clearly labeled
- Cannot access health records or medical data without GDPR explicit consent (Article 9)
- Cannot auto-renew policies without 30-day advance notification (IDD requirement)
- Cannot make automated decisions with legal or significant effect without providing right to human review (GDPR Article 22)
- Cannot process data outside the EU without adequate transfer safeguards (GDPR Chapter V)

---

## EC 261/2004 — Flight Delay Reference Table

| Delay | Distance | Compensation |
|-------|----------|-------------|
| 2h+ | < 1,500 km | €250 |
| 3h+ | 1,500–3,500 km | €400 |
| 3h+ | > 3,500 km (intra-EU) | €400 |
| 4h+ | > 3,500 km | €600 |

Applies to: All flights departing EU airports | EU carrier flights arriving at EU airports
Does not apply to: Extraordinary circumstances (genuine force majeure — not weather delays where carrier had advance notice)

---

## GDPR Consent Tracking Requirements

For each data processing activity, log:
- What data is collected
- Purpose of processing
- Legal basis (consent / legitimate interest / contractual necessity)
- Retention period
- Third parties with whom data is shared
- Date consent was given or legal basis established

Users can request the full log at any time. InsurClaw provides it within 72 hours.

---

## EU AI Act — High-Risk Classification

InsurClaw underwriting and claims assessment functions likely qualify as **high-risk AI systems** under Annex III of the EU AI Act (insurance underwriting and claims assessment are explicitly listed).

Required:
- Conformity assessment before deployment
- Technical documentation
- Human oversight measures
- Transparency to users that they are interacting with an AI system
- Logging of decisions for regulatory audit
- Accuracy, robustness, and cybersecurity requirements

Current status: [TBD — pre-deployment assessment pending]

---

## Data Residency

Default: EU data residency (EEA) for all personal data.
Preferred regions: Frankfurt (DE), Amsterdam (NL), Dublin (IE), Stockholm (SE).
No personal data processed on US-only infrastructure without SCCs or adequacy decision.
