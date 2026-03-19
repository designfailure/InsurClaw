# InsurClaw — Tools
### Tool Definitions, Cron Job Tools, Per-Intent Mapping

---

## Core Tools

| Tool | Purpose |
|------|---------|
| **InsurTech Claw** | Domain-specific insurance workflows, EC 261/2004 calculator, parametric triggers |
| **Interpreter** | Command parsing, script execution, delegation routing |
| **Web browser** | Headless Chrome for carrier portals, aggregator scraping, document retrieval |
| **Calculator** | Compensation calculations, premium comparisons, settlement ranges |
| **Python** | Data processing, ML inference, OCR, API integrations |
| **Node.js** | Gateway runtime, async I/O, Telegram/WhatsApp adapters |
| **OCR processing** | Document extraction from policy PDFs, claim forms, invoices |
| **Weather APIs** | EUMETNET, MeteoSwiss for weather alerts and parametric evidence |
| **Database** | SQLite for local storage, pgvector for embeddings, policy/claim CRUD |

---

## Cron Job Tools

Tools invoked by cron-triggered JTBD:

| Tool | Cron Use | Purpose |
|------|----------|---------|
| **Interpreter** | All cron jobs | Parse and execute scheduled commands |
| **Delegation** | Agent routing | Route cron trigger to appropriate specialist |
| **Event trigger** | Weather, flight, renewal | Fire internal events to agentic loop |
| **Message** | Notifications | Send alerts to user via Telegram/WhatsApp |
| **e-Mail** | Approval drafts | Prepare email drafts for user approval |
| **OCR** | Document processing | Extract text from uploaded claim documents |
| **Weather API** | Weather monitoring | Fetch EUMETNET/MeteoSwiss alerts |
| **API endpoint tool calling** | External integrations | Call ADS-B, carrier APIs, aggregators |

---

## Per-Intent Tool Mapping

### Flight Delay
- `flight.fetch_status(flight_number)` — ADS-B / OpenSky / airline real-time data
- `ec261.calculate_compensation(delay_hours, distance)` — EU regulation lookup
- `claim.draft_parametric(event_type, evidence)` — Pre-fill claim package
- `user.request_approval(action, summary)` — Gate submission
- `messaging.notify(channel, message)` — Deliver to Telegram/WhatsApp

### Policy Comparison / Renewal Review
- `underwriting.risk_assess(property_data)` — Risk modeling
- `market.scan_policies(coverage_req)` — Live carrier comparison
- `portfolio.optimize(current_policies)` — Bundling + correlation analysis
- `market.price_deviation(quote, zone)` — Market deviation detection

### Claim Filing / Dispute
- `claims.analyze_coverage(policy_id, event)` — Coverage applicability
- `claims.analyze_denial(denial_letter)` — Exclusion parsing
- `legal.search_precedent(jurisdiction, issue)` — Case law lookup
- `dispute.generate_appeal(claim_id, grounds)` — Draft documentation
- `cost.estimate_settlement_range(claim_data)` — Reserve analysis

### Risk Prevention
- `weather.fetch_alerts(location, 72h)` — EUMETNET/MeteoSwiss
- `property.check_vulnerabilities(property_id)` — Maintenance flags
- `travel.assess_itinerary(itinerary)` — Real-time risk scoring
- `prevention.generate_actions(risk_profile)` — Ranked intervention list

---

## Execution Environment

**Docker Sandbox:** All tool execution runs in isolated Docker workspaces per agent. No direct host access.

**Security:**
- CLI/Shell (bash, sh) — Sandboxed, no network unless explicitly authorized
- Browser automation — Headless Chrome in container
- File I/O — Restricted to workspace paths
- API calls — Whitelist of approved endpoints

---

## External API Dependencies (MVP)

| API | Purpose | Provider |
|-----|---------|----------|
| ADS-B Exchange / OpenSky | Flight delay detection | OpenSky (free EU) |
| EUMETNET / MeteoSwiss | Weather alert monitoring | EUMETNET (subscription) |
| Aggregator | Renewal market comparison | TBD — research Phase 1 |
| Telegram Bot API | User channel delivery | Telegram |
| WhatsApp Business API | User channel (Phase 2) | Meta |

---

## Tool Categories (from Architecture Diagram)

**The Hands — Execution Phase:**
- CLI/SHELL (bash, sh)
- BROWSER AUTOMATION (Headless Chrome)
- SEARCH (Web APIs)
- EMAIL CLIENT (SMTP/IMAP)
- FILE I/O (Read/Write)
- SCRIPTS (Python, Node.js)

---

*InsurClaw Tools v1.0 | EU Market | Mar 2026*
