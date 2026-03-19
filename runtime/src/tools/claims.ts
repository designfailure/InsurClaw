/**
 * Claims tools - Coverage analysis, denial parsing, settlement estimation
 */

export interface CoverageAssessment {
  applicable: boolean;
  confidence: 'likely' | 'possible' | 'unlikely';
  policyId?: string;
  clause?: string;
  exclusions?: string[];
}

export interface SettlementRange {
  min: number;
  max: number;
  confidence: string;
}

export function analyzeCoverage(
  policyId: string,
  event: Record<string, unknown>
): CoverageAssessment {
  return {
    applicable: true,
    confidence: 'possible',
    policyId,
    exclusions: [],
  };
}

export function analyzeDenial(denialLetter: string): { reasons: string[]; counterArguments: string[] } {
  return {
    reasons: [],
    counterArguments: [],
  };
}

export function estimateSettlementRange(claimData: Record<string, unknown>): SettlementRange {
  const min = (claimData.estimatedMin as number) ?? 0;
  const max = (claimData.estimatedMax as number) ?? min * 1.5;
  return {
    min,
    max,
    confidence: 'medium',
  };
}

export function draftParametricClaim(
  eventType: string,
  evidence: Record<string, unknown>
): Record<string, unknown> {
  return {
    eventType,
    evidence,
    draft: true,
    createdAt: new Date().toISOString(),
    status: 'draft',
  };
}
