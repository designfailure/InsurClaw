/**
 * Per-turn tool hints from WORKFLOW.md — dynamic context for planning (not enforced execution)
 */

import type { Intent } from '../gateway/router.js';

export const INTENT_TOOL_REGISTRY: Record<Intent, readonly string[]> = {
  flight_delay: [
    'flight.fetch_status',
    'ec261.calculate_compensation',
    'claim.draft_parametric',
    'user.request_approval',
    'messaging.notify',
  ],
  policy_comparison: [
    'underwriting.risk_assess',
    'market.scan_policies',
    'portfolio.optimize',
    'market.price_deviation',
  ],
  claim_filing: [
    'claims.analyze_coverage',
    'claims.analyze_denial',
    'legal.search_precedent',
    'dispute.generate_appeal',
    'cost.estimate_settlement_range',
  ],
  risk_prevention: [
    'weather.fetch_alerts',
    'property.check_vulnerabilities',
    'travel.assess_itinerary',
    'prevention.generate_actions',
  ],
  general: ['crm.query', 'compliance.check_gdpr', 'messaging.send', 'delegate'],
};

export function recommendedToolsForIntent(intent: Intent): readonly string[] {
  return INTENT_TOOL_REGISTRY[intent];
}
