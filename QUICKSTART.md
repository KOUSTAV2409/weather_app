# 🚀 Quick Start Guide

## Run the App in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
The `.env` file is already created with your API key. If you need to change it:
```bash
# Edit .env file
VITE_WEATHER_API_KEY=your_new_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:5173`

## 🎯 Quick Feature Tour

### Search for Weather
1. Type city name in search bar
2. Press Enter or click Search
3. Or click the location icon for current location

### Add to Favorites
1. Search for a city
2. Click the ⭐ star icon in the weather card
3. Access favorites from search dropdown

### Toggle Temperature Units
- Click the **°C** or **°F** button in the top-right corner
- Switches between Celsius and Fahrenheit

### Enable Dark Mode
- Click the 🌙 moon icon (or ☀️ sun icon) in the top-right corner

### View Forecasts
- **Current Weather**: Main card with detailed metrics
- **24-Hour Forecast**: Scroll horizontally through hourly data
- **5-Day Forecast**: See upcoming weather at a glance

## 📱 Mobile View
The app is fully responsive! Try it on your phone or resize your browser window.

## 🔧 Build for Production
```bash
npm run build
npm run preview
```

## 🐛 Troubleshooting

### API Key Issues
- Make sure `.env` file exists in root directory
- Restart dev server after changing `.env`

### City Not Found
- Check spelling
- Try adding country name (e.g., "Paris, France")
- Use coordinates for precise locations

### Location Access Denied
- Allow location permissions in your browser
- Or manually search for your city

## 📚 Learn More
- See `IMPROVEMENTS.md` for full list of features
- See `README.md` for detailed documentation

Enjoy your upgraded weather app! 🌤️
