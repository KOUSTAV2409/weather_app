import { DailyForecast as DailyForecastType, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';

interface Props {
  forecast: DailyForecastType[];
  unit: TemperatureUnit;
}

const DailyForecast = ({ forecast, unit }: Props) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl w-full shadow-xl">
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      5-Day Forecast
    </h3>
    <div className="space-y-3">
      {forecast.map((day, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 hover:scale-[1.02] transition-transform"
        >
          <span className="font-semibold text-gray-900 dark:text-gray-100 w-16">
            {day.day}
          </span>
          <span className="text-3xl">{day.icon}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 text-center capitalize">
            {day.condition.toLowerCase()}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-400">
              {convertTemp(day.tempMin, unit)}°
            </span>
            <div className="w-20 h-2 bg-gradient-to-r from-blue-300 to-red-300 rounded-full" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {convertTemp(day.tempMax, unit)}°
            </span>
          </div>
          {day.precipProb > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
              💧 {day.precipProb}%
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default DailyForecast;
