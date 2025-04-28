import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface WeatherData {
  resolvedAddress: string;
  timezone: string;
  date: string;
  weatherCondition: string;
  weatherDescription: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  icon: string;
}

// Helpers
const formatDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}-${m}-${y}`;
};
const getWeekday = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-US", { weekday: "long" });
};

const Weather = () => {
  const [city, setCity] = useState("baikola");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const apiKey = "4JJZTU8SPZXDWCNT65LW2JATF";

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=us&key=${apiKey}&contentType=json`
      );
      if (!resp.ok) throw new Error("City not found");
      const data = await resp.json();
      const today = data.days[0];
      setWeatherData({
        resolvedAddress: data.resolvedAddress,
        timezone: data.timezone,
        date: today.datetime,
        weatherCondition: today.conditions,
        weatherDescription: today.description,
        temperature: today.temp,
        feelsLike: today.feelslike,
        humidity: today.humidity,
        icon: mapConditionToIcon(today.conditions),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget.elements as any;
    setCity(target.city.value.trim());
  };

  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => fetchWeather(`${coords.latitude},${coords.longitude}`),
      () => setError("Please allow location access")
    );
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const mapConditionToIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes("cloud")) return "☁️";
    if (c.includes("rain")) return "🌧️";
    if (c.includes("clear")) return "☀️";
    if (c.includes("snow")) return "❄️";
    if (c.includes("storm")) return "⛈️";
    if (c.includes("fog")) return "🌫️";
    return "🌡️";
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black flex flex-col items-center justify-center p-8 transition-colors">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Search + Location Bar */}
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-md mx-auto mb-8"
        >
          <input
            name="city"
            defaultValue={city}
            placeholder="Enter city"
            className="flex-1 p-3 rounded-l-xl border-2 border-r-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 outline-none transition-colors"
          />
          <button className="p-3 bg-blue-600 text-white hover:bg-blue-700 transition">
            Search
          </button>
          <button
            type="button"
            onClick={handleLocationFetch}
            className="p-3 bg-green-600 text-white rounded-r-xl hover:bg-green-700 transition ml-2"
          >
            <MapPin size={20} />
          </button>
        </form>

        {/* Error / Loading */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <div className="text-gray-600 dark:text-gray-300 mb-4">Loading…</div>}

        {/* Main Card */}
        {weatherData && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full drop-shadow-lg hover:drop-shadow-2xl transition-shadow duration-300">

            {/* Icon & Temp */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-8xl">{weatherData.icon}</span>
                <span className="text-7xl font-semibold text-gray-900 dark:text-gray-100">
                  {Math.round((weatherData.temperature - 32) * 5/9)}°C
                </span>
              </div>
              <p className="mt-2 text-2xl capitalize text-gray-700 dark:text-gray-300">
                {weatherData.weatherCondition.toLowerCase()}
              </p>
            </div>

            {/* Full Address & Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4 text-center transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {weatherData.resolvedAddress}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4 text-center transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400">Timezone</p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {weatherData.timezone}
                </p>
              </div>
            </div>

            {/* Date & Day */}
            <div className="flex justify-between mb-6 space-x-4">
              {[
                ["Date", formatDate(weatherData.date)],
                ["Day", getWeekday(weatherData.date)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex-1 bg-blue-50 dark:bg-gray-700 rounded-xl p-4 text-center transition-colors"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Pills */}
            <div className="flex justify-center space-x-4 mb-6">
              {[
                ["Feels Like", `${Math.round((weatherData.feelsLike - 32) * 5/9)}°C`],
                ["Humidity", `${weatherData.humidity}%`],
                ["Timezone", weatherData.timezone],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-blue-100 dark:bg-gray-600 text-blue-800 dark:text-gray-200 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                >
                  {label}: {value}
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-center text-gray-700 dark:text-gray-300  font-semibold">
              {weatherData.weatherDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
