import { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemp, formatDate, getWeekday } from '../utils/helpers';
import { Star } from 'lucide-react';

interface Props {
  data: WeatherData;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const WeatherCard = ({ data, unit, isFavorite, onToggleFavorite }: Props) => (
  <div className="vercel-card rounded-2xl p-8 fade-in">
    <div className="flex justify-between items-start mb-12">
      <div>
        <h2 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white mb-1">
          {data.resolvedAddress}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(data.date)} · {getWeekday(data.date)}</p>
      </div>
      <button
        onClick={onToggleFavorite}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
      >
        <Star
          size={20}
          className={isFavorite ? 'fill-black dark:fill-white text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}
        />
      </button>
    </div>

    <div className="flex items-end mb-12">
      <span className="text-8xl font-light tracking-tighter text-gray-900 dark:text-white">
        {convertTemp(data.temperature, unit)}°
      </span>
      <span className="text-3xl font-light text-gray-500 dark:text-gray-400 mb-3 ml-2">{unit}</span>
      <span className="text-6xl ml-8 mb-2">{data.icon}</span>
    </div>

    <div className="mb-8">
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-1 capitalize">
        {data.weatherCondition.toLowerCase()}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {data.weatherDescription}
      </p>
    </div>

    <div className="grid grid-cols-4 gap-4 mb-6">
      {[
        ['Feels Like', `${convertTemp(data.feelsLike, unit)}°`],
        ['Humidity', `${data.humidity}%`],
        ['Wind', `${Math.round(data.windSpeed)} mph`],
        ['UV Index', data.uvIndex.toString()],
      ].map(([label, value]) => (
        <div key={label} className="border-l border-gray-300 dark:border-gray-700 pl-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
      {[
        ['Pressure', `${Math.round(data.pressure)} mb`],
        ['Visibility', `${Math.round(data.visibility)} mi`],
        ['Sunrise', data.sunrise],
        ['Sunset', data.sunset],
      ].map(([label, value]) => (
        <div key={label}>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
        </div>
      ))}
    </div>
  </div>
);

export default WeatherCard;
