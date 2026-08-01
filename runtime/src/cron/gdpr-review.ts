/**
 * Monthly GDPR consent review — WORKFLOW.md monthly checks
 * Flags users with stored personal data but no recorded consent.
 */

import { getDatabase } from '../memory/database.js';
import { MemoryManager } from '../memory/manager.js';

export interface GdprReviewIssue {
  userId: string;
  issue: 'missing_consent_with_policies' | 'missing_consent_with_claims';
  detail: string;
}

export interface GdprReviewResult {
  reviewedAt: string;
  totalUsers: number;
  withConsent: number;
  withoutConsent: number;
  issues: GdprReviewIssue[];
  healthy: boolean;
}

export function runGdprConsentReview(): GdprReviewResult {
  const db = getDatabase();
  const memory = new MemoryManager();
  const users = db.prepare('SELECT id FROM users').all() as Array<{ id: string }>;
  const issues: GdprReviewIssue[] = [];
  let withConsent = 0;

  for (const { id } of users) {
    if (memory.hasGdprConsent(id)) {
      withConsent += 1;
      continue;
    }

    const policyCount = db.prepare(
      'SELECT COUNT(*) as c FROM policies WHERE user_id = ?'
    ).get(id) as { c: number };

    if (policyCount.c > 0) {
      issues.push({
        userId: id,
        issue: 'missing_consent_with_policies',
        detail: `${policyCount.c} policy record(s) without GDPR consent`,
      });
    }

    const claimCount = db.prepare(
      'SELECT COUNT(*) as c FROM claims WHERE user_id = ?'
    ).get(id) as { c: number };

    if (claimCount.c > 0) {
      issues.push({
        userId: id,
        issue: 'missing_consent_with_claims',
        detail: `${claimCount.c} claim record(s) without GDPR consent`,
      });
    }
  }

  const result: GdprReviewResult = {
    reviewedAt: new Date().toISOString(),
    totalUsers: users.length,
    withConsent,
    withoutConsent: users.length - withConsent,
    issues,
    healthy: issues.length === 0,
  };

  memory.logAudit({
    actionType: 'gdpr_consent_review',
    actionDetail: JSON.stringify({
      totalUsers: result.totalUsers,
      withConsent: result.withConsent,
      withoutConsent: result.withoutConsent,
      issueCount: result.issues.length,
    }),
    outcome: result.healthy ? 'healthy' : 'issues_found',
    gdprBasis: 'legitimate_interest',
  });

  return result;
}

export function formatGdprReviewSummary(result: GdprReviewResult): string {
  const lines = [
    `Monthly GDPR consent review (${result.reviewedAt.slice(0, 10)})`,
    `Users: ${result.totalUsers} total | ${result.withConsent} with consent | ${result.withoutConsent} without`,
    result.healthy
      ? 'Status: healthy — no data-minimization issues detected.'
      : `Status: ${result.issues.length} issue(s) require attention.`,
  ];

  if (result.issues.length > 0) {
    for (const issue of result.issues.slice(0, 5)) {
      lines.push(`- ${issue.userId}: ${issue.detail}`);
    }
    if (result.issues.length > 5) {
      lines.push(`- …and ${result.issues.length - 5} more`);
    }
  }

  return lines.join('\n');
}
