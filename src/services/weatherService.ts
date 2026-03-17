import { WeatherData, HourlyWeather, DailyForecast } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const cache = new Map<string, { data: unknown; timestamp: number }>();
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

const getUserFacingError = (status: number, cityName: string): string => {
  if (status === 400) return 'Invalid location. Please check the city name.';
  if (status === 401) return 'API key invalid. Please check configuration.';
  if (status === 404) return 'City not found. Try a different location.';
  if (status === 429) return 'Too many requests. Please try again later.';
  if (status >= 500) return 'Weather service is temporarily unavailable.';
  return `Unable to fetch weather for "${cityName}". Please try again.`;
};

export const fetchWeatherData = async (cityName: string): Promise<unknown> => {
  const cacheKey = cityName.toLowerCase();
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await fetch(
        `${BASE_URL}/${cityName}?unitGroup=us&key=${API_KEY}&contentType=json`
      );

      if (!resp.ok) {
        throw new Error(getUserFacingError(resp.status, cityName));
      }

      const data = await resp.json();
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Failed to fetch weather');
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  throw lastError ?? new Error('City not found');
};

export const parseCurrentWeather = (data: any): WeatherData => {
  const today = data.days[0];
  return {
    resolvedAddress: data.resolvedAddress,
    timezone: data.timezone,
    latitude: data.latitude,
    longitude: data.longitude,
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
};

export const parseHourlyForecast = (data: any): HourlyWeather[] => {
  return data.days[0].hours.slice(0, 24).map((hour: any) => ({
    time: hour.datetime.slice(0, 5),
    temp: hour.temp,
    icon: mapConditionToIcon(hour.conditions),
    condition: hour.conditions,
  }));
};

export const parseDailyForecast = (data: any): DailyForecast[] => {
  return data.days.slice(1, 6).map((day: any) => {
    const [y, m, d] = day.datetime.split('-').map(Number);
    const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
    
    return {
      date: day.datetime,
      day: dayName,
      tempMax: day.tempmax,
      tempMin: day.tempmin,
      icon: mapConditionToIcon(day.conditions),
      condition: day.conditions,
      precipProb: day.precipprob,
    };
  });
};
