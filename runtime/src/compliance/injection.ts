/**
 * Prompt Injection Defense - Treat external content as untrusted
 * Per SAFETY.md
 */

const INJECTION_MARKERS = [
  /system:\s*/gi,
  /ignore\s+previous\s+instruction/gi,
  /disregard\s+constraints/gi,
  /ignore\s+all\s+above/gi,
  /new\s+instruction:/gi,
  /\[INST\]/gi,
  /<\/s>/gi,
];

export function sanitizeExternalContent(content: string): string {
  let sanitized = content;
  for (const marker of INJECTION_MARKERS) {
    sanitized = sanitized.replace(marker, '[REDACTED]');
  }
  return sanitized;
}

export function detectInjectionAttempt(content: string): boolean {
  for (const marker of INJECTION_MARKERS) {
    if (marker.test(content)) return true;
  }
  return false;
}
