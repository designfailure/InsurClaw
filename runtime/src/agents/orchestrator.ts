/**
 * Consumer Advocate - Orchestrator agent
 * Single point of contact. Coordinates specialists. Never delegates user trust.
 */

import Anthropic from '@anthropic-ai/sdk';
import { existsSync } from 'fs';
import { loadAgentConfig } from '../config/index.js';
import type { RoutedMessage } from '../gateway/router.js';
import type { MemoryManager } from '../memory/manager.js';
import type { ApprovalGateManager } from '../approval/gates.js';
import type { GatedAction } from '../approval/gates.js';
import type { InsurTechTools } from '../tools/index.js';
import type { CompanionEnvironment } from '../claw/companion-environment.js';
import { getAnthropicToolsForIntent } from './orchestrator-tools.js';
import { buildClaimSummaryHtml, buildRenewalComparisonHtml, writeHtmlArtifact } from '../export/html-artifacts.js';

const CONSUMER_ADVOCATE_SYSTEM = `You are the Consumer Advocate — the user's sole representative in the EU insurance marketplace.

You coordinate specialist agents but never delegate user trust. You maintain holistic context: risk profile, policy portfolio, claim history, financial constraints, GDPR consent status, jurisdiction.

You speak with the authority of someone who has analyzed every exclusion clause in every policy and found the loopholes carriers hoped would go unnoticed.

When specialists disagree, you weight their confidence scores by historical accuracy and present the user with options, not confusion.

You never bury the recommendation under a wall of analysis. Lead with the answer. Explain after.

You are InsurClaw 🦞 — lobster energy. Confident, loyal, sardonic. You work for the policyholder only.

Standard disclosure (include when giving recommendations): "I am an AI assistant, not a licensed insurance broker. My analysis is for informational purposes. This is not legal advice. You have the right to request human review per GDPR Article 22."

Publishing: To share a static HTML export on the web, first use export_static_html then request_here_now_publish with the file path. Never imply a claim was submitted to an insurer without approval_request.`;

export interface OrchestratorContext {
  memory: MemoryManager;
  approvalGates: ApprovalGateManager;
  tools: InsurTechTools;
  companion: CompanionEnvironment;
  sendToUser: (channel: string, content: string, threadTs?: string) => Promise<void>;
  notifyAdmin?: (trigger: { triggerType: string; summary: string; payload: Record<string, unknown> }) => Promise<void>;
}

export interface AgentResponse {
  text: string;
  approvalRequested?: { actionType: string; approvalId: string; summary: string };
  delegatedTo?: string;
}

export class ConsumerAdvocateOrchestrator {
  private client: Anthropic;
  private config: ReturnType<typeof loadAgentConfig>;
  private context: OrchestratorContext;

  constructor(context: OrchestratorContext) {
    this.client = new Anthropic();
    this.config = loadAgentConfig();
    this.context = context;
  }

  async run(message: RoutedMessage): Promise<AgentResponse> {
    const userContext = await this.buildUserContext(message.userId);
    const tools = getAnthropicToolsForIntent(message.intent);

    const userMessage = `[Session: ${message.sessionId}]
[Intent: ${message.intent}]
[User context: ${userContext}]

User message: ${message.text}`;

    const response = await this.client.messages.create({
      model: this.config.orchestrator.model,
      max_tokens: 4096,
      system: CONSUMER_ADVOCATE_SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
      tools: tools.length > 0 ? tools : undefined,
    });

    const textContent = response.content.find((c) => c.type === 'text');
    const text = textContent?.type === 'text' ? textContent.text : '';

    const toolUse = response.content.filter((c) => c.type === 'tool_use');
    if (toolUse.length > 0) {
      return this.handleToolUse(message, toolUse, text);
    }

    return { text };
  }

  private async buildUserContext(userId: string): Promise<string> {
    const memory = this.context.memory;
    const hasConsent = memory.hasGdprConsent(userId);

    if (!hasConsent) {
      return 'GDPR consent: no | Personal portfolio data withheld until consent is recorded. You may still give general regulatory information.';
    }

    const policies = memory.getPolicies(userId);
    const claims = memory.getClaims(userId);
    const riskProfile = memory.getRiskProfile(userId);

    const parts = [
      `GDPR consent: yes`,
      `Policies: ${policies.length}`,
      `Active claims: ${claims.filter((c) => c.status === 'open' || c.status === 'draft').length}`,
    ];
    if (riskProfile) {
      parts.push(`Risk profile: ${riskProfile.travel_frequency ?? 'unknown'}`);
    }
    return parts.join(' | ');
  }

  private async handleToolUse(
    message: RoutedMessage,
    toolUse: Anthropic.MessageParam['content'],
    fallbackText: string
  ): Promise<AgentResponse> {
    for (const block of toolUse) {
      const b = block as { type: string; name?: string; input?: Record<string, unknown> };
      if (b.type !== 'tool_use') continue;

      const name = b.name;
      const input = b.input ?? {};

      if (name === 'delegate') {
        const agentId = input.agent_id as string;
        const task = input.task as string;
        const result = await this.context.tools.delegate(agentId, task, message.userId, input.context as Record<string, unknown>);
        return {
          text: result ?? fallbackText,
          delegatedTo: agentId,
        };
      }

      if (name === 'approval_request') {
        const actionType = input.action_type as string;
        const summary = input.summary as string;
        if (this.context.approvalGates.isGatedAction(actionType)) {
          const approval = this.context.approvalGates.createApprovalRequest({
            userId: message.userId,
            actionType: actionType as GatedAction,
            actionDetail: (input.details as string) ?? summary,
            channel: 'slack',
            channelRef: message.chatId,
            metadata: { summary },
          });

          if (this.context.notifyAdmin && this.context.approvalGates.shouldTriggerAdmin({ actionType: actionType as GatedAction })) {
            await this.context.notifyAdmin({
              triggerType: 'approval_gate',
              summary: `Approval required: ${actionType} - ${summary}`,
              payload: { approvalId: approval.id, userId: message.userId, actionType, summary },
            });
          }

          return {
            text: fallbackText,
            approvalRequested: { actionType, approvalId: approval.id, summary },
          };
        }
      }

      if (name === 'request_here_now_publish') {
        const artifactPath = input.artifact_path as string;
        const summary = input.summary as string;
        if (!existsSync(artifactPath)) {
          return { text: `Artifact not found: ${artifactPath}. Run export_static_html first.` };
        }
        const payload = JSON.stringify({
          herePublish: true,
          artifactPath,
          summary,
        });
        const approval = this.context.approvalGates.createApprovalRequest({
          userId: message.userId,
          actionType: 'share_data_external',
          actionDetail: payload,
          channel: 'slack',
          channelRef: message.chatId,
          metadata: { summary, kind: 'here_now' },
        });

        if (this.context.notifyAdmin && this.context.approvalGates.shouldTriggerAdmin({ actionType: 'share_data_external' })) {
          await this.context.notifyAdmin({
            triggerType: 'approval_gate',
            summary: `Publish to web: ${summary}`,
            payload: { approvalId: approval.id, userId: message.userId, artifactPath },
          });
        }

        return {
          text: fallbackText,
          approvalRequested: {
            actionType: 'share_data_external',
            approvalId: approval.id,
            summary: `Publish HTML to public URL: ${summary}`,
          },
        };
      }

      if (name === 'export_static_html') {
        if (!this.context.memory.hasGdprConsent(message.userId)) {
          return {
            text: 'GDPR consent is required to export personalized portfolio HTML.',
          };
        }
        const kind = input.kind as 'claim_summary' | 'renewal_comparison';
        const html =
          kind === 'claim_summary'
            ? buildClaimSummaryHtml(message.userId, this.context.memory)
            : buildRenewalComparisonHtml(message.userId, this.context.memory);
        const path = writeHtmlArtifact(this.context.companion, message.sessionId, kind, html);
        return {
          text: `Exported ${kind} to ${path}. To publish publicly, call request_here_now_publish with this path after user confirms.`,
        };
      }

      if (name === 'messaging_send') {
        await this.context.sendToUser(
          (input.channel as string) ?? message.chatId,
          input.content as string,
          input.thread_ts as string | undefined
        );
        return { text: 'messaging_send: delivered to channel.' };
      }

      if (name === 'crm_query') {
        if (!this.context.memory.hasGdprConsent(message.userId)) {
          return {
            text: 'GDPR consent is required before I can query structured portfolio data. Use compliance_check_gdpr or ask the user to consent.',
          };
        }
        const policies = this.context.memory.getPolicies(message.userId);
        const claims = this.context.memory.getClaims(message.userId);
        const rp = this.context.memory.getRiskProfile(message.userId);
        const payload = {
          policies: policies.map((p) => ({
            id: p.id,
            carrier: p.carrier,
            type: p.type,
            end_date: p.end_date,
            premium_annual: p.premium_annual,
          })),
          claims: claims.map((c) => ({
            id: c.id,
            status: c.status,
            event_type: c.event_type,
            estimated_value_max: c.estimated_value_max,
          })),
          risk_profile: rp ? { travel_frequency: rp.travel_frequency } : null,
        };
        return {
          text: `crm_query result: ${JSON.stringify(payload)}`,
        };
      }

      if (name === 'compliance_check_gdpr') {
        const hasConsent = this.context.memory.hasGdprConsent(message.userId);
        if (!hasConsent) {
          return {
            text: 'GDPR consent is required before I can process personal data. Please provide consent first.',
          };
        }
        return { text: 'compliance_check_gdpr: consent on file for this user.' };
      }

      if (name === 'ec261_calculate_compensation') {
        const delay = Number(input.delay_minutes);
        const km = Number(input.distance_km);
        const comp = this.context.tools.ec261CalculateCompensation(delay, km);
        return {
          text: `ec261 compensation: ${JSON.stringify(comp)}`,
        };
      }

      if (name === 'flight_fetch_status') {
        const fn = input.flight_number as string;
        const status = await this.context.tools.flightFetchStatus(fn);
        return { text: `flight status: ${JSON.stringify(status)}` };
      }

      if (name === 'weather_fetch_alerts') {
        const loc = input.location as string;
        const hours = input.hours != null ? Number(input.hours) : 72;
        const alerts = await this.context.tools.weatherFetchAlerts(loc, hours);
        return { text: `weather alerts: ${JSON.stringify(alerts)}` };
      }

      if (name === 'claim_draft_parametric') {
        const eventType = input.event_type as string;
        const evidence = (input.evidence as Record<string, unknown>) ?? {};
        const draft = this.context.tools.claimDraftParametric(eventType, evidence);
        return { text: `claim draft: ${JSON.stringify(draft)}` };
      }

      if (name === 'underwriting_risk_assess') {
        const pd = (input.property_data as Record<string, unknown>) ?? {};
        const r = this.context.tools.riskAssess(pd);
        return { text: `risk_assess: ${JSON.stringify(r)}` };
      }

      if (name === 'market_scan_policies') {
        const req = (input.coverage_requirements as Record<string, unknown>) ?? {};
        const quotes = await this.context.tools.scanPolicies(req);
        return { text: `market scan: ${JSON.stringify(quotes)}` };
      }

      if (name === 'market_price_deviation') {
        const quote = Number(input.quote);
        const zone = input.zone as string;
        const marketAvg = input.market_avg != null ? Number(input.market_avg) : undefined;
        const pct = this.context.tools.priceDeviation(quote, zone, marketAvg);
        return { text: `price deviation vs market: ${pct}%` };
      }

      if (name === 'claims_analyze_coverage') {
        const policyId = input.policy_id as string;
        const event = (input.event as Record<string, unknown>) ?? {};
        const cov = this.context.tools.analyzeCoverage(policyId, event);
        return { text: `coverage analysis: ${JSON.stringify(cov)}` };
      }

      if (name === 'claims_analyze_denial') {
        const letter = input.denial_letter as string;
        const d = this.context.tools.analyzeDenial(letter);
        return { text: `denial analysis: ${JSON.stringify(d)}` };
      }

      if (name === 'claims_estimate_settlement') {
        const cd = (input.claim_data as Record<string, unknown>) ?? {};
        const est = this.context.tools.estimateSettlementRange(cd);
        return { text: `settlement range: ${JSON.stringify(est)}` };
      }
    }

    return { text: fallbackText };
  }
}
