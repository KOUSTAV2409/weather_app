import { useEffect } from 'react';
import { useWeatherStore } from '../store/weatherStore';

export function useWeather(initialCity?: string) {
  const city = useWeatherStore((s) => s.city);
  const weatherData = useWeatherStore((s) => s.weatherData);
  const hourlyData = useWeatherStore((s) => s.hourlyData);
  const dailyData = useWeatherStore((s) => s.dailyData);
  const loading = useWeatherStore((s) => s.loading);
  const error = useWeatherStore((s) => s.error);
  const setCity = useWeatherStore((s) => s.setCity);
  const fetchWeather = useWeatherStore((s) => s.fetchWeather);

  useEffect(() => {
    const store = useWeatherStore.getState();
    const cityToFetch = initialCity ?? store.city;
    store.fetchWeather(cityToFetch);
  }, [initialCity]);

  const search = (cityName: string) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  return {
    city,
    weatherData,
    hourlyData,
    dailyData,
    loading,
    error,
    search,
    fetchWeather,
  };
}
