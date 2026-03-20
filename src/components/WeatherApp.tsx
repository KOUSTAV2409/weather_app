import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, GitCompare, Github, Home } from 'lucide-react';
import { useWeather, useGeolocation, useTheme, useFavorites } from '../hooks';
import { useWeatherStore } from '../store/weatherStore';
import WeatherCard from './WeatherCard';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import SearchBar from './SearchBar';
import LoadingSkeleton from './LoadingSkeleton';
import WeatherComparison from './WeatherComparison';
import WeatherStreaks from './WeatherStreaks';
import BestTimeOfDay from './BestTimeOfDay';
import OutfitSuggestions from './OutfitSuggestions';
import WeatherQuiz from './WeatherQuiz';
import WeatherSounds from './WeatherSounds';
import WeatherMap from './WeatherMap';
import { ErrorBoundary } from './ErrorBoundary';
import { getWeatherGradientStyle } from '../utils/helpers';

const WeatherApp = () => {
  const [showComparison, setShowComparison] = useState(false);

  const { weatherData, hourlyData, dailyData, loading, error, search } = useWeather();
  const { getLocation, error: locationError, isLocating, clearError } = useGeolocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const unit = useWeatherStore((s) => s.unit);
  const toggleUnit = useWeatherStore((s) => s.toggleUnit);
  const { isFavorite, toggleFavorite } = useFavorites();

  const displayError = error ?? locationError;

  const gradientStyle = weatherData
    ? getWeatherGradientStyle(weatherData.weatherCondition)
    : { background: '#000' };

  const hasWeather = !!(weatherData && !loading && !isLocating);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div
        className="min-h-screen transition-[background] duration-700 ease-out p-4 md:p-8"
        style={gradientStyle}
      >
        <div className="max-w-4xl mx-auto relative">
          {/* Header - compact when centered, full when weather shown */}
          <div
            className={`flex justify-between items-center transition-all duration-300 ${
              hasWeather ? 'mb-8' : 'absolute top-0 left-0 right-0 p-4 md:p-8 z-10'
            }`}
          >
            <h1 className="text-2xl md:text-3xl font-calligraphic text-white">
              Weather
            </h1>
            <div className="flex gap-2">
              <Link
                to="/"
                className="p-2 border border-white/20 rounded-lg hover:border-white transition-colors"
                title="Back to home"
              >
                <Home size={18} className="text-white" />
              </Link>
              <a
                href="https://github.com/KOUSTAV2409/weather_app"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/20 rounded-lg hover:border-white transition-colors"
                title="View on GitHub"
              >
                <Github size={18} className="text-white" />
              </a>
              {hasWeather && (
                <>
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
                </>
              )}
              <button
                onClick={toggleDarkMode}
                className="p-2 border border-white/20 rounded-lg hover:border-white transition-colors"
              >
                {darkMode ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-gray-900" />}
              </button>
            </div>
          </div>

          {/* Search - centered Google-style when empty, default position when weather shown */}
          <div
            className={`transition-all duration-500 ${
              hasWeather
                ? 'mb-8'
                : 'min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center -mt-8'
            }`}
          >
            {!hasWeather && (
              <p className="text-white/50 text-sm mb-6">Search for a city or use your location</p>
            )}
            <div className={hasWeather ? '' : 'w-full max-w-2xl mx-auto'}>
              <SearchBar
                defaultValue={weatherData ? weatherData.resolvedAddress : ''}
                onSearch={(c) => {
                  clearError();
                  search(c);
                }}
                onLocationFetch={getLocation}
                centered={!hasWeather}
              />
            </div>
          </div>

          {/* Error */}
          {displayError && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-400">{displayError}</p>
            </div>
          )}

          {/* Loading */}
          {(loading || isLocating) && <LoadingSkeleton />}

          {/* Content */}
          <ErrorBoundary>
            {!loading && !isLocating && weatherData && (
              <div className="space-y-4">
                <WeatherCard
                  data={weatherData}
                  unit={unit}
                  isFavorite={isFavorite(weatherData.resolvedAddress)}
                  onToggleFavorite={() => toggleFavorite(weatherData.resolvedAddress)}
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
          </ErrorBoundary>
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
