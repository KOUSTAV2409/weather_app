# 🌤️ Advanced Weather App

A modern, feature-rich weather application built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### Core Features
- **Real-time Weather Data** - Current weather conditions with detailed metrics
- **5-Day Forecast** - Extended weather predictions
- **24-Hour Forecast** - Hourly weather breakdown
- **Location Services** - Get weather for your current location
- **Search Functionality** - Search any city worldwide

### Advanced Features
- **Favorites System** - Save frequently checked cities
- **Search History** - Quick access to recent searches
- **Temperature Units** - Toggle between Celsius and Fahrenheit
- **Dark Mode** - Eye-friendly dark theme
- **Dynamic Backgrounds** - Weather-based gradient backgrounds
- **Responsive Design** - Works seamlessly on all devices

### Weather Metrics
- Temperature & Feels Like
- Humidity & Pressure
- Wind Speed & Direction
- UV Index
- Visibility
- Sunrise & Sunset Times

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Weather API key from [Visual Crossing](https://www.visualcrossing.com/)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd weather_app
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Add your API key to `.env`
```
VITE_WEATHER_API_KEY=your_api_key_here
```

5. Start development server
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── WeatherCard.tsx
│   ├── HourlyForecast.tsx
│   ├── DailyForecast.tsx
│   ├── SearchBar.tsx
│   └── LoadingSkeleton.tsx
├── Components/          # Main app component
│   └── WeatherApp.tsx
├── services/           # API services
│   └── weatherService.ts
├── types/              # TypeScript types
│   └── weather.ts
├── utils/              # Utility functions
│   ├── helpers.ts
│   └── storage.ts
└── App.tsx
```

## 🎨 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons
- **Visual Crossing API** - Weather data

## 🔧 Configuration

### Environment Variables
- `VITE_WEATHER_API_KEY` - Your Visual Crossing API key

### Build for Production
```bash
npm run build
npm run preview
```

## 📱 Features in Detail

### Caching
API responses are cached for 10 minutes to reduce unnecessary requests and improve performance.

### Local Storage
- Favorites are persisted across sessions
- Search history (last 10 searches)
- Temperature unit preference

### Error Handling
- Graceful error messages
- Retry logic for failed requests
- Geolocation permission handling

## 🎯 Future Enhancements

- [ ] Weather alerts and warnings
- [ ] Air quality index
- [ ] Weather maps
- [ ] Share weather functionality
- [ ] PWA support for offline access
- [ ] Animated weather icons
- [ ] Multiple location comparison

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
