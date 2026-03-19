/**
 * Intent-scoped Anthropic tool definitions — aligned with WORKFLOW.md / intent-tools.ts
 */

import type Anthropic from '@anthropic-ai/sdk';
import type { Intent } from '../gateway/router.js';

function tool(t: Anthropic.Tool): Anthropic.Tool {
  return t;
}

export const ORCHESTRATOR_TOOLS = {
  compliance_check_gdpr: tool({
    name: 'compliance_check_gdpr',
    description: 'Verify GDPR consent before using personal or portfolio data',
    input_schema: {
      type: 'object' as const,
      properties: { action: { type: 'string', description: 'Action requiring consent' } },
      required: ['action'],
    },
  }),

  crm_query: tool({
    name: 'crm_query',
    description:
      'Structured query of user risk profile, policies, and claim history. Requires GDPR consent.',
    input_schema: {
      type: 'object' as const,
      properties: { user_id: { type: 'string', description: 'User ID' } },
      required: ['user_id'],
    },
  }),

  messaging_send: tool({
    name: 'messaging_send',
    description: 'Send message to user channel (Slack)',
    input_schema: {
      type: 'object' as const,
      properties: {
        channel: { type: 'string' },
        content: { type: 'string' },
        thread_ts: { type: 'string', description: 'Thread timestamp for replies' },
      },
      required: ['channel', 'content'],
    },
  }),

  approval_request: tool({
    name: 'approval_request',
    description:
      'Request user approval for external action (submit claim, bind policy, share data externally, etc.)',
    input_schema: {
      type: 'object' as const,
      properties: {
        action_type: {
          type: 'string',
          enum: ['submit_claim', 'bind_policy', 'send_external_email', 'accept_settlement', 'share_data_external'],
        },
        summary: { type: 'string' },
        details: { type: 'string' },
      },
      required: ['action_type', 'summary'],
    },
  }),

  request_here_now_publish: tool({
    name: 'request_here_now_publish',
    description:
      'Request approval to publish a previously exported static HTML file to a public URL (here.now). User must approve before any URL goes live.',
    input_schema: {
      type: 'object' as const,
      properties: {
        artifact_path: { type: 'string', description: 'Absolute path to HTML file from export_static_html' },
        summary: { type: 'string', description: 'Short description for approval UI' },
      },
      required: ['artifact_path', 'summary'],
    },
  }),

  delegate: tool({
    name: 'delegate',
    description:
      'Delegate task to specialist agent (prevention_service, event_coverage, risk_engine, claims_adjuster)',
    input_schema: {
      type: 'object' as const,
      properties: {
        agent_id: {
          type: 'string',
          enum: ['prevention_service', 'event_coverage', 'risk_engine', 'claims_adjuster'],
        },
        task: { type: 'string' },
        context: { type: 'object', description: 'Additional context for the specialist' },
      },
      required: ['agent_id', 'task'],
    },
  }),

  ec261_calculate_compensation: tool({
    name: 'ec261_calculate_compensation',
    description: 'EC 261/2004 flight delay compensation estimate (EUR)',
    input_schema: {
      type: 'object' as const,
      properties: {
        delay_minutes: { type: 'number' },
        distance_km: { type: 'number' },
      },
      required: ['delay_minutes', 'distance_km'],
    },
  }),

  flight_fetch_status: tool({
    name: 'flight_fetch_status',
    description: 'Fetch flight status / delay info by flight number (MVP stub)',
    input_schema: {
      type: 'object' as const,
      properties: { flight_number: { type: 'string' } },
      required: ['flight_number'],
    },
  }),

  weather_fetch_alerts: tool({
    name: 'weather_fetch_alerts',
    description: 'Fetch weather alerts for a location (hours lookahead)',
    input_schema: {
      type: 'object' as const,
      properties: {
        location: { type: 'string' },
        hours: { type: 'number', description: 'Hours to look ahead (default 72)' },
      },
      required: ['location'],
    },
  }),

  claim_draft_parametric: tool({
    name: 'claim_draft_parametric',
    description: 'Draft a parametric / structured claim package (draft only — not submitted)',
    input_schema: {
      type: 'object' as const,
      properties: {
        event_type: { type: 'string' },
        evidence: { type: 'object', description: 'Evidence payload' },
      },
      required: ['event_type'],
    },
  }),

  underwriting_risk_assess: tool({
    name: 'underwriting_risk_assess',
    description: 'Property / risk scoring for underwriting comparison',
    input_schema: {
      type: 'object' as const,
      properties: { property_data: { type: 'object' } },
      required: ['property_data'],
    },
  }),

  market_scan_policies: tool({
    name: 'market_scan_policies',
    description: 'Scan market for policy quotes (MVP may return empty — compare at renewal)',
    input_schema: {
      type: 'object' as const,
      properties: { coverage_requirements: { type: 'object' } },
      required: ['coverage_requirements'],
    },
  }),

  market_price_deviation: tool({
    name: 'market_price_deviation',
    description: 'Compare a quoted premium to estimated market average for zone',
    input_schema: {
      type: 'object' as const,
      properties: {
        quote: { type: 'number' },
        zone: { type: 'string' },
        market_avg: { type: 'number', description: 'Optional market average premium' },
      },
      required: ['quote', 'zone'],
    },
  }),

  claims_analyze_coverage: tool({
    name: 'claims_analyze_coverage',
    description: 'Assess coverage applicability for an event vs policy',
    input_schema: {
      type: 'object' as const,
      properties: {
        policy_id: { type: 'string' },
        event: { type: 'object' },
      },
      required: ['policy_id', 'event'],
    },
  }),

  claims_analyze_denial: tool({
    name: 'claims_analyze_denial',
    description: 'Parse insurer denial letter for reasons and counter-arguments',
    input_schema: {
      type: 'object' as const,
      properties: { denial_letter: { type: 'string' } },
      required: ['denial_letter'],
    },
  }),

  claims_estimate_settlement: tool({
    name: 'claims_estimate_settlement',
    description: 'Estimate settlement value range from claim data',
    input_schema: {
      type: 'object' as const,
      properties: { claim_data: { type: 'object' } },
      required: ['claim_data'],
    },
  }),

  export_static_html: tool({
    name: 'export_static_html',
    description:
      'Generate a static HTML page (claim summary or renewal comparison) and save under the session. Does not publish — call request_here_now_publish after user approves.',
    input_schema: {
      type: 'object' as const,
      properties: {
        kind: { type: 'string', enum: ['claim_summary', 'renewal_comparison'] },
        user_id: { type: 'string' },
      },
      required: ['kind', 'user_id'],
    },
  }),
} as const;

export type OrchestratorToolName = keyof typeof ORCHESTRATOR_TOOLS;

const INTENT_TOOLSETS: Record<Intent, OrchestratorToolName[]> = {
  general: [
    'compliance_check_gdpr',
    'crm_query',
    'messaging_send',
    'approval_request',
    'delegate',
  ],

  flight_delay: [
    'compliance_check_gdpr',
    'crm_query',
    'ec261_calculate_compensation',
    'flight_fetch_status',
    'claim_draft_parametric',
    'delegate',
    'approval_request',
    'messaging_send',
  ],

  policy_comparison: [
    'compliance_check_gdpr',
    'crm_query',
    'underwriting_risk_assess',
    'market_scan_policies',
    'market_price_deviation',
    'delegate',
    'approval_request',
    'messaging_send',
    'export_static_html',
    'request_here_now_publish',
  ],

  claim_filing: [
    'compliance_check_gdpr',
    'crm_query',
    'claims_analyze_coverage',
    'claims_analyze_denial',
    'claims_estimate_settlement',
    'claim_draft_parametric',
    'delegate',
    'approval_request',
    'messaging_send',
    'export_static_html',
    'request_here_now_publish',
  ],

  risk_prevention: [
    'compliance_check_gdpr',
    'crm_query',
    'weather_fetch_alerts',
    'delegate',
    'approval_request',
    'messaging_send',
  ],
};

export function getAnthropicToolsForIntent(intent: Intent): Anthropic.Tool[] {
  const names = INTENT_TOOLSETS[intent];
  return names.map((n) => ORCHESTRATOR_TOOLS[n]);
}
