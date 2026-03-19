/**
 * Cron Scheduler - Proactive monitoring per WORKFLOW.md
 * Weather, flight, renewal, claims, audit integrity
 */

import cron from 'node-cron';
import { getDatabase } from '../memory/database.js';
import { createInsurTechTools } from '../tools/index.js';
import { runSpecialist } from '../agents/specialists/index.js';
import type { InsurTechClaw, CronJTBDId } from '../claw/claw-mechanism.js';

export interface CronConfig {
  slackNotifyChannel?: string;
  onAlert?: (channel: string, message: string) => Promise<void>;
  /** When set, cron JTBD runs are logged through the InsurTech Claw registry (Agentic flow.md) */
  claw?: InsurTechClaw;
}

const tools = createInsurTechTools();

export function setupCronJobs(config: CronConfig): void {
  // Weather monitoring: Every 15 min during storm season (Oct-Mar), daily otherwise
  const isStormSeason = () => {
    const m = new Date().getMonth() + 1;
    return m >= 10 || m <= 3;
  };

  cron.schedule(isStormSeason() ? '*/15 * * * *' : '0 9 * * *', async () => {
    await wrapCron(config, 'weather_monitor', () => runWeatherCheck(config));
  });

  // Flight delay polling: Every 5 min (simplified - production would be travel-window aware)
  cron.schedule('*/5 * * * *', async () => {
    await wrapCron(config, 'flight_poll', () => runFlightPoll(config));
  });

  // Renewal checks: Daily at 09:00 CET
  cron.schedule('0 9 * * *', async () => {
    await wrapCron(config, 'renewal_check', () => runRenewalCheck(config));
  });

  // Claims status: Every 30 min for active claims
  cron.schedule('*/30 * * * *', async () => {
    await wrapCron(config, 'claims_status', () => runClaimsStatusCheck(config));
  });

  // Audit log integrity: Daily at 03:30
  cron.schedule('30 3 * * *', async () => {
    await wrapCron(config, 'audit_integrity', () => runAuditIntegrityCheck());
  });

  console.log('[Cron] Scheduler started');
}

async function wrapCron(
  config: CronConfig,
  jtbd: CronJTBDId,
  fn: () => Promise<void>
): Promise<void> {
  if (config.claw) {
    await config.claw.executeCronJTBD(jtbd, { sessionId: `cron:${jtbd}` }, fn);
  } else {
    await fn();
  }
}

async function runWeatherCheck(config: CronConfig): Promise<void> {
  try {
    const db = getDatabase();
    const users = db.prepare('SELECT id FROM users').all() as Array<{ id: string }>;
    const riskProfiles = db.prepare('SELECT user_id, properties FROM risk_profiles').all() as Array<{
      user_id: string;
      properties: string | null;
    }>;

    for (const rp of riskProfiles) {
      const props = rp.properties ? JSON.parse(rp.properties) : [];
      for (const prop of Array.isArray(props) ? props : []) {
        const location = prop?.address ?? prop?.location ?? 'Paris,FR';
        const alerts = await tools.weatherFetchAlerts(location, 72);
        if (alerts.length > 0) {
          const result = await runSpecialist('prevention_service', 
            `Weather alerts for ${location}: ${JSON.stringify(alerts)}. Generate prevention message.`,
            rp.user_id
          );
          if (config.slackNotifyChannel && config.onAlert) {
            await config.onAlert(config.slackNotifyChannel, result.text ?? '');
          }
          console.log('[Cron] Weather alert:', result.text?.slice(0, 100));
        }
      }
    }
  } catch (err) {
    console.error('[Cron] Weather check failed:', err);
  }
}

async function runFlightPoll(config: CronConfig): Promise<void> {
  try {
    const db = getDatabase();
    // MVP: No active travel tracking yet - would check calendar/travel registrations
    const activeTravel = db.prepare(`
      SELECT DISTINCT user_id FROM claims WHERE status IN ('draft','open') AND event_type = 'flight_delay'
    `).all() as Array<{ user_id: string }>;

    for (const row of activeTravel) {
      const result = await runSpecialist('event_coverage',
        'Check for any new flight delay events for active claims.',
        row.user_id
      );
      console.log('[Cron] Flight poll:', result.text?.slice(0, 80));
    }
  } catch (err) {
    console.error('[Cron] Flight poll failed:', err);
  }
}

async function runRenewalCheck(config: CronConfig): Promise<void> {
  try {
    const db = getDatabase();
    const policies = db.prepare(`
      SELECT p.*, u.id as user_id FROM policies p
      JOIN users u ON p.user_id = u.id
      WHERE julianday(p.end_date) - julianday('now') BETWEEN 3 AND 30
    `).all() as Array<Record<string, unknown>>;

    for (const policy of policies) {
      const result = await runSpecialist('risk_engine',
        `Renewal analysis for policy ending ${policy.end_date}. Compare market.`,
        policy.user_id as string
      );
      console.log('[Cron] Renewal check:', result.text?.slice(0, 80));
    }
  } catch (err) {
    console.error('[Cron] Renewal check failed:', err);
  }
}

async function runClaimsStatusCheck(config: CronConfig): Promise<void> {
  try {
    const db = getDatabase();
    const claims = db.prepare(`
      SELECT c.*, u.id as user_id FROM claims c
      JOIN users u ON c.user_id = u.id
      WHERE c.status IN ('submitted','open')
    `).all() as Array<Record<string, unknown>>;

    for (const claim of claims) {
      const result = await runSpecialist('claims_adjuster',
        `Status check for claim ${claim.id}. Any updates?`,
        claim.user_id as string
      );
      console.log('[Cron] Claims status:', result.text?.slice(0, 80));
    }
  } catch (err) {
    console.error('[Cron] Claims status failed:', err);
  }
}

async function runAuditIntegrityCheck(): Promise<void> {
  try {
    const db = getDatabase();
    const count = db.prepare('SELECT COUNT(*) as c FROM audit_log').get() as { c: number };
    console.log('[Cron] Audit log integrity: ', count.c, 'entries');
    // Production: hash chain verification
  } catch (err) {
    console.error('[Cron] Audit integrity failed:', err);
  }
}
