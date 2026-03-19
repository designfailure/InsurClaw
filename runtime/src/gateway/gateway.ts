/**
 * InsurClaw Gateway - Wires Slack, WhatsApp admin, router, orchestrator
 */

import { redactPii } from '../compliance/redaction.js';
import { SlackAdapter } from './slack-adapter.js';
import { WhatsAppAdminNotifier } from './whatsapp-admin.js';
import { GatewayRouter } from './router.js';
import { MemoryManager } from '../memory/manager.js';
import { ApprovalGateManager } from '../approval/gates.js';
import { ConsumerAdvocateOrchestrator } from '../agents/orchestrator.js';
import { createInsurTechTools } from '../tools/index.js';
import { loadAgentConfig, env } from '../config/index.js';

export interface GatewayConfig {
  slackPort?: number;
}

export class InsurClawGateway {
  private slack: SlackAdapter;
  private whatsappAdmin: WhatsAppAdminNotifier | null = null;
  private router: GatewayRouter;
  private memory: MemoryManager;
  private approvalGates: ApprovalGateManager;
  private orchestrator: ConsumerAdvocateOrchestrator;
  private config = loadAgentConfig();

  constructor(config?: GatewayConfig) {
    this.memory = new MemoryManager();
    this.approvalGates = new ApprovalGateManager(this.config);

    const tools = createInsurTechTools();

    this.orchestrator = new ConsumerAdvocateOrchestrator({
      memory: this.memory,
      approvalGates: this.approvalGates,
      tools,
      sendToUser: async (channel, content, threadTs) => {
        await this.slack.sendMessage(channel, threadTs ? { text: content, threadTs } : content);
      },
      notifyAdmin: this.config.admin?.whatsapp_ids?.length
        ? async (trigger) => {
            if (this.whatsappAdmin) {
              await this.whatsappAdmin.notifyAdmins({
                triggerType: trigger.triggerType,
                summary: trigger.summary,
                payload: trigger.payload,
                urgency: 'medium',
              });
            }
          }
        : undefined,
    });

    this.router = new GatewayRouter(this.memory);

    this.slack = new SlackAdapter({
      botToken: env.slackBotToken,
      signingSecret: env.slackSigningSecret,
      appToken: env.slackAppToken || undefined,
    });

    if (this.config.admin?.whatsapp_ids?.length) {
      this.whatsappAdmin = new WhatsAppAdminNotifier({
        allowedRecipients: this.config.admin.whatsapp_ids,
      });
    }

    this.setupSlackHandlers();
  }

  private setupSlackHandlers(): void {
    this.slack.onMessage(async (msg) => {
      try {
        const routed = await this.router.route(msg);
        const response = await this.orchestrator.run(routed);

        if (response.approvalRequested) {
          await this.slack.sendWithApprovalButtons(
            msg.chatId,
            `${response.text}\n\n**Action requires approval:** ${response.approvalRequested.summary}`,
            response.approvalRequested.approvalId,
            msg.threadTs
          );
        } else {
          await this.slack.sendMessage(msg.chatId, msg.threadTs ? { text: response.text, threadTs: msg.threadTs } : response.text);
        }

        this.memory.logAudit({
          userId: routed.userId,
          agentId: 'consumer_advocate',
          actionType: 'outbound_response',
          actionDetail: `Intent: ${routed.intent}`,
        });
      } catch (err) {
        console.error('[Gateway] Error:', err);
        await this.slack.sendMessage(msg.chatId, redactPii('Sorry, something went wrong. Please try again.'));
      }
    });

    this.slack.onApprovalAction(async (action, approvalId, approved) => {
      const pending = this.approvalGates.getPendingApproval(approvalId);
      if (pending) {
        this.approvalGates.resolveApproval(approvalId, approved, 'user');
        this.memory.logAudit({
          userId: pending.userId,
          actionType: 'approval_resolved',
          actionDetail: `${pending.actionType}: ${approved ? 'approved' : 'rejected'}`,
          approvedBy: 'user',
        });
        // Notify user of resolution
        const channelRef = pending.channelRef;
        if (channelRef) {
          await this.slack.sendMessage(channelRef, approved ? 'Approved. Proceeding.' : 'Rejected. No action taken.');
        }
      }
    });
  }

  async start(config?: GatewayConfig): Promise<void> {
    const port = config?.slackPort ?? 3000;

    if (this.whatsappAdmin) {
      await this.whatsappAdmin.start();
    }

    await this.slack.start(port);
    console.log('[InsurClaw] Gateway started. Slack on port', port);
  }

  async stop(): Promise<void> {
    await this.slack.stop();
    if (this.whatsappAdmin) {
      await this.whatsappAdmin.stop();
    }
    console.log('[InsurClaw] Gateway stopped');
  }
}
