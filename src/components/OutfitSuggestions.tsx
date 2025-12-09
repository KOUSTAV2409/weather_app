import { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';
import { getOutfitSuggestion } from '../utils/outfitSuggestions';
import { Shirt } from 'lucide-react';

interface Props {
  data: WeatherData;
  unit: TemperatureUnit;
}

const OutfitSuggestions = ({ data, unit }: Props) => {
  const temp = unit === 'C' ? convertTemp(data.temperature, 'C') : data.temperature;
  const { outfit, items } = getOutfitSuggestion(temp, data.weatherCondition);

  return (
    <div className="vercel-card rounded-2xl p-6 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Shirt size={20} className="text-gray-900 dark:text-white" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{outfit}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, idx) => (
          <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-900 dark:text-white">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitSuggestions;
