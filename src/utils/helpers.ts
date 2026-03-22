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

/** Returns CSS gradient for dark-mode weather-based background */
export const getWeatherGradientStyle = (condition: string): { background: string } => {
  const c = condition.toLowerCase();
  // Sunny/Clear: warm amber, orange
  if (c.includes('clear') || c.includes('sun')) {
    return {
      background:
        'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(30,20,10,1) 30%, rgba(120,60,20,0.4) 70%, rgba(251,146,60,0.15) 100%)',
    };
  }
  // Rainy: cool blue, slate
  if (c.includes('rain') || c.includes('drizzle')) {
    return {
      background:
        'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(15,25,45,1) 40%, rgba(30,58,138,0.5) 80%, rgba(59,130,246,0.2) 100%)',
    };
  }
  // Stormy: dark purple, deep gray
  if (c.includes('storm') || c.includes('thunder')) {
    return {
      background:
        'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(30,20,40,1) 50%, rgba(88,28,135,0.4) 85%, rgba(126,34,206,0.15) 100%)',
    };
  }
  // Snowy: cool blue-white
  if (c.includes('snow')) {
    return {
      background:
        'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(15,30,50,1) 40%, rgba(56,189,248,0.25) 80%, rgba(186,230,253,0.1) 100%)',
    };
  }
  // Fog/Mist: muted gray
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) {
    return {
      background:
        'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(30,35,40,1) 50%, rgba(100,116,139,0.3) 100%)',
    };
  }
  // Cloudy: soft blue-gray
  if (c.includes('cloud') || c.includes('overcast')) {
    return {
      background:
        'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(20,30,45,1) 40%, rgba(71,85,105,0.35) 80%, rgba(148,163,184,0.1) 100%)',
    };
  }
  // Default: neutral dark
  return {
    background:
      'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(20,25,35,1) 60%, rgba(59,130,246,0.1) 100%)',
  };
};

export const getWeatherIconClass = (condition: string): string => {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sun')) return 'weather-icon sunny';
  if (c.includes('cloud')) return 'weather-icon cloudy';
  if (c.includes('rain')) return 'weather-icon rainy';
  if (c.includes('snow')) return 'weather-icon snowy';
  if (c.includes('storm')) return 'weather-icon stormy';
  return 'weather-icon';
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/** Glass-style panel: backdrop blur + translucent surface (UX glassmorphism) */
export const glassPanel =
  'backdrop-blur-xl bg-card/45 border border-white/15 shadow-lg ring-1 ring-white/5 dark:bg-card/35 dark:border-white/10';
