import { useState } from 'react';
import { DailyForecast, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';
import { HelpCircle } from 'lucide-react';

interface Props {
  forecast: DailyForecast[];
  unit: TemperatureUnit;
}

const WeatherQuiz = ({ forecast, unit }: Props) => {
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);

  if (forecast.length === 0) return null;

  const tomorrow = forecast[0];
  const answer = convertTemp(tomorrow.tempMax, unit);

  const handleReveal = () => {
    setRevealed(true);
    const userGuess = parseInt(guess);
    const diff = Math.abs(userGuess - answer);
    
    if (diff === 0) alert('🎯 Perfect! You nailed it!');
    else if (diff <= 3) alert('🔥 Very close!');
    else if (diff <= 5) alert('👍 Not bad!');
    else alert(`❌ The answer was ${answer}°${unit}`);
  };

  return (
    <div className="vercel-card rounded-2xl p-6 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle size={20} className="text-gray-900 dark:text-white" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Weather Quiz</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Guess tomorrow's high temperature in {tomorrow.day}
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder={`Enter temp in °${unit}`}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
          disabled={revealed}
        />
        <button
          onClick={handleReveal}
          disabled={!guess || revealed}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50"
        >
          Reveal
        </button>
      </div>
      {revealed && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
          <p className="text-sm text-green-900 dark:text-green-300">
            Tomorrow's high: {answer}°{unit}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherQuiz;
