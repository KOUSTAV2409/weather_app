import { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemp, formatDate, getWeekday, getWindDirection } from '../utils/helpers';
import { Star } from 'lucide-react';

interface Props {
  data: WeatherData;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const WeatherCard = ({ data, unit, isFavorite, onToggleFavorite }: Props) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full shadow-2xl hover:shadow-3xl transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {data.resolvedAddress}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{data.timezone}</p>
      </div>
      <button
        onClick={onToggleFavorite}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <Star
          size={24}
          className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
        />
      </button>
    </div>

    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center space-x-4">
        <span className="text-8xl">{data.icon}</span>
        <span className="text-7xl font-semibold text-gray-900 dark:text-gray-100">
          {convertTemp(data.temperature, unit)}°{unit}
        </span>
      </div>
      <p className="mt-2 text-2xl capitalize text-gray-700 dark:text-gray-300">
        {data.weatherCondition.toLowerCase()}
      </p>
      <p className="text-gray-600 dark:text-gray-400 mt-1">{data.weatherDescription}</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        ['Feels Like', `${convertTemp(data.feelsLike, unit)}°${unit}`],
        ['Humidity', `${data.humidity}%`],
        ['Wind', `${Math.round(data.windSpeed)} mph ${getWindDirection(data.windDirection)}`],
        ['Pressure', `${Math.round(data.pressure)} mb`],
        ['Visibility', `${Math.round(data.visibility)} mi`],
        ['UV Index', data.uvIndex.toString()],
        ['Sunrise', data.sunrise],
        ['Sunset', data.sunset],
      ].map(([label, value]) => (
        <div
          key={label}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center transition-all hover:scale-105"
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      ))}
    </div>

    <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
      <span>{formatDate(data.date)}</span>
      <span>•</span>
      <span>{getWeekday(data.date)}</span>
    </div>
  </div>
);

export default WeatherCard;
