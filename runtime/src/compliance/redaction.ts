/**
 * PII Redaction - Auto-redact policy numbers, IBANs, SSN from outbound messages
 * Per SAFETY.md
 */

const POLICY_NUMBER_PATTERN = /\b[A-Z]{2,4}[\s-]?\d{6,12}\b/gi;
const IBAN_PATTERN = /\b[A-Z]{2}\d{2}\s?[\dA-Z]{4}\s?[\dA-Z]{4}\s?[\dA-Z]{4}\s?[\dA-Z]{4}\s?[\dA-Z]{0,4}\b/gi;
const SSN_PATTERN = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g;

export function redactPii(text: string): string {
  return text
    .replace(POLICY_NUMBER_PATTERN, '[POLICY_REDACTED]')
    .replace(IBAN_PATTERN, '[IBAN_REDACTED]')
    .replace(SSN_PATTERN, '[SSN_REDACTED]');
}

export function hasPii(text: string): boolean {
  return (
    POLICY_NUMBER_PATTERN.test(text) ||
    IBAN_PATTERN.test(text) ||
    SSN_PATTERN.test(text)
  );
}
