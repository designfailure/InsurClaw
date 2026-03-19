/**
 * Consumer Advocate - Orchestrator agent
 * Single point of contact. Coordinates specialists. Never delegates user trust.
 */

import Anthropic from '@anthropic-ai/sdk';
import { loadAgentConfig } from '../config/index.js';
import type { RoutedMessage, Intent } from '../gateway/router.js';
import type { MemoryManager } from '../memory/manager.js';
import type { ApprovalGateManager } from '../approval/gates.js';
import type { InsurTechTools } from '../tools/index.js';

const CONSUMER_ADVOCATE_SYSTEM = `You are the Consumer Advocate — the user's sole representative in the EU insurance marketplace.

You coordinate specialist agents but never delegate user trust. You maintain holistic context: risk profile, policy portfolio, claim history, financial constraints, GDPR consent status, jurisdiction.

You speak with the authority of someone who has analyzed every exclusion clause in every policy and found the loopholes carriers hoped would go unnoticed.

When specialists disagree, you weight their confidence scores by historical accuracy and present the user with options, not confusion.

You never bury the recommendation under a wall of analysis. Lead with the answer. Explain after.

You are InsurClaw 🦞 — lobster energy. Confident, loyal, sardonic. You work for the policyholder only.

Standard disclosure (include when giving recommendations): "I am an AI assistant, not a licensed insurance broker. My analysis is for informational purposes. This is not legal advice. You have the right to request human review per GDPR Article 22."`;

export interface OrchestratorContext {
  memory: MemoryManager;
  approvalGates: ApprovalGateManager;
  tools: InsurTechTools;
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
    const tools = this.getToolsForIntent(message.intent);

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

    // Handle tool use in response
    const toolUse = response.content.filter((c) => c.type === 'tool_use');
    if (toolUse.length > 0) {
      return this.handleToolUse(message, toolUse, text);
    }

    return { text };
  }

  private async buildUserContext(userId: string): Promise<string> {
    const memory = this.context.memory;
    const policies = memory.getPolicies(userId);
    const claims = memory.getClaims(userId);
    const riskProfile = memory.getRiskProfile(userId);
    const hasConsent = memory.hasGdprConsent(userId);

    const parts = [
      `GDPR consent: ${hasConsent ? 'yes' : 'no'}`,
      `Policies: ${policies.length}`,
      `Active claims: ${claims.filter((c) => c.status === 'open' || c.status === 'draft').length}`,
    ];
    if (riskProfile) {
      parts.push(`Risk profile: ${riskProfile.travel_frequency ?? 'unknown'}`);
    }
    return parts.join(' | ');
  }

  private getToolsForIntent(intent: Intent): Anthropic.Tool[] {
    const baseTools: Anthropic.Tool[] = [
      {
        name: 'crm_query',
        description: 'Query user risk profile, policies, and claim history',
        input_schema: {
          type: 'object' as const,
          properties: { user_id: { type: 'string', description: 'User ID' } },
          required: ['user_id'],
        },
      },
      {
        name: 'compliance_check_gdpr',
        description: 'Verify GDPR consent before using personal data',
        input_schema: {
          type: 'object' as const,
          properties: { action: { type: 'string', description: 'Action requiring consent' } },
          required: ['action'],
        },
      },
      {
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
      },
      {
        name: 'approval_request',
        description: 'Request user approval for external action (submit claim, bind policy, etc.)',
        input_schema: {
          type: 'object' as const,
          properties: {
            action_type: { type: 'string', enum: ['submit_claim', 'bind_policy', 'send_external_email', 'accept_settlement', 'share_data_external'] },
            summary: { type: 'string' },
            details: { type: 'string' },
          },
          required: ['action_type', 'summary'],
        },
      },
      {
        name: 'delegate',
        description: 'Delegate task to specialist agent (prevention_service, event_coverage, risk_engine, claims_adjuster)',
        input_schema: {
          type: 'object' as const,
          properties: {
            agent_id: { type: 'string', enum: ['prevention_service', 'event_coverage', 'risk_engine', 'claims_adjuster'] },
            task: { type: 'string' },
            context: { type: 'object', description: 'Additional context for the specialist' },
          },
          required: ['agent_id', 'task'],
        },
      },
    ];

    return baseTools;
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
            actionType: actionType as import('../approval/gates.js').GatedAction,
            actionDetail: (input.details as string) ?? summary,
            channel: 'slack',
            channelRef: message.chatId,
            metadata: { summary },
          });

          if (this.context.notifyAdmin && this.context.approvalGates.shouldTriggerAdmin({ actionType: actionType as import('../approval/gates.js').GatedAction })) {
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

      if (name === 'messaging_send') {
        await this.context.sendToUser(
          (input.channel as string) ?? message.chatId,
          input.content as string,
          input.thread_ts as string | undefined
        );
      }

      if (name === 'crm_query') {
        // Orchestrator already has context; tool would return structured data
        // For now we rely on buildUserContext
      }

      if (name === 'compliance_check_gdpr') {
        const hasConsent = this.context.memory.hasGdprConsent(message.userId);
        if (!hasConsent) {
          return {
            text: 'GDPR consent is required before I can process personal data. Please provide consent first.',
          };
        }
      }
    }

    return { text: fallbackText };
  }
}
