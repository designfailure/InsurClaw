import { describe, it, expect, beforeAll } from 'vitest';
import { validateAgentOutput, formatValidationWarnings } from './validation.js';
import { MemoryManager } from '../memory/manager.js';
import { getDatabase } from '../memory/database.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { RoutedMessage } from '../gateway/router.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('validateAgentOutput', () => {
  beforeAll(() => {
    const schema = readFileSync(join(__dirname, '../../database/schema.sql'), 'utf-8');
    getDatabase().exec(schema);
  });

  it('flags missing GDPR for portfolio intents', () => {
    const memory = new MemoryManager();
    const u = memory.getOrCreateUser('U_SLACK_VAL1');
    const routed: RoutedMessage = {
      platform: 'slack',
      chatId: 'C1',
      channelRef: 'C1',
      text: 'help',
      userId: u.id,
      isGroup: false,
      sessionId: 'sess1',
      intent: 'claim_filing',
    };
    const v = validateAgentOutput(routed, { text: 'ok' }, memory);
    expect(v.passed).toBe(false);
    expect(v.checks.find((c) => c.id === 'gdpr_portfolio_intent')?.passed).toBe(false);
  });

  it('passes GDPR when consent recorded', () => {
    const memory = new MemoryManager();
    const u = memory.getOrCreateUser('U_SLACK_VAL2');
    memory.setGdprConsent(u.id);
    const routed: RoutedMessage = {
      platform: 'slack',
      chatId: 'C1',
      channelRef: 'C1',
      text: 'help',
      userId: u.id,
      isGroup: false,
      sessionId: 'sess1',
      intent: 'claim_filing',
    };
    const v = validateAgentOutput(routed, { text: 'ok' }, memory);
    expect(v.checks.find((c) => c.id === 'gdpr_portfolio_intent')?.passed).toBe(true);
  });

  it('flags tier-3 submission language without approval', () => {
    const memory = new MemoryManager();
    const u = memory.getOrCreateUser('U_SLACK_VAL3');
    memory.setGdprConsent(u.id);
    const routed: RoutedMessage = {
      platform: 'slack',
      chatId: 'C1',
      channelRef: 'C1',
      text: 'x',
      userId: u.id,
      isGroup: false,
      sessionId: 'sess1',
      intent: 'claim_filing',
    };
    const v = validateAgentOutput(
      routed,
      { text: 'I have filed the claim with the insurer on your behalf.' },
      memory
    );
    expect(v.passed).toBe(false);
    expect(v.checks.find((c) => c.id === 'tier3_submission_language')?.passed).toBe(false);
  });

  it('formatValidationWarnings prepends checklist', () => {
    const w = formatValidationWarnings([
      { id: 'a', passed: false, detail: 'x' },
      { id: 'b', passed: true },
    ]);
    expect(w).toContain('[Validation]');
    expect(w).toContain('a');
  });
});
