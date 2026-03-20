import { WeatherData, HourlyWeather, DailyForecast } from '../types/weather';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/** WMO Weather codes to condition strings */
const WMO_TO_CONDITION: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Dense Drizzle',
  56: 'Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Rain Showers',
  81: 'Rain Showers',
  82: 'Rain Showers',
  85: 'Snow Showers',
  86: 'Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
};

const mapWmoToCondition = (code: number): string =>
  WMO_TO_CONDITION[code] ?? 'Clear';

const mapConditionToIcon = (cond: string): string => {
  const c = cond.toLowerCase();
  if (c.includes('cloud')) return '☁️';
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
  if (c.includes('clear')) return '☀️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('storm') || c.includes('thunder')) return '⛈️';
  if (c.includes('fog')) return '🌫️';
  return '🌡️';
};

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
    visibility?: number;
    uv_index?: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export const fetchOpenMeteoWeather = async (
  lat: number,
  lon: number,
  displayName: string
): Promise<{
  weatherData: WeatherData;
  hourlyData: HourlyWeather[];
  dailyData: DailyForecast[];
}> => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    timezone: 'auto',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,uv_index',
    hourly: 'temperature_2m,weather_code',
    daily:
      'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,sunrise,sunset',
    forecast_days: '6',
  });

  const resp = await fetch(`${FORECAST_URL}?${params}`);
  if (!resp.ok) throw new Error('Failed to fetch weather');

  const data = (await resp.json()) as OpenMeteoResponse;

  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  if (!current || !hourly || !daily) {
    throw new Error('Invalid weather data');
  }

  const todayCode = current.weather_code;
  const condition = mapWmoToCondition(todayCode);

  const weatherData: WeatherData = {
    resolvedAddress: displayName,
    timezone: data.timezone,
    latitude: data.latitude,
    longitude: data.longitude,
    date: current.time.slice(0, 10),
    weatherCondition: condition,
    weatherDescription: `${condition}.`,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    icon: mapConditionToIcon(condition),
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    pressure: current.surface_pressure,
    visibility: current.visibility ?? 10000,
    uvIndex: Math.round(current.uv_index ?? 0),
    sunrise: daily.sunrise[0]?.slice(11, 16) ?? '06:00',
    sunset: daily.sunset[0]?.slice(11, 16) ?? '18:00',
  };

  const hourlyData: HourlyWeather[] = hourly.time.slice(0, 24).map((time, i) => {
    const code = hourly.weather_code[i] ?? 0;
    const cond = mapWmoToCondition(code);
    return {
      time: time.slice(11, 16),
      temp: hourly.temperature_2m[i] ?? 0,
      icon: mapConditionToIcon(cond),
      condition: cond,
    };
  });

  const dailyData: DailyForecast[] = daily.time.slice(1, 6).map((date, i) => {
    const [y, m, d] = date.split('-').map(Number);
    const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'short',
    });
    const code = daily.weather_code[i + 1] ?? 0;
    const cond = mapWmoToCondition(code);
    return {
      date,
      day: dayName,
      tempMax: daily.temperature_2m_max[i + 1] ?? 0,
      tempMin: daily.temperature_2m_min[i + 1] ?? 0,
      icon: mapConditionToIcon(cond),
      condition: cond,
      precipProb: daily.precipitation_probability_max[i + 1] ?? 0,
    };
  });

  return { weatherData, hourlyData, dailyData };
};
