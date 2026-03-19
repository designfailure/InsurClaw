/**
 * Underwriting tools - Risk assessment, market comparison
 * MVP: Mock/rule-based; production: Aggregator APIs, CoreLogic
 */

export interface RiskAssessment {
  score: number;
  factors: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface PolicyQuote {
  carrier: string;
  premium: number;
  coverage: string;
  deviation?: number;
}

export function riskAssess(propertyData: Record<string, unknown>): RiskAssessment {
  const factors: string[] = [];
  let score = 50;

  if (propertyData.floodZone) {
    factors.push('Flood zone exposure');
    score += 15;
  }
  if (propertyData.age && (propertyData.age as number) > 50) {
    factors.push('Older construction');
    score += 10;
  }
  if (propertyData.lastInspection) {
    factors.push('Inspection history available');
    score -= 5;
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    factors,
    confidence: factors.length > 2 ? 'high' : 'medium',
  };
}

export function priceDeviation(quote: number, zone: string, marketAvg?: number): number {
  const avg = marketAvg ?? quote * 0.9;
  return Math.round(((quote - avg) / avg) * 100);
}

export async function scanPolicies(coverageReq: Record<string, unknown>): Promise<PolicyQuote[]> {
  // MVP: Mock. Production: Aggregator API
  return [];
}
