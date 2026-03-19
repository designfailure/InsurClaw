/**
 * InsurTech Tools - Domain tools for specialist agents
 * EC 261, weather, underwriting, claims, approval, messaging
 */

import { runSpecialist, type SpecialistId } from '../agents/specialists/index.js';
import { calculateCompensation } from './ec261.js';
import { fetchFlightStatus } from './flight.js';
import { fetchWeatherAlerts } from './weather.js';
import {
  riskAssess as underwritingRiskAssess,
  priceDeviation as underwritingPriceDeviation,
  scanPolicies,
} from './underwriting.js';
import {
  analyzeCoverage,
  analyzeDenial,
  estimateSettlementRange,
  draftParametricClaim,
} from './claims.js';

export interface InsurTechTools {
  delegate(agentId: string, task: string, userId: string, context?: Record<string, unknown>): Promise<string | null>;
  ec261CalculateCompensation(delayMinutes: number, distanceKm: number): ReturnType<typeof calculateCompensation>;
  flightFetchStatus(flightNumber: string): ReturnType<typeof fetchFlightStatus>;
  weatherFetchAlerts(location: string, hours?: number): ReturnType<typeof fetchWeatherAlerts>;
  claimDraftParametric(eventType: string, evidence: Record<string, unknown>): ReturnType<typeof draftParametricClaim>;
  riskAssess(propertyData: Record<string, unknown>): ReturnType<typeof underwritingRiskAssess>;
  priceDeviation(quote: number, zone: string, marketAvg?: number): number;
  scanPolicies(coverageReq: Record<string, unknown>): ReturnType<typeof scanPolicies>;
  analyzeCoverage(policyId: string, event: Record<string, unknown>): ReturnType<typeof analyzeCoverage>;
  analyzeDenial(denialLetter: string): ReturnType<typeof analyzeDenial>;
  estimateSettlementRange(claimData: Record<string, unknown>): ReturnType<typeof estimateSettlementRange>;
}

export function createInsurTechTools(): InsurTechTools {
  return {
    async delegate(agentId: string, task: string, userId: string, context?: Record<string, unknown>): Promise<string | null> {
      const result = await runSpecialist(
        agentId as SpecialistId,
        task,
        userId,
        context
      );
      return result.text;
    },

    ec261CalculateCompensation(delayMinutes: number, distanceKm: number) {
      return calculateCompensation(delayMinutes, distanceKm);
    },

    async flightFetchStatus(flightNumber: string) {
      return fetchFlightStatus(flightNumber);
    },

    async weatherFetchAlerts(location: string, hours = 72) {
      return fetchWeatherAlerts(location, hours);
    },

    claimDraftParametric(eventType: string, evidence: Record<string, unknown>) {
      return draftParametricClaim(eventType, evidence);
    },

    riskAssess(propertyData: Record<string, unknown>) {
      return underwritingRiskAssess(propertyData);
    },

    priceDeviation(quote: number, zone: string, marketAvg?: number) {
      return underwritingPriceDeviation(quote, zone, marketAvg);
    },

    async scanPolicies(coverageReq: Record<string, unknown>) {
      return scanPolicies(coverageReq);
    },

    analyzeCoverage(policyId: string, event: Record<string, unknown>) {
      return analyzeCoverage(policyId, event);
    },

    analyzeDenial(denialLetter: string) {
      return analyzeDenial(denialLetter);
    },

    estimateSettlementRange(claimData: Record<string, unknown>) {
      return estimateSettlementRange(claimData);
    },
  };
}

export { calculateCompensation } from './ec261.js';
export { fetchFlightStatus } from './flight.js';
export { fetchWeatherAlerts, PREVENTION_ACTIONS } from './weather.js';
