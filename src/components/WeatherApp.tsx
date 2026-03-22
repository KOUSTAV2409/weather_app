import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, GitCompare, Github, Home, RefreshCw, BookOpen } from 'lucide-react';
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
import WeatherDashboard from './WeatherDashboard';
import { ErrorBoundary } from './ErrorBoundary';
import { getWeatherGradientStyle } from '../utils/helpers';

const WeatherApp = () => {
  const [showComparison, setShowComparison] = useState(false);

  const { weatherData, hourlyData, dailyData, loading, error, search, fetchWeather, city } =
    useWeather();
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

  // Smoothly animate the search section from "centered" -> "top" when weather appears.
  // This uses a lightweight FLIP-style transform (no extra dependency).
  const searchSectionRef = useRef<HTMLDivElement | null>(null);
  const startRectRef = useRef<DOMRect | null>(null);
  const prevHasWeatherRef = useRef(hasWeather);

  useLayoutEffect(() => {
    const el = searchSectionRef.current;
    if (!el) return;

    const prevHasWeather = prevHasWeatherRef.current;

    if (!prevHasWeather && hasWeather && startRectRef.current) {
      const startRect = startRectRef.current;
      const endRect = el.getBoundingClientRect();

      const dx = startRect.left - endRect.left;
      const dy = startRect.top - endRect.top;

      const durationMs = 560;
      const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

      el.style.willChange = 'transform, opacity';
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.985)`;
      el.style.opacity = '0.0';

      // Flush style.
      el.getBoundingClientRect();

      el.style.transition = `transform ${durationMs}ms ${ease}, opacity ${durationMs}ms ${ease}`;
      requestAnimationFrame(() => {
        el.style.transform = 'translate(0px, 0px) scale(1)';
        el.style.opacity = '1';
      });

      const cleanupTimer = window.setTimeout(() => {
        el.style.willChange = '';
        el.style.transition = '';
        el.style.transform = '';
        el.style.opacity = '';
      }, durationMs + 80);

      return () => window.clearTimeout(cleanupTimer);
    }

    // Store the last "centered" rect so we can animate from it.
    if (!hasWeather) {
      startRectRef.current = el.getBoundingClientRect();
    }

    prevHasWeatherRef.current = hasWeather;
  }, [hasWeather]);

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
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 p-2 transition-colors hover:border-white"
                title="Back to home"
                aria-label="Back to home"
              >
                <Home size={18} className="text-white" aria-hidden />
              </Link>
              <Link
                to="/docs"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 p-2 transition-colors hover:border-white"
                title="Documentation"
                aria-label="Documentation"
              >
                <BookOpen size={18} className="text-white" aria-hidden />
              </Link>
              <a
                href="https://github.com/KOUSTAV2409/weather_app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 p-2 transition-colors hover:border-white"
                title="View on GitHub"
                aria-label="View project on GitHub"
              >
                <Github size={18} className="text-white" aria-hidden />
              </a>
              {hasWeather && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const q = weatherData?.resolvedAddress ?? city;
                      if (q) void fetchWeather(q);
                    }}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 p-2 text-white transition-colors hover:border-white"
                    title="Refresh weather"
                    aria-label="Refresh weather"
                  >
                    <RefreshCw size={18} className="text-white" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowComparison(true)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-white transition-colors hover:border-white"
                    aria-label="Compare cities"
                  >
                    <GitCompare size={16} aria-hidden />
                    Compare
                  </button>
                  <button
                    type="button"
                    onClick={toggleUnit}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-sm text-white transition-colors hover:border-white"
                    aria-label={`Temperature unit ${unit === 'C' ? 'Celsius' : 'Fahrenheit'}, click to switch`}
                  >
                    °{unit}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 p-2 transition-colors hover:border-white"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun size={18} className="text-white" aria-hidden />
                ) : (
                  <Moon size={18} className="text-gray-900" aria-hidden />
                )}
              </button>
            </div>
          </div>

          {/* Search - centered Google-style when empty, default position when weather shown */}
          <div
            ref={searchSectionRef}
            className={`${
              hasWeather
                ? 'mb-8'
                : 'min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center -mt-8'
            }`}
          >
            {!hasWeather && (
              <p className="text-white/50 text-sm mb-6">Search for a city or use your location</p>
            )}
            <div className="w-full max-w-2xl mx-auto">
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
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 rounded-xl border border-red-800 bg-red-950/50 p-4"
            >
              <p className="text-sm text-red-400">{displayError}</p>
            </div>
          )}

          {/* Loading */}
          {(loading || isLocating) && <LoadingSkeleton />}

          {/* Content */}
          <ErrorBoundary>
            {!loading && !isLocating && weatherData && (
              <>
                <div
                  className="sr-only"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {`Weather loaded for ${weatherData.resolvedAddress}. ${weatherData.weatherCondition}.`}
                </div>
                <div className="weather-stagger flex flex-col gap-4">
                  <WeatherCard
                    data={weatherData}
                    unit={unit}
                    isFavorite={isFavorite(weatherData.resolvedAddress)}
                    onToggleFavorite={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate(12);
                      }
                      toggleFavorite(weatherData.resolvedAddress);
                    }}
                  />

                  <WeatherMap
                    lat={weatherData.latitude}
                    lon={weatherData.longitude}
                    city={weatherData.resolvedAddress}
                    theme={darkMode ? 'dark' : 'light'}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <BestTimeOfDay hourly={hourlyData} unit={unit} />
                    <OutfitSuggestions data={weatherData} unit={unit} />
                  </div>

                  <HourlyForecast
                    hourly={hourlyData}
                    unit={unit}
                    timeZone={weatherData.timezone}
                  />
                  <DailyForecast forecast={dailyData} unit={unit} />

                  <WeatherDashboard hourly={hourlyData} daily={dailyData} unit={unit} />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <WeatherStreaks forecast={dailyData} />
                    <WeatherQuiz forecast={dailyData} unit={unit} />
                  </div>
                </div>
              </>
            )}
          </ErrorBoundary>
        </div>

        {/* Weather Sounds */}
        {weatherData && <WeatherSounds condition={weatherData.weatherCondition} />}

        {/* Comparison Modal */}
        <WeatherComparison
          unit={unit}
          open={showComparison}
          onOpenChange={setShowComparison}
        />
      </div>
    </div>
  );
};

export default WeatherApp;
