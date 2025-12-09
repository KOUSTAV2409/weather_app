import { HourlyWeather, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';

interface Props {
  hourly: HourlyWeather[];
  unit: TemperatureUnit;
}

const HourlyForecast = ({ hourly, unit }: Props) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl w-full shadow-xl">
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      24-Hour Forecast
    </h3>
    <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin">
      {hourly.map((hour, i) => (
        <div
          key={i}
          className="flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center min-w-[80px] hover:scale-105 transition-transform"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">{hour.time}</p>
          <span className="text-3xl my-2 block">{hour.icon}</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {convertTemp(hour.temp, unit)}°
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default HourlyForecast;
