/**
 * Monthly GDPR consent review — WORKFLOW.md cron: `0 7 1 * *`
 * Automated data minimization check; alerts only when attention is needed.
 */

import { randomUUID } from 'crypto';
import { getDatabase } from '../memory/database.js';

export interface GdprReviewConfig {
  slackNotifyChannel?: string;
  onAlert?: (channel: string, message: string) => Promise<void>;
}

export type GdprFindingType =
  | 'missing_consent'
  | 'stale_consent'
  | 'data_without_consent';

export type GdprFindingSeverity = 'info' | 'warning' | 'critical';

export interface GdprReviewFinding {
  type: GdprFindingType;
  severity: GdprFindingSeverity;
  userId?: string;
  message: string;
}

export interface GdprReviewReport {
  reviewedAt: string;
  usersChecked: number;
  findings: GdprReviewFinding[];
  needsAttention: boolean;
}

/** Consent older than this threshold should be re-confirmed (IDD/GDPR best practice). */
export const CONSENT_STALE_MONTHS = 12;

interface UserRow {
  id: string;
  gdpr_consent_at: string | null;
}

function monthsSince(isoDate: string): number {
  const then = new Date(isoDate);
  const now = new Date();
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
}

function countUserDataRows(userId: string): number {
  const db = getDatabase();
  const policies = db
    .prepare('SELECT COUNT(*) as c FROM policies WHERE user_id = ?')
    .get(userId) as { c: number };
  const claims = db
    .prepare('SELECT COUNT(*) as c FROM claims WHERE user_id = ?')
    .get(userId) as { c: number };
  return policies.c + claims.c;
}

export function buildGdprReviewReport(users: UserRow[]): GdprReviewReport {
  const findings: GdprReviewFinding[] = [];

  for (const user of users) {
    if (!user.gdpr_consent_at) {
      const dataRows = countUserDataRows(user.id);
      if (dataRows > 0) {
        findings.push({
          type: 'data_without_consent',
          severity: 'critical',
          userId: user.id,
          message: `User has ${dataRows} policy/claim record(s) but no GDPR consent on file`,
        });
      } else {
        findings.push({
          type: 'missing_consent',
          severity: 'warning',
          userId: user.id,
          message: 'No GDPR consent recorded',
        });
      }
      continue;
    }

    const ageMonths = monthsSince(user.gdpr_consent_at);
    if (ageMonths >= CONSENT_STALE_MONTHS) {
      findings.push({
        type: 'stale_consent',
        severity: 'warning',
        userId: user.id,
        message: `GDPR consent is ${ageMonths} months old — re-confirmation recommended`,
      });
    }
  }

  const needsAttention = findings.some((f) => f.severity !== 'info');

  return {
    reviewedAt: new Date().toISOString(),
    usersChecked: users.length,
    findings,
    needsAttention,
  };
}

function logReviewAudit(report: GdprReviewReport): void {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO audit_log (id, user_id, agent_id, action_type, action_detail, outcome, gdpr_basis)
    VALUES (?, NULL, 'system', 'gdpr_consent_review', ?, ?, 'legitimate_interest')
  `).run(
    randomUUID(),
    JSON.stringify({
      users_checked: report.usersChecked,
      findings_count: report.findings.length,
      needs_attention: report.needsAttention,
    }),
    report.needsAttention ? 'attention_required' : 'healthy'
  );
}

function formatAlertMessage(report: GdprReviewReport): string {
  const critical = report.findings.filter((f) => f.severity === 'critical');
  const warnings = report.findings.filter((f) => f.severity === 'warning');

  const lines = [
    '*Monthly GDPR Consent Review*',
    `Users checked: ${report.usersChecked}`,
    `Findings: ${report.findings.length} (${critical.length} critical, ${warnings.length} warning)`,
  ];

  for (const f of report.findings.slice(0, 10)) {
    lines.push(`• [${f.severity}] ${f.message}`);
  }
  if (report.findings.length > 10) {
    lines.push(`… and ${report.findings.length - 10} more`);
  }

  return lines.join('\n');
}

export async function runGdprConsentReview(config: GdprReviewConfig): Promise<GdprReviewReport> {
  const db = getDatabase();
  const users = db.prepare('SELECT id, gdpr_consent_at FROM users').all() as UserRow[];

  const report = buildGdprReviewReport(users);
  logReviewAudit(report);

  if (report.needsAttention) {
    const message = formatAlertMessage(report);
    console.log('[Cron] GDPR review needs attention:', report.findings.length, 'finding(s)');
    if (config.slackNotifyChannel && config.onAlert) {
      await config.onAlert(config.slackNotifyChannel, message);
    }
  } else {
    console.log('[Cron] GDPR consent review: healthy (', report.usersChecked, 'users)');
  }

  return report;
}
