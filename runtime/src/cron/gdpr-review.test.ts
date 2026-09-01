import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomUUID } from 'crypto';
import { getDatabase, closeDatabase, runMigration } from '../memory/database.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  buildGdprReviewReport,
  runGdprConsentReview,
  CONSENT_STALE_MONTHS,
} from './gdpr-review.js';

const schemaPath = join(dirname(fileURLToPath(import.meta.url)), '../../database/schema.sql');

function insertUser(consentAt: string | null): string {
  const id = randomUUID();
  const db = getDatabase();
  db.prepare(
    'INSERT INTO users (id, slack_user_id, gdpr_consent_at) VALUES (?, ?, ?)'
  ).run(id, `slack_${id.slice(0, 8)}`, consentAt);
  return id;
}

function staleConsentDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - CONSENT_STALE_MONTHS - 1);
  return d.toISOString();
}

function freshConsentDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString();
}

describe('buildGdprReviewReport', () => {
  beforeEach(() => {
    process.env.INSURCLAW_DB_PATH = ':memory:';
    runMigration(schemaPath);
  });

  afterEach(() => {
    closeDatabase();
  });

  it('reports healthy when all users have fresh consent', () => {
    const id = insertUser(freshConsentDate());
    const report = buildGdprReviewReport([{ id, gdpr_consent_at: freshConsentDate() }]);
    expect(report.needsAttention).toBe(false);
    expect(report.findings).toHaveLength(0);
  });

  it('flags missing consent as warning when no data exists', () => {
    const id = insertUser(null);
    const report = buildGdprReviewReport([{ id, gdpr_consent_at: null }]);
    expect(report.needsAttention).toBe(true);
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0].type).toBe('missing_consent');
    expect(report.findings[0].severity).toBe('warning');
  });

  it('flags data without consent as critical', () => {
    const id = insertUser(null);
    const db = getDatabase();
    db.prepare(
      'INSERT INTO policies (id, user_id, carrier) VALUES (?, ?, ?)'
    ).run(randomUUID(), id, 'TestCarrier');

    const report = buildGdprReviewReport([{ id, gdpr_consent_at: null }]);
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0].type).toBe('data_without_consent');
    expect(report.findings[0].severity).toBe('critical');
  });

  it('flags stale consent older than threshold', () => {
    const stale = staleConsentDate();
    const id = insertUser(stale);
    const report = buildGdprReviewReport([{ id, gdpr_consent_at: stale }]);
    expect(report.needsAttention).toBe(true);
    expect(report.findings[0].type).toBe('stale_consent');
  });
});

describe('runGdprConsentReview', () => {
  beforeEach(() => {
    process.env.INSURCLAW_DB_PATH = ':memory:';
    runMigration(schemaPath);
  });

  afterEach(() => {
    closeDatabase();
  });

  it('writes audit log entry on completion', async () => {
    insertUser(freshConsentDate());
    const report = await runGdprConsentReview({});
    expect(report.usersChecked).toBe(1);

    const db = getDatabase();
    const row = db
      .prepare("SELECT * FROM audit_log WHERE action_type = 'gdpr_consent_review'")
      .get() as { outcome: string };
    expect(row.outcome).toBe('healthy');
  });

  it('calls onAlert when findings need attention', async () => {
    insertUser(null);
    const alerts: string[] = [];
    await runGdprConsentReview({
      slackNotifyChannel: '#compliance',
      onAlert: async (_channel, message) => {
        alerts.push(message);
      },
    });
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toContain('GDPR Consent Review');
  });
});
