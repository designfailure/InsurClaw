/**
 * Claw validate step — explicit GDPR + Tier-3 submission language checks (stub rules).
 */

import type { RoutedMessage } from '../gateway/router.js';
import type { AgentResponse } from '../agents/orchestrator.js';
import type { MemoryManager } from '../memory/manager.js';
import { tierForIntent } from './safety.js';

export interface ValidationCheckResult {
  id: string;
  passed: boolean;
  detail?: string;
}

const INTENTS_REQUIRING_GDPR = new Set<string>([
  'flight_delay',
  'policy_comparison',
  'claim_filing',
  'risk_prevention',
]);

/** Wording that implies insurer submission without an approval gate */
const SUBMISSION_IMPLIES = [
  /submitted\s+on\s+your\s+behalf/i,
  /I\s+have\s+filed\s+(?:the\s+)?claim/i,
  /I\s+sent\s+(?:this\s+)?to\s+(?:the\s+)?(?:insurer|carrier)/i,
  /claim\s+has\s+been\s+submitted/i,
  /policy\s+has\s+been\s+bound/i,
  /(?:FNOL|claim)\s+was\s+filed\s+with/i,
];

export function validateAgentOutput(
  routed: RoutedMessage,
  response: AgentResponse,
  memory: MemoryManager
): { passed: boolean; checks: ValidationCheckResult[] } {
  const checks: ValidationCheckResult[] = [];

  const needsGdpr = INTENTS_REQUIRING_GDPR.has(routed.intent);
  const consent = memory.hasGdprConsent(routed.userId);

  checks.push({
    id: 'gdpr_portfolio_intent',
    passed: !needsGdpr || consent,
    detail:
      needsGdpr && !consent
        ? 'Intent expects portfolio context; GDPR consent not recorded — use compliance_check_gdpr or ask for consent.'
        : undefined,
  });

  const tier = tierForIntent(routed.intent);
  let submissionLanguage = false;
  if (tier === 3 && !response.approvalRequested) {
    submissionLanguage = SUBMISSION_IMPLIES.some((re) => re.test(response.text));
  }

  checks.push({
    id: 'tier3_submission_language',
    passed: !submissionLanguage,
    detail: submissionLanguage
      ? 'Tier-3 intent: response implies external submission without approval_request — gate or rephrase.'
      : undefined,
  });

  const passed = checks.every((c) => c.passed);
  return { passed, checks };
}

export function formatValidationWarnings(checks: ValidationCheckResult[]): string {
  const failed = checks.filter((c) => !c.passed);
  if (failed.length === 0) return '';
  return `[Validation]\n${failed.map((f) => `- ${f.id}: ${f.detail ?? 'failed'}`).join('\n')}\n\n`;
}
