# InsurClaw Runtime

Autonomous consumer insurance advocate - EU market. Slack primary channel, WhatsApp admin notifications.

## Quick Start

```bash
# Install
npm install

# Database migration
npm run db:migrate

# Build
npm run build

# Start (requires .env with SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, ANTHROPIC_API_KEY)
npm start
```

## Environment

Copy `.env.example` to `.env` and configure:

- `SLACK_BOT_TOKEN` - Slack Bot token (required)
- `SLACK_SIGNING_SECRET` - Slack signing secret (required)
- `ANTHROPIC_API_KEY` - Claude API key (required)
- `SLACK_APP_TOKEN` - Optional, for Socket Mode
- `ADMIN_WHATSAPP_IDS` - Optional, comma-separated for admin push

## Architecture

- **Gateway**: Slack adapter (primary), WhatsApp admin (push)
- **Orchestrator**: Consumer Advocate (Claude)
- **Specialists**: Prevention, Event, Underwriting, Claims
- **Tools**: EC 261, weather, underwriting, claims
- **Cron**: Weather, flight, renewal, claims, audit

## Tests

```bash
npm test
```
