import { useEffect, useState } from "react"

const Weather = () => {
  const [city, setCity] = useState("baikola")  // Default city
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=4JJZTU8SPZXDWCNT65LW2JATF&contentType=json`

  // Fetch weather data whenever the city or API URL changes
  useEffect(() => {
    async function fetchWeather() {
      setLoading(true)
      setError(null) // Clear previous errors

      try {
        const response = await fetch(apiURL)
        if (!response.ok) throw new Error("City not found")

        const data = await response.json()
        setWeatherData({
          resolvedAddress: data.resolvedAddress,
          timezone: data.timezone,
          date: data.days[0].datetime,
          weatherCondition: data.days[0].conditions,
          weatherDescription: data.days[0].description,
        })
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [city])

  const handleSearch = (event) => {
    event.preventDefault()
    setCity(event.target.city.value) // Update the city from input
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 flex flex-col items-center justify-center p-8">
      <h2 className="text-center bg-gradient-to-r from-blue-800 to-blue-600 text-white text-5xl font-extrabold p-6 rounded-lg shadow-xl w-full max-w-4xl mb-12">
        Professional Weather Forecast App
      </h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <input
          type="text"
          name="city"
          className="p-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          placeholder="Enter city name"
          defaultValue={city}
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-xl mb-8">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-center text-2xl font-semibold text-gray-600 mt-12">Loading...</p>
      ) : weatherData ? (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl mx-auto transition-all transform hover:scale-105">
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
  )
}

export default Weather
