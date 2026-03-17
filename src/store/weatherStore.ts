import { create } from 'zustand';
import { WeatherData, HourlyWeather, DailyForecast, TemperatureUnit } from '../types/weather';
import {
  getFavorites,
  addFavorite as addFavoriteStorage,
  removeFavorite as removeFavoriteStorage,
  getTemperatureUnit,
  setTemperatureUnit as setTemperatureUnitStorage,
  getDarkMode,
  setDarkMode as setDarkModeStorage,
} from '../utils/storage';
import {
  fetchWeatherData,
  parseCurrentWeather,
  parseHourlyForecast,
  parseDailyForecast,
} from '../services/weatherService';
import { addToHistory } from '../utils/storage';

interface WeatherState {
  city: string;
  weatherData: WeatherData | null;
  hourlyData: HourlyWeather[];
  dailyData: DailyForecast[];
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  unit: TemperatureUnit;
  favorites: string[];
  setCity: (city: string) => void;
  fetchWeather: (cityName: string) => Promise<void>;
  setDarkMode: (enabled: boolean) => void;
  toggleUnit: () => void;
  addFavorite: (city: string) => void;
  removeFavorite: (city: string) => void;
  refreshFavorites: () => void;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  city: 'New York',
  weatherData: null,
  hourlyData: [],
  dailyData: [],
  loading: false,
  error: null,
  darkMode: getDarkMode(),
  unit: getTemperatureUnit(),
  favorites: getFavorites().map((f) => f.name),

  setCity: (city) => set({ city }),

  fetchWeather: async (cityName: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchWeatherData(cityName);
      set({
        weatherData: parseCurrentWeather(data),
        hourlyData: parseHourlyForecast(data),
        dailyData: parseDailyForecast(data),
        city: cityName,
        loading: false,
        error: null,
      });
      addToHistory(cityName);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather';
      set({ error: message, loading: false });
    }
  },

  setDarkMode: (enabled) => {
    setDarkModeStorage(enabled);
    set({ darkMode: enabled });
  },

  toggleUnit: () => {
    const { unit } = get();
    const newUnit = unit === 'C' ? 'F' : 'C';
    setTemperatureUnitStorage(newUnit);
    set({ unit: newUnit });
  },

  addFavorite: (city) => {
    addFavoriteStorage(city);
    set({ favorites: getFavorites().map((f) => f.name) });
  },

  removeFavorite: (city) => {
    removeFavoriteStorage(city);
    set({ favorites: getFavorites().map((f) => f.name) });
  },

  refreshFavorites: () => {
    set({ favorites: getFavorites().map((f) => f.name) });
  },
}));
