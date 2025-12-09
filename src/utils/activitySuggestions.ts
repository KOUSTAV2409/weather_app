import { WeatherData } from '../types/weather';

export const getActivitySuggestion = (weather: WeatherData): string => {
  const temp = weather.temperature;
  const condition = weather.weatherCondition.toLowerCase();
  const uvIndex = weather.uvIndex;
  const windSpeed = weather.windSpeed;

  if (condition.includes('rain')) return '☔ Bring an umbrella!';
  if (condition.includes('snow')) return '⛷️ Perfect for winter sports!';
  if (condition.includes('storm')) return '🏠 Stay indoors and cozy up!';
  if (temp > 85) return '🏊 Great day for swimming!';
  if (temp > 70 && temp <= 85 && !condition.includes('cloud')) return '🏃 Perfect day for a run!';
  if (temp >= 60 && temp <= 75 && uvIndex < 6) return '🚴 Ideal for cycling!';
  if (temp < 40) return '🧥 Bundle up, it\'s cold!';
  if (uvIndex > 7) return '🕶️ High UV - wear sunscreen!';
  if (windSpeed > 20) return '🪁 Great for flying kites!';
  if (condition.includes('clear') && temp > 65) return '🌳 Perfect for a picnic!';
  return '🌤️ Enjoy your day!';
};
