export const getFeelsLikeInsight = (temp: number, feelsLike: number, humidity: number, windSpeed: number): string => {
  const diff = Math.abs(temp - feelsLike);
  
  if (diff < 3) return 'Temperature matches how it feels';
  
  if (feelsLike < temp) {
    if (windSpeed > 15) return 'Wind chill makes it feel colder';
    return 'Feels cooler than actual temperature';
  }
  
  if (feelsLike > temp) {
    if (humidity > 70) return 'High humidity makes it feel muggy';
    return 'Feels warmer than actual temperature';
  }
  
  return '';
};
