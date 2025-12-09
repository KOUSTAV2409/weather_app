import { DailyForecast as DailyForecastType, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';

interface Props {
  forecast: DailyForecastType[];
  unit: TemperatureUnit;
}

const DailyForecast = ({ forecast, unit }: Props) => (
  <div className="vercel-card rounded-2xl p-6 fade-in">
    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-6 tracking-tight">
      5-Day Forecast
    </h3>
    <div className="space-y-4">
      {forecast.map((day, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900 -mx-2 px-2 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium text-gray-900 dark:text-white w-16">
            {day.day}
          </span>
          <div className="flex items-center flex-1 ml-4">
            <span className="text-2xl mr-4">{day.icon}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize flex-1">
              {day.condition.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {day.precipProb > 0 && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                💧 {day.precipProb}%
              </span>
            )}
            <div className="flex items-center space-x-2 w-24 justify-end">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {convertTemp(day.tempMin, unit)}°
              </span>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {convertTemp(day.tempMax, unit)}°
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DailyForecast;
