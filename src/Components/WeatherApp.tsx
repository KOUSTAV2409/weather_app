import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { WeatherData, HourlyWeather, DailyForecast as DailyForecastType, TemperatureUnit } from '../types/weather';
import { fetchWeatherData, parseCurrentWeather, parseHourlyForecast, parseDailyForecast } from '../services/weatherService';
import { getWeatherBackground } from '../utils/helpers';
import { addToHistory, getFavorites, addFavorite, removeFavorite, getTemperatureUnit, setTemperatureUnit } from '../utils/storage';
import WeatherCard from '../components/WeatherCard';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import SearchBar from '../components/SearchBar';
import LoadingSkeleton from '../components/LoadingSkeleton';

const WeatherApp = () => {
  const [city, setCity] = useState('baikola');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyWeather[]>([]);
  const [dailyData, setDailyData] = useState<DailyForecastType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [unit, setUnit] = useState<TemperatureUnit>(getTemperatureUnit());
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites().map(f => f.name));
  }, []);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(cityName);
      setWeatherData(parseCurrentWeather(data));
      setHourlyData(parseHourlyForecast(data));
      setDailyData(parseDailyForecast(data));
      addToHistory(cityName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const locationStr = `${coords.latitude},${coords.longitude}`;
        setCity(locationStr);
        fetchWeather(locationStr);
      },
      () => setError('Please allow location access')
    );
  };

  const toggleFavorite = () => {
    if (!weatherData) return;
    const cityName = weatherData.resolvedAddress;
    const isFav = favorites.some(f => f.toLowerCase() === cityName.toLowerCase());
    
    if (isFav) {
      removeFavorite(cityName);
    } else {
      addFavorite(cityName);
    }
    setFavorites(getFavorites().map(f => f.name));
  };

  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    setTemperatureUnit(newUnit);
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const bgGradient = weatherData 
    ? getWeatherBackground(weatherData.weatherCondition)
    : 'from-blue-50 to-white';

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen bg-gradient-to-b ${bgGradient} dark:from-gray-900 dark:to-black transition-all duration-500 p-4 md:p-8`}>
        <div className="max-w-6xl mx-auto">
          {/* Header Controls */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Weather App
            </h1>
            <div className="flex gap-2">
              <button
                onClick={toggleUnit}
                className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 font-semibold hover:scale-105 transition"
              >
                °{unit}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105 transition"
              >
                {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-700" size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              defaultValue={city}
              onSearch={(c) => {
                setCity(c);
                fetchWeather(c);
              }}
              onLocationFetch={handleLocationFetch}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingSkeleton />}

          {/* Weather Content */}
          {!loading && weatherData && (
            <div className="space-y-6">
              <WeatherCard
                data={weatherData}
                unit={unit}
                isFavorite={favorites.some(f => f.toLowerCase() === weatherData.resolvedAddress.toLowerCase())}
                onToggleFavorite={toggleFavorite}
              />
              <HourlyForecast hourly={hourlyData} unit={unit} />
              <DailyForecast forecast={dailyData} unit={unit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
