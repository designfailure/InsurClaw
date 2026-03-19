import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { CompanionEnvironment, sanitizeSessionId } from './companion-environment.js';
import { ClawRegistry } from './registry.js';
import { recommendedToolsForIntent } from './intent-tools.js';
import { tierForIntent } from './safety.js';

describe('sanitizeSessionId', () => {
  it('normalizes unsafe characters', () => {
    expect(sanitizeSessionId('slack:a:b:c')).toBe('slack_a_b_c');
  });
});

describe('CompanionEnvironment', () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'ic-claw-'));
  });

  it('creates session workspace layout', () => {
    const c = new CompanionEnvironment({ repoRoot: dir });
    const base = c.ensureSessionWorkspace('test_sess');
    expect(existsSync(join(base, 'compliance_state'))).toBe(true);
    expect(existsSync(join(base, 'active_policies'))).toBe(true);
    rmSync(dir, { recursive: true, force: true });
  });
});

describe('ClawRegistry', () => {
  it('appends JSONL lines', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ic-reg-'));
    const r = new ClawRegistry(dir);
    r.appendMainLog({
      timestamp: new Date().toISOString(),
      event_type: 'user_action',
      action: 'test',
      result: 'success',
    });
    const text = readFileSync(join(dir, 'main_log.jsonl'), 'utf-8');
    expect(text.trim().length).toBeGreaterThan(0);
    rmSync(dir, { recursive: true, force: true });
  });
});

describe('intent + safety', () => {
  it('maps flight_delay tools', () => {
    const t = recommendedToolsForIntent('flight_delay');
    expect(t).toContain('ec261.calculate_compensation');
  });

  it('tiers claim_filing as high', () => {
    expect(tierForIntent('claim_filing')).toBe(3);
  });
});
