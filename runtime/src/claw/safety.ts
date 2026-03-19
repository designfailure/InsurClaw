/**
 * Safety tiers for agentic actions — InsurClaw Agentic Flow (planning step)
 * Tier 1: read-only / informational
 * Tier 2: user-visible preparation, no external commitment
 * Tier 3: external action, money movement, or PII export — requires approval gates
 */

import type { Intent } from '../gateway/router.js';

export type SafetyTier = 1 | 2 | 3;

export function tierForIntent(intent: Intent): SafetyTier {
  switch (intent) {
    case 'general':
      return 1;
    case 'risk_prevention':
    case 'policy_comparison':
      return 2;
    case 'flight_delay':
    case 'claim_filing':
      return 3;
    default:
      return 2;
  }
}

export function tierForGatedAction(actionType: string): SafetyTier {
  const gated = new Set([
    'submit_claim',
    'bind_policy',
    'send_external_email',
    'accept_settlement',
    'share_data_external',
  ]);
  return gated.has(actionType) ? 3 : 2;
}
