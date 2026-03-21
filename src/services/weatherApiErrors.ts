/**
 * User-facing messages for the weather API layer (Visual Crossing + Open-Meteo fallback).
 * Keep copy here so services stay consistent and testable.
 */

export function visualCrossingHttpError(status: number, cityName: string): string {
  if (status === 400) return 'Invalid location. Please check the city name.';
  if (status === 401) return 'API key invalid. Please check configuration.';
  if (status === 404) return 'City not found. Try a different location.';
  if (status === 429) return 'Too many requests. Please try again later.';
  if (status >= 500) return 'Weather service is temporarily unavailable.';
  return `Unable to fetch weather for "${cityName}". Please try again.`;
}

export const CITY_NOT_FOUND = 'City not found. Try a different location.';

export const OPEN_METEO_UNAVAILABLE = 'Weather service is temporarily unavailable.';

export const INVALID_WEATHER_PAYLOAD = 'Invalid weather data.';
