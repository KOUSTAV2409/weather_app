import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';
import { fetchWeatherData, parseCurrentWeather } from '../services/weatherService';

interface Props {
  unit: TemperatureUnit;
  onClose: () => void;
}

const WeatherComparison = ({ unit, onClose }: Props) => {
  const [cities, setCities] = useState<WeatherData[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addCity = async () => {
    if (!input.trim() || cities.length >= 3) return;
    setLoading(true);
    try {
      const data = await fetchWeatherData(input);
      setCities([...cities, parseCurrentWeather(data)]);
      setInput('');
    } catch {
      alert('City not found');
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (idx: number) => setCities(cities.filter((_, i) => i !== idx));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Compare Cities</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCity()}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
            disabled={cities.length >= 3}
          />
          <button
            onClick={addCity}
            disabled={loading || cities.length >= 3}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50"
          >
            <Plus size={20} />
          </button>
        </div>

        {cities.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">Add cities to compare (max 3)</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cities.map((city, idx) => (
            <div key={idx} className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 relative">
              <button
                onClick={() => removeCity(idx)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
              >
                <X size={16} className="text-gray-500" />
              </button>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 pr-6">{city.resolvedAddress}</h3>
              <div className="text-4xl font-light text-gray-900 dark:text-white mb-2">
                {convertTemp(city.temperature, unit)}°{unit}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{city.weatherCondition}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Feels Like</span>
                  <span className="text-gray-900 dark:text-white">{convertTemp(city.feelsLike, unit)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Humidity</span>
                  <span className="text-gray-900 dark:text-white">{city.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wind</span>
                  <span className="text-gray-900 dark:text-white">{Math.round(city.windSpeed)} mph</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherComparison;
