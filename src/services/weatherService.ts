import { WeatherData, HourlyWeather, DailyForecast } from '../types/weather';
import { fetchOpenMeteoWeather } from './openMeteoService';
import { geocodeToCoords } from './geocodingService';
import {
  CITY_NOT_FOUND,
  visualCrossingHttpError,
} from './weatherApiErrors';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const cache = new Map<
  string,
  { weatherData: WeatherData; hourlyData: HourlyWeather[]; dailyData: DailyForecast[]; timestamp: number }
>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

const mapConditionToIcon = (cond: string): string => {
  const c = cond.toLowerCase();
  if (c.includes('cloud')) return '☁️';
  if (c.includes('rain')) return '🌧️';
  if (c.includes('clear')) return '☀️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('storm')) return '⛈️';
  if (c.includes('fog')) return '🌫️';
  return '🌡️';
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseVisualCrossing = (data: unknown): {
  weatherData: WeatherData;
  hourlyData: HourlyWeather[];
  dailyData: DailyForecast[];
} => {
  const d = data as {
    resolvedAddress: string;
    timezone: string;
    latitude: number;
    longitude: number;
    days: Array<{
      datetime: string;
      conditions: string;
      description: string;
      temp: number;
      feelslike: number;
      humidity: number;
      windspeed: number;
      winddir: number;
      pressure: number;
      visibility: number;
      uvindex: number;
      sunrise: string;
      sunset: string;
      hours?: Array<{
        datetime: string;
        temp: number;
        conditions: string;
      }>;
      tempmax?: number;
      tempmin?: number;
      precipprob?: number;
    }>;
  };

  const today = d.days[0];
  const weatherData: WeatherData = {
    resolvedAddress: d.resolvedAddress,
    timezone: d.timezone,
    latitude: d.latitude,
    longitude: d.longitude,
    date: today.datetime,
    weatherCondition: today.conditions,
    weatherDescription: today.description,
    temperature: today.temp,
    feelsLike: today.feelslike,
    humidity: today.humidity,
    icon: mapConditionToIcon(today.conditions),
    windSpeed: today.windspeed,
    windDirection: today.winddir,
    pressure: today.pressure,
    visibility: today.visibility,
    uvIndex: today.uvindex,
    sunrise: today.sunrise,
    sunset: today.sunset,
  };

  const hourlyData: HourlyWeather[] = (today.hours ?? []).slice(0, 24).map((hour) => ({
    time: hour.datetime.slice(0, 5),
    temp: hour.temp,
    icon: mapConditionToIcon(hour.conditions),
    condition: hour.conditions,
  }));

  const dailyData: DailyForecast[] = d.days.slice(1, 6).map((day) => {
    const [y, m, dayNum] = day.datetime.split('-').map(Number);
    const dayName = new Date(y, m - 1, dayNum).toLocaleDateString('en-US', {
      weekday: 'short',
    });
    return {
      date: day.datetime,
      day: dayName,
      tempMax: day.tempmax ?? 0,
      tempMin: day.tempmin ?? 0,
      icon: mapConditionToIcon(day.conditions),
      condition: day.conditions,
      precipProb: day.precipprob ?? 0,
    };
  });

  return { weatherData, hourlyData, dailyData };
};

const tryVisualCrossing = async (cityName: string) => {
  const resp = await fetch(
    `${BASE_URL}/${encodeURIComponent(cityName)}?unitGroup=us&key=${API_KEY}&contentType=json`
  );
  if (!resp.ok) throw new Error(visualCrossingHttpError(resp.status, cityName));
  const data = await resp.json();
  return parseVisualCrossing(data);
};

const tryOpenMeteo = async (cityName: string) => {
  const cacheKey = cityName.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached;
  }

  let lat: number;
  let lon: number;
  let displayName: string;

  const isCoords = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/.test(cityName.trim());
  if (isCoords) {
    const [latStr, lonStr] = cityName.split(',').map((s) => s.trim());
    lat = parseFloat(latStr);
    lon = parseFloat(lonStr);
    displayName = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  } else {
    const coords = await geocodeToCoords(cityName);
    if (!coords) throw new Error(CITY_NOT_FOUND);
    lat = coords.lat;
    lon = coords.lon;
    displayName = coords.displayName;
  }

  const result = await fetchOpenMeteoWeather(lat, lon, displayName);
  cache.set(cacheKey, { ...result, timestamp: Date.now() });
  return result;
};

export interface WeatherResult {
  weatherData: WeatherData;
  hourlyData: HourlyWeather[];
  dailyData: DailyForecast[];
}

export const fetchWeatherData = async (cityName: string): Promise<WeatherResult> => {
  const cacheKey = cityName.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached;
  }

  let lastError: Error | null = null;

  if (API_KEY) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await tryVisualCrossing(cityName);
        cache.set(cacheKey, { ...result, timestamp: Date.now() });
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Failed to fetch weather');
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS * (attempt + 1));
        }
      }
    }
  }

  try {
    const result = await tryOpenMeteo(cityName);
    return result;
  } catch (err) {
    throw lastError ?? (err instanceof Error ? err : new Error(CITY_NOT_FOUND));
  }
};

export const parseCurrentWeather = (data: WeatherResult): WeatherData => data.weatherData;
export const parseHourlyForecast = (data: WeatherResult): HourlyWeather[] => data.hourlyData;
export const parseDailyForecast = (data: WeatherResult): DailyForecast[] => data.dailyData;
