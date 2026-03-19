import { describe, it, expect } from 'vitest';
import { redactPii, hasPii } from './redaction.js';

describe('PII redaction', () => {
  it('redacts policy numbers', () => {
    const text = 'Your policy number is ABC 12345678.';
    expect(redactPii(text)).toContain('[POLICY_REDACTED]');
    expect(redactPii(text)).not.toContain('12345678');
  });

  it('redacts IBANs', () => {
    const text = 'Send to DE89 3704 0044 0532 0130 00';
    expect(redactPii(text)).toContain('[IBAN_REDACTED]');
  });

  it('redacts SSN-like patterns', () => {
    const text = 'SSN: 123-45-6789';
    expect(redactPii(text)).toContain('[SSN_REDACTED]');
  });

  it('hasPii returns true when PII present', () => {
    expect(hasPii('Policy ABC123456')).toBe(true);
    expect(hasPii('DE89370400440532013000')).toBe(true);
  });

  it('hasPii returns false when no PII', () => {
    expect(hasPii('Hello, how can I help?')).toBe(false);
  });
});
