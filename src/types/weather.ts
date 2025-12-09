export interface WeatherData {
  resolvedAddress: string;
  timezone: string;
  date: string;
  weatherCondition: string;
  weatherDescription: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  icon: string;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  icon: string;
  condition: string;
}

export interface DailyForecast {
  date: string;
  day: string;
  tempMax: number;
  tempMin: number;
  icon: string;
  condition: string;
  precipProb: number;
}

export interface FavoriteCity {
  name: string;
  addedAt: number;
}

export type TemperatureUnit = 'C' | 'F';
