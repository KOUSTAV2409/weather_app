# Our Weather

A React weather app with forecasts, maps, and a small analytics dashboard. **Live:** [kyweather.vercel.app](https://kyweather.vercel.app/) — **Docs:** [kyweather.vercel.app/docs](https://kyweather.vercel.app/docs) (same route locally: `/docs`).

## Stack

| Layer | Tech |
|--------|------|
| UI | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/) (Radix), Geist font |
| State | Zustand |
| Maps | [mapcn](https://mapcn.dev/) (MapLibre GL, Carto styles) |
| Charts | Recharts (via shadcn `chart`) |
| Routing | React Router |
| Icons | Lucide React |

## Weather data

1. **Visual Crossing** — used when `VITE_WEATHER_API_KEY` is set (with retries + backoff).
2. **Open-Meteo** — fallback: forecast + [Open-Meteo geocoding](https://open-meteo.com/en/docs/geocoding-api); works **without** an API key.

Responses are cached in memory for 10 minutes. Favorites, unit, dark mode, and search history use `localStorage`.

## Features (high level)

- Search (with suggestions), geolocation, favorites, °C/°F, persisted theme  
- Current conditions, hourly strip (from current local hour), multi-day forecast  
- Compare up to three cities (dialog)  
- Map, ambient weather sounds, streaks, quiz, outfit / activity hints  
- Forecast **dashboard**: temperature chart + tables  
- Error boundaries (root + forecast area), shared API error messages  
- Gradient background driven by condition; glass-style panels; accessibility improvements (e.g. live regions, labels)

## Prerequisites

- Node.js 20+ recommended  
- Optional: [Visual Crossing](https://www.visualcrossing.com/) API key for the primary provider  

## Setup

```bash
git clone https://github.com/KOUSTAV2409/weather_app.git
cd weather_app
npm install
```

Create `.env` in the project root (optional):

```env
VITE_WEATHER_API_KEY=your_visual_crossing_key
```

Without the key, Open-Meteo is used.

```bash
npm run dev      # development
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

## Project layout

```
src/
├── components/       # Screens & feature UI (WeatherApp, SearchBar, WeatherCard, …)
├── components/ui/    # shadcn primitives + map (mapcn)
├── hooks/            # useWeather, useGeolocation, useTheme, useFavorites
├── store/            # Zustand weather store
├── services/         # weatherService, openMeteoService, geocoding, weatherApiErrors
├── constants/        # e.g. default city label
├── utils/            # helpers, storage, hourly ordering, etc.
├── App.tsx           # Routes: / landing, /app main app
└── main.tsx
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | `tsc -b` + Vite production build |
| `npm run preview` | Serve `dist` |
| `npm run lint` | Run ESLint |

## Contributing

Issues and pull requests are welcome.

## License

MIT
