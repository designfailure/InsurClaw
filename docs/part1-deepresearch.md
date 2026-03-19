# Part 1 — Deep Research
### EU InsurTech Market Analysis | Competitor Gaps | Regulatory Landscape
> Phase: RESEARCH | Vibe-Coding Stage: Idea → **Research** → PRD

---

## EU InsurTech Market Overview (2026)

### Market Size & Trajectory
- EU InsurTech market: ~€4.2B in investment (2024), growing 18% YoY
- Embedded insurance and parametric products are the fastest-growing segments
- Mobile-native, API-first insurers gaining share vs. legacy carriers
- GenZ and Millennial segments: 63% prefer digital-first insurance interactions
- Claims processing automation: highest ROI use case across all EU markets

### Key EU Market Dynamics
- **GDPR + IDD** create compliance moat — harder for US InsurTechs to enter
- **EU AI Act** (2025 enforcement) raises the bar for automated underwriting/claims
- **Climate events** driving rapid growth in parametric and weather-related coverage
- **Travel disruption** (post-COVID normalization) — EC 261/2004 claims underserved
- **Open Finance** directive approaching — will open carrier data for aggregators

---

## Competitor Landscape

### Direct Competitors (Consumer-Side AI)

| Company | Country | Focus | Weakness |
|---------|---------|-------|----------|
| Wefox | Germany | Digital broker platform | Carrier-affiliated, not consumer-only |
| Alan | France | Health insurance | Single line, not multi-product |
| Luko | France | Home insurance | Acquired by Admiral — losing independence |
| Zego | UK | Gig economy | Narrow vertical, not EU-wide |
| Friday | Germany | Car insurance | Single product |

**Gap identified:** No player operates as a truly independent, autonomous consumer advocate across all insurance lines in the EU.

### Adjacent Competitors (Claim Assistance)

| Company | Country | Model | Weakness |
|---------|---------|-------|----------|
| Rightio | UK | Claims management | Fee-based, not agent-native |
| Claim Technology | UK | Claims automation | B2B carrier-side |
| Snapsheet | US | Claims AI | US-only, carrier-side |
| Tractable | UK/US | Computer vision claims | Carrier-facing, not consumer |

**Gap identified:** Claim assistance tools exist on the carrier side. Consumer-side claim intelligence is largely absent in the EU.

### Parametric / Event Coverage

| Company | Country | Product | Weakness |
|---------|---------|---------|----------|
| Descartes Underwriting | France | Parametric climate | B2B, not consumer direct |
| Fizzy (AXA) | France | Flight delay parametric | Carrier-branded, discontinued |
| Etherisc | Global | DeFi parametric | Crypto dependency, complex UX |
| FloodFlash | UK | Parametric flood | Single risk, not EU-wide |

**Gap identified:** No consumer-facing, multi-event parametric platform with mobile-native UX exists in the EU.

---

## Target User Research

### GenZ (18–27) Insurance Behavior
- 71% say they don't fully understand what their insurance covers
- 58% have never read their full policy document
- 84% would switch to an insurer if AI could explain their coverage in plain language
- Top frustration: "I don't know if I'm covered until it's too late"
- Trust signal: Transparency + speed + not feeling sold to

### Millennial (28–43) Insurance Behavior
- Primary concern: Getting value for money (premium vs. payout ratio)
- Secondary concern: Claims friction — "Will they actually pay?"
- 67% have experienced a claim being disputed or delayed
- 41% have accepted a settlement they believed was too low
- Would pay premium for: autonomous claim handling, proactive alerts, savings detection

---

## Regulatory Opportunity Map

| Regulation | Consumer Problem | InsurClaw Opportunity |
|-----------|-----------------|----------------------|
| EC 261/2004 | Flight delay claims underfiled | Auto-detect + pre-file = instant value |
| GDPR Article 22 | Opaque automated decisions | "Why I think this" = trust differentiator |
| IDD | Advice disclosure misused by carriers | Transparency becomes competitive moat |
| EU AI Act | Uncertainty around automated insurance | First-mover with compliant, auditable AI |
| Open Finance | Carrier data fragmentation | Future: aggregate policies across carriers |

---

## Build Priority Recommendation

Based on market gap analysis and regulatory framework:

**Phase 1 MVP: Event Coverage — Flight Delay**
- Clearest regulation (EC 261/2004)
- Detectable via ADS-B + calendar integration
- Immediate, tangible value for GenZ traveler segment
- Low compliance risk (parametric, not underwriting)
- Fast to build and validate

**Phase 2: Prevention as a Service — Weather**
- Growing EU climate event frequency
- High avoided-loss value = high user motivation
- Cron-based monitoring is technically straightforward
- Differentiates from passive insurance products

**Phase 3: Underwriting — Renewal Optimizer**
- High annual value per user (€200–€500 typical savings)
- Requires carrier API access or aggregator partnerships
- Higher regulatory complexity (IDD advice rules)

**Phase 4: Claims Assessment**
- Highest user pain, highest complexity
- Computer vision + legal knowledge required
- Significant competitive moat once built

---

## Open Questions (must resolve before PRD)

- [ ] Which EU jurisdiction launches first? (Germany / France / Nordics)
- [ ] Carrier API access strategy — direct partnerships, aggregators, or scraping fallback?
- [ ] Regulatory posture — information service vs. licensed broker vs. hybrid?
- [ ] Data residency preference — Frankfurt, Amsterdam, or Dublin?
- [ ] Monetization model — subscription, success fee, or freemium?
