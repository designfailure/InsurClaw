/**
 * Gateway Router - Routes inbound messages to Consumer Advocate
 * Audit logs all inbound/outbound
 */

import type { IncomingMessage } from './types.js';
import { MemoryManager } from '../memory/manager.js';
import { detectInjectionAttempt, sanitizeExternalContent } from '../compliance/injection.js';

export type Intent =
  | 'flight_delay'
  | 'policy_comparison'
  | 'claim_filing'
  | 'risk_prevention'
  | 'general';

export interface RoutedMessage extends IncomingMessage {
  sessionId: string;
  userId: string;
  intent: Intent;
}

export class GatewayRouter {
  private memory: MemoryManager;

  constructor(memory: MemoryManager) {
    this.memory = memory;
  }

  async route(incoming: IncomingMessage): Promise<RoutedMessage> {
    const user = this.memory.getOrCreateUser(incoming.userId);
    const text = detectInjectionAttempt(incoming.text)
      ? sanitizeExternalContent(incoming.text)
      : incoming.text;
    const sessionId = `slack:${incoming.chatId}:${incoming.userId}`;
    const intent = this.classifyIntent(text);

    this.memory.logAudit({
      userId: user.id,
      actionType: 'inbound_message',
      actionDetail: JSON.stringify({
        platform: incoming.platform,
        chatId: incoming.chatId,
        intent,
        textLength: text.length,
      }),
    });

    return {
      ...incoming,
      text,
      sessionId,
      userId: user.id,
      intent,
    };
  }

  private classifyIntent(text: string): Intent {
    const lower = text.toLowerCase().trim();

    if (
      /flight|delay|ec261|ec 261|compensation|claim.*flight|delayed flight/i.test(lower)
    ) {
      return 'flight_delay';
    }
    if (
      /renewal|policy.*compar|compare.*policy|market.*quote|switch.*insurance/i.test(lower)
    ) {
      return 'policy_comparison';
    }
    if (
      /claim|fnol|settlement|denial|appeal|dispute|lowball|file.*claim/i.test(lower)
    ) {
      return 'claim_filing';
    }
    if (
      /weather|storm|flood|prevent|maintenance|alert|risk.*prevent/i.test(lower)
    ) {
      return 'risk_prevention';
    }

    return 'general';
  }
}
