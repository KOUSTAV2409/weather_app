import { useState, useCallback } from 'react';
import { useWeatherStore } from '../store/weatherStore';

export function useGeolocation() {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const fetchWeather = useWeatherStore((s) => s.fetchWeather);
  const setCity = useWeatherStore((s) => s.setCity);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const locationStr = `${coords.latitude},${coords.longitude}`;
        setCity(locationStr);
        fetchWeather(locationStr);
        setIsLocating(false);
      },
      () => {
        setLocationError('Please allow location access');
        setIsLocating(false);
      }
    );
  }, [fetchWeather, setCity]);

  const clearError = useCallback(() => setLocationError(null), []);

  return { getLocation, error: locationError, isLocating, clearError };
}
