import { useCallback } from 'react';
import { useWeatherStore } from '../store/weatherStore';

export function useFavorites() {
  const favorites = useWeatherStore((s) => s.favorites);
  const addFavorite = useWeatherStore((s) => s.addFavorite);
  const removeFavorite = useWeatherStore((s) => s.removeFavorite);

  const isFavorite = useCallback(
    (cityName: string) =>
      favorites.some((f) => f.toLowerCase() === cityName.toLowerCase()),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (cityName: string) => {
      if (favorites.some((f) => f.toLowerCase() === cityName.toLowerCase())) {
        removeFavorite(cityName);
      } else {
        addFavorite(cityName);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  return { favorites, isFavorite, toggleFavorite };
}
