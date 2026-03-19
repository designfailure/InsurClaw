/**
 * EC 261/2004 - EU Flight Delay/Cancellation Compensation Calculator
 * Per SKILL_event_coverage.md compensation table
 */

export interface EC261Result {
  eligible: boolean;
  amount: number;
  tier: string;
  reason?: string;
}

/**
 * EC 261/2004 Compensation Table:
 * - >= 2h delay, < 1,500 km: €250
 * - >= 3h delay, 1,500–3,500 km: €400
 * - >= 3h delay, > 3,500 km (intra-EU): €400
 * - >= 4h delay, > 3,500 km: €600
 */
export function calculateCompensation(delayMinutes: number, distanceKm: number): EC261Result {
  const delayHours = delayMinutes / 60;

  if (distanceKm < 1500) {
    if (delayMinutes >= 120) {
      return { eligible: true, amount: 250, tier: 'short' };
    }
    return { eligible: false, amount: 0, tier: 'none', reason: 'Delay < 2h for short haul' };
  }

  if (distanceKm >= 1500 && distanceKm <= 3500) {
    if (delayMinutes >= 180) {
      return { eligible: true, amount: 400, tier: 'medium' };
    }
    return { eligible: false, amount: 0, tier: 'none', reason: 'Delay < 3h for medium haul' };
  }

  // > 3500 km
  if (delayMinutes >= 240) {
    return { eligible: true, amount: 600, tier: 'long' };
  }
  return { eligible: false, amount: 0, tier: 'none', reason: 'Delay < 4h for long haul' };
}
