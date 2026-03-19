import { describe, it, expect } from 'vitest';
import { getAnthropicToolsForIntent } from './orchestrator-tools.js';

describe('getAnthropicToolsForIntent', () => {
  it('general has core tools only', () => {
    const names = getAnthropicToolsForIntent('general').map((t) => t.name);
    expect(names).toEqual([
      'compliance_check_gdpr',
      'crm_query',
      'messaging_send',
      'approval_request',
      'delegate',
    ]);
  });

  it('flight_delay includes EC261 and flight tools', () => {
    const names = getAnthropicToolsForIntent('flight_delay').map((t) => t.name);
    expect(names).toContain('ec261_calculate_compensation');
    expect(names).toContain('flight_fetch_status');
    expect(names).not.toContain('export_static_html');
  });

  it('claim_filing includes export + here.now publish', () => {
    const names = getAnthropicToolsForIntent('claim_filing').map((t) => t.name);
    expect(names).toContain('export_static_html');
    expect(names).toContain('request_here_now_publish');
  });
});
