import { TemperatureUnit } from '../types/weather';

export const formatDate = (d: string): string => {
  const [y, m, day] = d.split('-');
  return `${day}-${m}-${y}`;
};

export const getWeekday = (d: string): string => {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('en-US', { weekday: 'long' });
};

export const convertTemp = (fahrenheit: number, unit: TemperatureUnit): number => {
  return unit === 'C' ? Math.round((fahrenheit - 32) * 5 / 9) : Math.round(fahrenheit);
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % 8];
};

export const getWeatherBackground = (condition: string): string => {
  const c = condition.toLowerCase();
  if (c.includes('clear')) return 'from-blue-400 via-blue-300 to-blue-200';
  if (c.includes('cloud')) return 'from-gray-400 via-gray-300 to-gray-200';
  if (c.includes('rain')) return 'from-slate-600 via-slate-500 to-slate-400';
  if (c.includes('snow')) return 'from-blue-200 via-white to-blue-100';
  if (c.includes('storm')) return 'from-gray-700 via-gray-600 to-gray-500';
  return 'from-blue-50 to-white';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
