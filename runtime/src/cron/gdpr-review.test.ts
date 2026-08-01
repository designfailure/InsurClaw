import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from '../memory/database.js';
import { formatGdprReviewSummary, runGdprConsentReview } from './gdpr-review.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('runGdprConsentReview', () => {
  beforeAll(() => {
    const schema = readFileSync(join(__dirname, '../../database/schema.sql'), 'utf-8');
    const db = getDatabase();
    db.exec(schema);
  });

  it('reports healthy when no users exist', () => {
    const db = getDatabase();
    db.exec('DELETE FROM claims');
    db.exec('DELETE FROM policies');
    db.exec('DELETE FROM users');

    const result = runGdprConsentReview();
    expect(result.healthy).toBe(true);
    expect(result.totalUsers).toBe(0);
    expect(result.issues).toHaveLength(0);
  });

  it('flags users with policies but no consent', () => {
    const db = getDatabase();
    db.exec('DELETE FROM claims');
    db.exec('DELETE FROM policies');
    db.exec('DELETE FROM users');

    db.prepare("INSERT INTO users (id, slack_user_id) VALUES ('user-a', 'UA')").run();
    db.prepare(`
      INSERT INTO policies (id, user_id, carrier, type)
      VALUES ('policy-1', 'user-a', 'TestCarrier', 'home')
    `).run();

    const result = runGdprConsentReview();
    expect(result.healthy).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].issue).toBe('missing_consent_with_policies');
  });

  it('formats a readable summary', () => {
    const summary = formatGdprReviewSummary({
      reviewedAt: '2026-08-01T07:00:00.000Z',
      totalUsers: 2,
      withConsent: 1,
      withoutConsent: 1,
      issues: [],
      healthy: true,
    });

    expect(summary).toContain('Monthly GDPR consent review');
    expect(summary).toContain('healthy');
  });
});
