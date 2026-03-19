/**
 * Flight status - OpenSky/ADS-B integration
 * MVP: Mock implementation; production: OpenSky API
 */

export interface FlightStatus {
  flightNumber: string;
  delayed: boolean;
  delayMinutes?: number;
  distanceKm?: number;
  departure?: string;
  arrival?: string;
  scheduledArrival?: string;
  actualArrival?: string;
  carrier?: string;
  carrierCountry?: string;
}

const OPENSKY_BASE = 'https://opensky-network.org/api';

export async function fetchFlightStatus(flightNumber: string): Promise<FlightStatus> {
  // MVP: Return mock. Production would call OpenSky API
  // OpenSky: GET /flights/arrival?icao24=... or search by flight number
  const cleaned = flightNumber.replace(/\s/g, '').toUpperCase();

  return {
    flightNumber: cleaned,
    delayed: false,
    delayMinutes: undefined,
    distanceKm: undefined,
    departure: undefined,
    arrival: undefined,
    scheduledArrival: undefined,
    actualArrival: undefined,
    carrier: undefined,
    carrierCountry: undefined,
  };
}

/**
 * Calculate great-circle distance between two points (Haversine)
 * Used when OpenSky returns coordinates
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
