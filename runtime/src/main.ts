/**
 * InsurClaw Runtime - Main entry point
 * Starts the gateway (Slack + WhatsApp admin)
 */

import 'dotenv/config';
import { InsurClawGateway } from './gateway/gateway.js';
import { closeDatabase } from './memory/database.js';
import { env } from './config/index.js';

async function main() {
  if (!env.slackBotToken || !env.slackSigningSecret) {
    console.error('Missing SLACK_BOT_TOKEN or SLACK_SIGNING_SECRET. Set in .env');
    process.exit(1);
  }

  const gateway = new InsurClawGateway();
  await gateway.start({ slackPort: 3000 });

  // Start cron jobs for proactive monitoring
  const { setupCronJobs } = await import('./cron/scheduler.js');
  setupCronJobs({
    claw: gateway.claw,
    onAlert: async (channel, message) => {
      console.log('[Cron] Alert for', channel, ':', message.slice(0, 100));
    },
  });

  const shutdown = async () => {
    console.log('\nShutting down...');
    await gateway.stop();
    closeDatabase();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
