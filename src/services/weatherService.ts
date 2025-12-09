import { WeatherData, HourlyWeather, DailyForecast } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

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

export const fetchWeatherData = async (cityName: string) => {
  const cacheKey = cityName.toLowerCase();
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const resp = await fetch(
    `${BASE_URL}/${cityName}?unitGroup=us&key=${API_KEY}&contentType=json`
  );
  
  if (!resp.ok) throw new Error('City not found');
  
  const data = await resp.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
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
