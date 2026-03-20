const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
  displayName: string;
  /** Pass this to weather API for accurate lookup */
  query: string;
}

interface OpenMeteoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

interface GeocodingResponse {
  results?: OpenMeteoResult[];
}

export const searchLocations = async (query: string): Promise<GeocodingResult[]> => {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    name: trimmed,
    count: '8',
    format: 'json',
  });

  const resp = await fetch(`${GEOCODING_URL}?${params}`);
  if (!resp.ok) return [];

  const data = (await resp.json()) as GeocodingResponse;
  if (!data.results?.length) return [];

  return data.results.map((r) => {
    const parts = [r.name, r.admin1, r.admin2, r.country].filter(Boolean);
    const displayName = parts.join(', ');
    return {
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
      admin1: r.admin1,
      admin2: r.admin2,
      displayName,
      query: `${r.latitude},${r.longitude}`,
    };
  });
};
