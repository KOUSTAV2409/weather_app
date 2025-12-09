import { HourlyWeather, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';
import { Clock } from 'lucide-react';

interface Props {
  hourly: HourlyWeather[];
  unit: TemperatureUnit;
}

const BestTimeOfDay = ({ hourly, unit }: Props) => {
  const getBestTime = () => {
    const dayHours = hourly.filter((_, i) => i >= 6 && i <= 20); // 6 AM to 8 PM
    
    // Find most comfortable temperature (closest to 72°F / 22°C)
    const ideal = unit === 'C' ? 22 : 72;
    const bestTemp = dayHours.reduce((best, curr) => 
      Math.abs(curr.temp - ideal) < Math.abs(best.temp - ideal) ? curr : best
    );
    
    return bestTemp;
  };

  const best = getBestTime();

  return (
    <div className="vercel-card rounded-2xl p-6 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-gray-900 dark:text-white" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Best Time Today</h3>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-light text-gray-900 dark:text-white mb-1">{best.time}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Most comfortable conditions</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-light text-gray-900 dark:text-white">{convertTemp(best.temp, unit)}°{unit}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{best.condition}</p>
        </div>
      </div>
    </div>
  );
};

export default BestTimeOfDay;
