import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ApprovalGateManager, GATED_ACTIONS } from './gates.js';
import { loadAgentConfig } from '../config/index.js';
import { getDatabase } from '../memory/database.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Approval gates', () => {
  let manager: ApprovalGateManager;

  beforeAll(() => {
    const schema = readFileSync(join(__dirname, '../../database/schema.sql'), 'utf-8');
    const db = getDatabase();
    db.exec(schema);
    db.prepare("INSERT OR IGNORE INTO users (id, slack_user_id) VALUES ('user-1', 'U123')").run();
  });

  beforeEach(() => {
    manager = new ApprovalGateManager(loadAgentConfig());
  });

  it('identifies gated actions', () => {
    expect(manager.isGatedAction('submit_claim')).toBe(true);
    expect(manager.isGatedAction('bind_policy')).toBe(true);
    expect(manager.isGatedAction('random_action')).toBe(false);
  });

  it('GATED_ACTIONS includes all required', () => {
    expect(GATED_ACTIONS).toContain('submit_claim');
    expect(GATED_ACTIONS).toContain('accept_settlement');
  });

  it('createApprovalRequest returns pending approval', () => {
    const approval = manager.createApprovalRequest({
      userId: 'user-1',
      actionType: 'submit_claim',
      actionDetail: 'Submit flight delay claim',
      channel: 'slack',
      channelRef: 'C123',
    });
    expect(approval.status).toBe('pending');
    expect(approval.actionType).toBe('submit_claim');
    expect(approval.id).toBeDefined();
  });
});
