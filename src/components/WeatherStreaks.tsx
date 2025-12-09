import { DailyForecast } from '../types/weather';
import { TrendingUp } from 'lucide-react';

interface Props {
  forecast: DailyForecast[];
}

const WeatherStreaks = ({ forecast }: Props) => {
  const getStreaks = () => {
    const streaks: string[] = [];
    
    // Check for sunny streak
    const sunnyDays = forecast.filter(d => d.condition.toLowerCase().includes('clear')).length;
    if (sunnyDays >= 3) streaks.push(`☀️ ${sunnyDays} days of sunshine ahead!`);
    
    // Check for rainy streak
    const rainyDays = forecast.filter(d => d.condition.toLowerCase().includes('rain')).length;
    if (rainyDays >= 2) streaks.push(`🌧️ ${rainyDays} rainy days coming`);
    
    // Check for temperature trend
    const temps = forecast.map(d => d.tempMax);
    const increasing = temps.every((t, i) => i === 0 || t >= temps[i - 1]);
    const decreasing = temps.every((t, i) => i === 0 || t <= temps[i - 1]);
    
    if (increasing) streaks.push('🔥 Warming trend detected');
    if (decreasing) streaks.push('❄️ Cooling trend detected');
    
    return streaks;
  };

  const streaks = getStreaks();
  
  if (streaks.length === 0) return null;

  return (
    <div className="vercel-card rounded-2xl p-6 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-gray-900 dark:text-white" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Weather Patterns</h3>
      </div>
      <div className="space-y-2">
        {streaks.map((streak, idx) => (
          <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-900 dark:text-white">{streak}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherStreaks;
