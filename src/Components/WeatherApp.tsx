import { useEffect, useState } from 'react';
import { Moon, Sun, GitCompare, Github } from 'lucide-react';
import { WeatherData, HourlyWeather, DailyForecast as DailyForecastType, TemperatureUnit } from '../types/weather';
import { fetchWeatherData, parseCurrentWeather, parseHourlyForecast, parseDailyForecast } from '../services/weatherService';
import { addToHistory, getFavorites, addFavorite, removeFavorite, getTemperatureUnit, setTemperatureUnit } from '../utils/storage';
import WeatherCard from '../components/WeatherCard';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import SearchBar from '../components/SearchBar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import WeatherComparison from '../components/WeatherComparison';
import WeatherStreaks from '../components/WeatherStreaks';
import BestTimeOfDay from '../components/BestTimeOfDay';
import OutfitSuggestions from '../components/OutfitSuggestions';
import WeatherQuiz from '../components/WeatherQuiz';
import WeatherSounds from '../components/WeatherSounds';
import WeatherMap from '../components/WeatherMap';

const WeatherApp = () => {
  const [city, setCity] = useState('baikola');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyWeather[]>([]);
  const [dailyData, setDailyData] = useState<DailyForecastType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [unit, setUnit] = useState<TemperatureUnit>(getTemperatureUnit());
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

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

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-black transition-colors p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-medium tracking-tight text-white">
              Weather
            </h1>
            <div className="flex gap-2">
              <a
                href="https://github.com/KOUSTAV2409/weather_app"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/20 rounded-lg hover:border-white transition-colors"
                title="View on GitHub"
              >
                <Github size={18} className="text-white" />
              </a>
              <button
                onClick={() => setShowComparison(true)}
                className="px-3 py-2 text-sm border border-white/20 rounded-lg hover:border-white transition-colors text-white flex items-center gap-2"
              >
                <GitCompare size={16} />
                Compare
              </button>
              <button
                onClick={toggleUnit}
                className="px-3 py-2 text-sm border border-white/20 rounded-lg hover:border-white transition-colors text-white"
              >
                °{unit}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 border border-white/20 rounded-lg hover:border-white transition-colors"
              >
                {darkMode ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-gray-900" />}
              </button>
            </div>
          </div>

          {/* Search */}
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

          {/* Error */}
          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && <LoadingSkeleton />}

          {/* Content */}
          {!loading && weatherData && (
            <div className="space-y-4">
              <WeatherCard
                data={weatherData}
                unit={unit}
                isFavorite={favorites.some(f => f.toLowerCase() === weatherData.resolvedAddress.toLowerCase())}
                onToggleFavorite={toggleFavorite}
              />
              
              <WeatherMap 
                lat={weatherData.latitude} 
                lon={weatherData.longitude} 
                city={weatherData.resolvedAddress} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BestTimeOfDay hourly={hourlyData} unit={unit} />
                <OutfitSuggestions data={weatherData} unit={unit} />
              </div>

              <HourlyForecast hourly={hourlyData} unit={unit} />
              <DailyForecast forecast={dailyData} unit={unit} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WeatherStreaks forecast={dailyData} />
                <WeatherQuiz forecast={dailyData} unit={unit} />
              </div>
            </div>
          )}
        </div>

        {/* Weather Sounds */}
        {weatherData && <WeatherSounds condition={weatherData.weatherCondition} />}

        {/* Comparison Modal */}
        {showComparison && (
          <WeatherComparison unit={unit} onClose={() => setShowComparison(false)} />
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
