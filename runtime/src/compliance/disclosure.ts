/**
 * IDD / EU Compliance - Standard disclosures
 * Per EU_COMPLIANCE.md
 */

export const STANDARD_DISCLOSURE = `I am an AI assistant, not a licensed insurance broker. My analysis is for informational purposes. This is not legal advice. You have the right to request human review of this recommendation per GDPR Article 22.`;

export const CLAIM_DISPUTE_DISCLOSURE = `I can help you prepare your appeal, but consider consulting a licensed attorney for complex disputes. Time limits may apply — check your policy for notification deadlines.`;

export function injectDisclosure(text: string, forClaimDispute = false): string {
  const disclosure = forClaimDispute ? CLAIM_DISPUTE_DISCLOSURE : STANDARD_DISCLOSURE;
  if (text.includes(disclosure.slice(0, 30))) return text;
  return `${text}\n\n_${disclosure}_`;
}
