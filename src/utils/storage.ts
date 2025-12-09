import { FavoriteCity } from '../types/weather';

const FAVORITES_KEY = 'weather_favorites';
const HISTORY_KEY = 'weather_history';
const UNIT_KEY = 'weather_unit';

export const getFavorites = (): FavoriteCity[] => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addFavorite = (city: string): void => {
  const favorites = getFavorites();
  if (!favorites.find(f => f.name.toLowerCase() === city.toLowerCase())) {
    favorites.push({ name: city, addedAt: Date.now() });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavorite = (city: string): void => {
  const favorites = getFavorites().filter(
    f => f.name.toLowerCase() !== city.toLowerCase()
  );
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const getSearchHistory = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addToHistory = (city: string): void => {
  const history = getSearchHistory();
  const filtered = history.filter(c => c.toLowerCase() !== city.toLowerCase());
  filtered.unshift(city);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 10)));
};

export const getTemperatureUnit = (): 'C' | 'F' => {
  return (localStorage.getItem(UNIT_KEY) as 'C' | 'F') || 'C';
};

export const setTemperatureUnit = (unit: 'C' | 'F'): void => {
  localStorage.setItem(UNIT_KEY, unit);
};
