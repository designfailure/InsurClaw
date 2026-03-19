/**
 * Slack Adapter - Primary user channel for InsurClaw
 * Handles: message, app_mention, direct_message
 * Supports quick actions (Approve/Reject/Modify) via Slack blocks
 */

import pkg from '@slack/bolt';
import type { App } from '@slack/bolt';
const { App: SlackApp } = pkg;
import type { IncomingMessage, OutgoingMessage } from './types.js';

export interface SlackAdapterConfig {
  botToken: string;
  signingSecret: string;
  appToken?: string;
  allowedChannels?: string[];
  allowedDMs?: string[];
}

export interface SlackMessage {
  chatId: string;
  channelId: string;
  text: string;
  userId: string;
  userName?: string;
  isGroup: boolean;
  threadTs?: string;
  raw: Record<string, unknown>;
}

export class SlackAdapter {
  private app: App;
  private config: SlackAdapterConfig;
  private messageCallback: ((msg: IncomingMessage) => void) | null = null;
  private actionCallback: ((action: unknown, approvalId: string, approved: boolean) => void) | null = null;

  constructor(config: SlackAdapterConfig) {
    this.config = config;
    this.app = new SlackApp({
      token: config.botToken,
      signingSecret: config.signingSecret,
      ...(config.appToken && {
        socketMode: true,
        appToken: config.appToken,
      }),
    });
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Handle incoming messages
    this.app.message(async ({ message, say, client }) => {
      const msg = message as { subtype?: string; text?: string; channel?: string; user?: string; thread_ts?: string };
      if (msg.subtype === 'bot_message') return;
      const text = 'text' in msg ? String(msg.text ?? '') : '';
      if (!text.trim()) return;

      const channelId = msg.channel ?? '';
      const userId = msg.user ?? 'unknown';
      const isGroup = channelId.startsWith('C') || channelId.startsWith('G');

      if (!this.shouldRespond(channelId, userId, isGroup)) return;

      const slackMsg: SlackMessage = {
        chatId: channelId,
        channelId,
        text,
        userId,
        isGroup,
        threadTs: msg.thread_ts ? String(msg.thread_ts) : undefined,
        raw: msg as unknown as Record<string, unknown>,
      };

      try {
        const userInfo = await client.users.info({ user: userId });
        if (userInfo.user?.real_name) {
          slackMsg.userName = userInfo.user.real_name;
        }
      } catch {
        // Ignore user info fetch errors
      }

      this.emitMessage({
        platform: 'slack',
        chatId: channelId,
        channelRef: channelId,
        text,
        userId,
        userName: slackMsg.userName,
        isGroup,
        threadTs: slackMsg.threadTs,
        raw: slackMsg,
      });
    });

    // Handle app mentions
    this.app.event('app_mention', async ({ event, say, client }) => {
      const ev = event as { text?: string; channel?: string; user?: string; thread_ts?: string };
      const text = ev.text ?? '';
      const channelId = ev.channel ?? '';
      const userId = ev.user ?? 'unknown';
      const isGroup = true;

      const slackMsg: SlackMessage = {
        chatId: channelId,
        channelId,
        text,
        userId,
        isGroup,
        threadTs: event.thread_ts,
        raw: ev as unknown as Record<string, unknown>,
      };

      try {
        const userInfo = await client.users.info({ user: userId });
        if (userInfo.user?.real_name) {
          slackMsg.userName = userInfo.user.real_name;
        }
      } catch {
        // Ignore
      }

      this.emitMessage({
        platform: 'slack',
        chatId: channelId,
        channelRef: channelId,
        text,
        userId,
        userName: slackMsg.userName,
        isGroup,
        threadTs: slackMsg.threadTs,
        raw: slackMsg,
      });
    });

    // Handle block actions (Approve/Reject/Modify buttons)
    this.app.action(/approval_(.+)_(approve|reject)/, async ({ action, ack }) => {
      await ack();
      const act = action as { action_id?: string };
      const match = act.action_id?.match(/approval_(.+)_(approve|reject)/);
      if (match && this.actionCallback) {
        const [, approvalId, result] = match;
        this.actionCallback(action, approvalId, result === 'approve');
      }
    });
  }

  private shouldRespond(channelId: string, userId: string, isGroup: boolean): boolean {
    if (isGroup) {
      const allowed = this.config.allowedChannels ?? ['*'];
      if (!allowed.includes('*') && !allowed.includes(channelId)) return false;
    } else {
      const allowed = this.config.allowedDMs ?? ['*'];
      if (!allowed.includes('*') && !allowed.includes(channelId) && !allowed.includes(userId)) return false;
    }
    return true;
  }

  onMessage(callback: (msg: IncomingMessage) => void): void {
    this.messageCallback = callback;
  }

  onApprovalAction(callback: (action: unknown, approvalId: string, approved: boolean) => void): void {
    this.actionCallback = callback;
  }

  private emitMessage(msg: IncomingMessage): void {
    if (this.messageCallback) {
      this.messageCallback(msg);
    }
  }

  async start(port?: number): Promise<void> {
    const portToUse = port ?? 3000;
    await this.app.start(portToUse);
    console.log(`[Slack] Adapter started on port ${portToUse}`);
  }

  async stop(): Promise<void> {
    await this.app.stop();
    console.log('[Slack] Adapter stopped');
  }

  async sendMessage(chatId: string, content: string | OutgoingMessage): Promise<void> {
    const text = typeof content === 'string' ? content : content.text;
    const blocks = typeof content === 'object' && content.blocks ? content.blocks : undefined;
    const threadTs = typeof content === 'object' && content.threadTs ? content.threadTs : undefined;

    try {
      const payload: Record<string, unknown> = {
        channel: chatId,
        text,
      };
      if (blocks) payload.blocks = blocks;
      if (threadTs) payload.thread_ts = threadTs;
      await this.app.client.chat.postMessage(payload as Parameters<typeof this.app.client.chat.postMessage>[0]);
    } catch (err) {
      console.error('[Slack] Send error:', err);
      throw err;
    }
  }

  // Send message with approval buttons
  async sendWithApprovalButtons(
    chatId: string,
    text: string,
    approvalId: string,
    threadTs?: string
  ): Promise<void> {
    const blocks = [
      {
        type: 'section' as const,
        text: { type: 'mrkdwn' as const, text },
      },
      {
        type: 'actions' as const,
        elements: [
          {
            type: 'button' as const,
            text: { type: 'plain_text' as const, text: 'Approve', emoji: true },
            style: 'primary' as const,
            action_id: `approval_${approvalId}_approve`,
          },
          {
            type: 'button' as const,
            text: { type: 'plain_text' as const, text: 'Reject', emoji: true },
            action_id: `approval_${approvalId}_reject`,
          },
        ],
      },
    ];

    await this.app.client.chat.postMessage({
      channel: chatId,
      text,
      blocks,
      ...(threadTs && { thread_ts: threadTs }),
    });
  }

  getApp(): App {
    return this.app;
  }
}
