/**
 * Weather alerts - EUMETNET/MeteoSwiss integration
 * MVP: Mock implementation; production: EUMETNET API
 */

export interface WeatherAlert {
  type: string;
  severity: 'GREEN' | 'ORANGE' | 'RED';
  message: string;
  location: string;
  startTime?: string;
  endTime?: string;
  conditions?: string;
}

export async function fetchWeatherAlerts(
  location: string,
  hours = 72
): Promise<WeatherAlert[]> {
  // MVP: Return empty or mock. Production: EUMETNET/MeteoSwiss API
  return [];
}

export const PREVENTION_ACTIONS: Record<string, string[]> = {
  storm_wind: [
    'Clear roof gutters of debris',
    'Move unsecured garden furniture inside',
    'Check and reinforce garage door if >15 years old',
    'Document property exterior with photos now',
  ],
  flood: [
    'Move valuables above ground floor level',
    'Install temporary flood barriers if available',
    'Locate and know how to operate water shut-off valve',
    'Photograph property interior and valuables for claims evidence',
  ],
  freeze: [
    'Insulate exposed pipe sections in unheated spaces',
    'Keep heating above 10°C even when absent',
    'Know location of main water shut-off in case of burst',
    'Check that boiler service is current',
  ],
};
