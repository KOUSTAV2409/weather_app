import { useWeatherStore } from '../store/weatherStore';

export function useTheme() {
  const darkMode = useWeatherStore((s) => s.darkMode);
  const setDarkMode = useWeatherStore((s) => s.setDarkMode);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return { darkMode, toggleDarkMode };
}
