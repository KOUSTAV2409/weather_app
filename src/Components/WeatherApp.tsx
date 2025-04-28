import { useEffect, useState } from "react";

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

const Weather = () => {
  const [city, setCity] = useState("baikola");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"us" | "metric">("us");

  const apiKey = "4JJZTU8SPZXDWCNT65LW2JATF";

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);

    const apiURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=${unit}&key=${apiKey}&contentType=json`;

    try {
      const response = await fetch(apiURL);
      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      const today = data.days[0];



    //   "This WeatherData interface defines the structure of the weather information we expect from the API — like the address, timezone, temperature, weather conditions, and humidity. It ensures that our app knows exactly what data is coming and prevents errors."
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
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      city: { value: string };
    };
    setCity(target.city.value);
  };

  const handleUnitToggle = () => {
    setUnit(prev => (prev === "us" ? "metric" : "us"));
  };

  const handleLocationFetch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates = `${latitude},${longitude}`;
          fetchWeather(coordinates);
        },
        (error) => {
          setError("Failed to get location. Please allow location access.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, unit]);

  const mapConditionToIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("cloud")) return "☁️";
    if (lower.includes("rain")) return "🌧️";
    if (lower.includes("clear")) return "☀️";
    if (lower.includes("snow")) return "❄️";
    if (lower.includes("storm")) return "⛈️";
    if (lower.includes("fog")) return "🌫️";
    return "🌡️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 flex flex-col items-center justify-center p-8">
      <h2 className="text-center bg-gradient-to-r from-blue-800 to-blue-600 text-white text-5xl font-extrabold p-6 rounded-lg shadow-xl w-full max-w-4xl mb-12">
        Professional Weather Forecast App
      </h2>

      {/* Search & Buttons */}
      <form onSubmit={handleSearch} className="flex gap-4 flex-wrap mb-8 justify-center">
        <input
          type="text"
          name="city"
          className="p-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none w-60"
          placeholder="Enter city name"
          defaultValue={city}
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleLocationFetch}
          className="p-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Use My Location 📍
        </button>
        <button
          type="button"
          onClick={handleUnitToggle}
          className="p-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          Toggle °C / °F
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-xl mb-8">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-2xl font-semibold text-gray-600 mt-12">
          Loading...
        </p>
      ) : weatherData ? (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl mx-auto transition-all transform hover:scale-105">
          {/* Weather Icon */}
          <div className="flex justify-center text-6xl mb-6">
            {weatherData.icon}
          </div>

          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col bg-gray-100 p-6 rounded-xl shadow-md hover:bg-gray-200 transition-colors">
              <p className="text-xl font-semibold text-gray-800">Full Address:</p>
              <p className="text-lg text-gray-700">{weatherData.resolvedAddress}</p>
            </div>
            <div className="flex flex-col bg-gray-100 p-6 rounded-xl shadow-md hover:bg-gray-200 transition-colors">
              <p className="text-xl font-semibold text-gray-800">Timezone:</p>
              <p className="text-lg text-gray-700">{weatherData.timezone}</p>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col bg-gray-100 p-6 rounded-xl shadow-md hover:bg-gray-200 transition-colors">
              <p className="text-xl font-semibold text-gray-800">Date:</p>
              <p className="text-lg text-gray-700">{weatherData.date}</p>
            </div>
            <div className="flex flex-col bg-gray-100 p-6 rounded-xl shadow-md hover:bg-gray-200 transition-colors">
              <p className="text-xl font-semibold text-gray-800">Weather Condition:</p>
              <p className="text-lg text-gray-700">{weatherData.weatherCondition}</p>
            </div>
          </div>

          {/* Extended Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col bg-gray-100 p-6 rounded-xl shadow-md hover:bg-gray-200 transition-colors text-center">
              <p className="text-xl font-semibold text-gray-800">Temperature:</p>
              <p className="text-lg text-gray-700">
                {weatherData.temperature}°{unit === "us" ? "F" : "C"}
              </p>
            </div>
            <div className="flex flex-col bg-gray-100 p-6 rounded-xl shadow-md hover:bg-gray-200 transition-colors text-center">
              <p className="text-xl font-semibold text-gray-800">Feels Like:</p>
              <p className="text-lg text-gray-700">
                {weatherData.feelsLike}°{unit === "us" ? "F" : "C"}
              </p>
            </div>
            <div className="flex flex-col bg-gray-100 p-6 rounded-xl shadow-md hover:bg-gray-200 transition-colors text-center">
              <p className="text-xl font-semibold text-gray-800">Humidity:</p>
              <p className="text-lg text-gray-700">{weatherData.humidity}%</p>
            </div>
          </div>

          {/* Weather Description */}
          <div className="bg-gray-100 p-6 rounded-xl shadow-md hover:bg-gray-200 transition-colors">
            <p className="text-xl font-semibold text-gray-800">Weather Description:</p>
            <p className="text-lg text-gray-700">{weatherData.weatherDescription}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-xl font-semibold text-gray-600 mt-12">
          Enter a city to get the weather information
        </p>
      )}
    </div>
  );
};

export default Weather;
