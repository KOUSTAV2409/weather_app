import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ExternalLink, Github } from 'lucide-react';

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'stack', label: 'Tech stack' },
  { id: 'getting-started', label: 'Getting started' },
  { id: 'weather-data', label: 'Weather data' },
  { id: 'features', label: 'Features' },
  { id: 'structure', label: 'Project structure' },
  { id: 'environment', label: 'Environment' },
  { id: 'links', label: 'Links' },
] as const;

const DocsPage = () => {
  return (
    <div className="min-h-screen bg-black font-sans text-white antialiased">
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative">
        <header className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12">
          <Link
            to="/"
            className="font-calligraphic text-2xl text-white/90 transition-colors hover:text-white"
          >
            Our Weather
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-white/80">
              <BookOpen className="mr-1.5 inline size-4 -translate-y-px" aria-hidden />
              Documentation
            </span>
            <Link
              to="/app"
              className="text-white/60 transition-colors hover:text-white"
            >
              App
            </Link>
            <a
              href="https://github.com/KOUSTAV2409/weather_app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
            >
              <Github size={16} />
              GitHub
            </a>
          </nav>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:flex-row md:gap-16 lg:px-12 lg:py-14">
          <aside className="shrink-0 md:w-44 lg:w-52">
            <p className="mb-3 text-xs font-medium tracking-widest text-white/40 uppercase">
              On this page
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {sections.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-white/55 transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <article className="min-w-0 flex-1">
            <h1
              className="mb-2 text-3xl font-light tracking-tight md:text-4xl"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Documentation
            </h1>
            <p className="mb-10 max-w-2xl text-lg text-white/55">
              How Our Weather is built, how to run it locally, and where weather data comes from.
            </p>

            <div className="flex flex-col gap-12 text-[15px] leading-relaxed text-white/75">
              <section id="overview" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-medium text-white">Overview</h2>
                <p className="mb-3">
                  <strong className="text-white/90">Our Weather</strong> is a client-side React app for
                  current conditions, hourly and daily forecasts, maps, city comparison, and a small
                  forecast dashboard (charts and tables). The UI uses Tailwind CSS and{' '}
                  <a
                    href="https://ui.shadcn.com/"
                    className="text-white/90 underline underline-offset-2 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    shadcn/ui
                  </a>
                  ; maps use{' '}
                  <a
                    href="https://mapcn.dev/"
                    className="text-white/90 underline underline-offset-2 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mapcn
                  </a>{' '}
                  (MapLibre).
                </p>
                <p>
                  <strong className="text-white/90">Live:</strong>{' '}
                  <a
                    href="https://kyweather.vercel.app/"
                    className="inline-flex items-center gap-1 text-white/90 underline underline-offset-2 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    kyweather.vercel.app
                    <ExternalLink className="size-3.5 opacity-70" />
                  </a>
                </p>
              </section>

              <section id="stack" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-medium text-white">Tech stack</h2>
                <ul className="list-inside list-disc space-y-2">
                  <li>React 19, TypeScript, Vite 6</li>
                  <li>Tailwind CSS 4, shadcn/ui (Radix), Geist font</li>
                  <li>Zustand for global state (weather, preferences, favorites)</li>
                  <li>React Router (landing, app, docs)</li>
                  <li>Recharts (via shadcn chart) for the forecast dashboard</li>
                  <li>Lucide React for icons</li>
                </ul>
              </section>

              <section id="getting-started" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-medium text-white">Getting started</h2>
                <ol className="list-inside list-decimal space-y-3">
                  <li>
                    Clone the repo and install dependencies:
                    <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-white/85">
                      git clone https://github.com/KOUSTAV2409/weather_app.git{'\n'}
                      cd weather_app{'\n'}
                      npm install
                    </pre>
                  </li>
                  <li>
                    (Optional) Create <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">.env</code>{' '}
                    with{' '}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">
                      VITE_WEATHER_API_KEY
                    </code>{' '}
                    for Visual Crossing. Without it, Open-Meteo is used.
                  </li>
                  <li>
                    Run the dev server:
                    <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-white/85">
                      npm run dev
                    </pre>
                  </li>
                  <li>
                    Open <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">/app</code> for the
                    weather UI, or <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">/</code> for
                    the landing page.
                  </li>
                </ol>
                <p className="mt-4">
                  Production build: <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">npm run build</code>
                  , preview: <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">npm run preview</code>.
                </p>
              </section>

              <section id="weather-data" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-medium text-white">Weather data</h2>
                <p className="mb-3">
                  The app tries <strong className="text-white/90">Visual Crossing</strong> first when an API
                  key is set (with retries). It falls back to{' '}
                  <strong className="text-white/90">Open-Meteo</strong> for forecast and geocoding, so the app
                  works without a key. Responses are cached in memory for about 10 minutes.
                </p>
                <p>
                  Favorites, temperature unit, dark mode, and search history are stored in{' '}
                  <strong className="text-white/90">localStorage</strong>.
                </p>
              </section>

              <section id="features" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-medium text-white">Features</h2>
                <ul className="list-inside list-disc space-y-2">
                  <li>Search with location suggestions, geolocation, favorites, °C/°F</li>
                  <li>Current conditions, hourly strip (from current local hour), multi-day forecast</li>
                  <li>Compare up to three cities in a dialog</li>
                  <li>Map (MapLibre), weather sounds, streaks, quiz, outfit and activity hints</li>
                  <li>Forecast dashboard: charts and tables</li>
                  <li>Weather-based page backgrounds, glass-style panels, error boundaries</li>
                </ul>
              </section>

              <section id="structure" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-medium text-white">Project structure</h2>
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-white/85">
                  {`src/
├── components/       # Pages & feature UI
├── components/ui/      # shadcn components + map (mapcn)
├── hooks/            # useWeather, useGeolocation, useTheme, useFavorites
├── store/            # Zustand store
├── services/         # Weather APIs, geocoding, shared errors
├── constants/        # App defaults
├── utils/            # Helpers, storage, hourly ordering
├── App.tsx           # Routes
└── main.tsx`}
                </pre>
              </section>

              <section id="environment" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-medium text-white">Environment</h2>
                <table className="w-full min-w-[280px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/15">
                      <th className="py-2 pr-4 font-medium text-white/90">Variable</th>
                      <th className="py-2 font-medium text-white/90">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-white/10">
                      <td className="py-2 pr-4 font-mono text-xs">VITE_WEATHER_API_KEY</td>
                      <td className="py-2">Visual Crossing API key (optional)</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section id="links" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-medium text-white">Links</h2>
                <ul className="list-inside list-disc space-y-2">
                  <li>
                    <a
                      href="https://kyweather.vercel.app/"
                      className="text-white/90 underline underline-offset-2 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live app
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/KOUSTAV2409/weather_app"
                      className="text-white/90 underline underline-offset-2 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub repository
                    </a>
                  </li>
                </ul>
              </section>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-white/10 pt-10">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white hover:text-black"
              >
                Open the app
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/"
                className="text-sm text-white/50 transition-colors hover:text-white"
              >
                ← Back to home
              </Link>
            </div>
          </article>
        </div>

        <footer className="border-t border-white/10 px-6 py-6 md:px-12">
          <p className="text-xs text-white/40">
            MIT License ·{' '}
            <a
              href="https://github.com/KOUSTAV2409/weather_app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70"
            >
              Source
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DocsPage;
