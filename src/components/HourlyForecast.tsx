import { HourlyWeather, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';

interface Props {
  hourly: HourlyWeather[];
  unit: TemperatureUnit;
}

const HourlyForecast = ({ hourly, unit }: Props) => (
  <div className="vercel-card rounded-2xl p-6 fade-in">
    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-6 tracking-tight">
      Next 24 Hours
    </h3>
    <div className="flex overflow-x-auto space-x-6 pb-2 scrollbar-thin">
      {hourly.map((hour, i) => (
        <div
          key={i}
          className="flex-shrink-0 text-center min-w-[60px] group"
        >
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{hour.time}</p>
          <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{hour.icon}</span>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {convertTemp(hour.temp, unit)}°
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default HourlyForecast;
