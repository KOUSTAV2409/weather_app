import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudRain,
  Shirt,
  GitCompare,
  Github,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
  MapPin,
  HelpCircle,
  Search,
  MapPin as MapIcon,
} from 'lucide-react';

const VideoPlaceholder = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent">
    {/* Mock app preview */}
    <div className="w-full max-w-[280px] space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 h-11 rounded-xl border border-white/20 flex items-center gap-2 px-3">
          <Search size={16} className="text-white/40" />
          <span className="text-sm text-white/40">Search location...</span>
        </div>
        <div className="h-11 w-11 rounded-xl border border-white/20 flex items-center justify-center">
          <MapIcon size={18} className="text-white/40" />
        </div>
      </div>
      <div className="rounded-2xl border border-white/15 p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-4 w-24 bg-white/20 rounded mb-2" />
            <div className="h-3 w-16 bg-white/10 rounded" />
          </div>
          <span className="text-4xl">☀️</span>
        </div>
        <div className="h-12 w-20 bg-white/25 rounded" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-white/10 rounded" />
          ))}
        </div>
      </div>
    </div>
    <p className="mt-6 text-xs text-white/40">Try the app to see it live</p>
  </div>
);

const LandingPage = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const features = [
    {
      icon: Shirt,
      title: 'Outfit suggestions',
      description:
        'Clothing recommendations based on temperature and conditions.',
    },
    {
      icon: CloudRain,
      title: 'Weather sounds',
      description:
        'Ambient audio that matches the weather—rain, storm, or clear.',
    },
    {
      icon: GitCompare,
      title: 'Compare cities',
      description:
        'Side-by-side comparison of up to 3 cities worldwide.',
    },
    {
      icon: MapPin,
      title: 'Interactive map',
      description:
        'See your location on the map with weather context.',
    },
    {
      icon: Clock,
      title: 'Best time of day',
      description:
        'Find the most comfortable hour to go outside today.',
    },
    {
      icon: TrendingUp,
      title: 'Weather streaks',
      description:
        'Detect patterns like sunny or rainy streaks ahead.',
    },
    {
      icon: Sparkles,
      title: 'Activity suggestions',
      description:
        'Smart recommendations—perfect day for a run or a cozy stay-in.',
    },
    {
      icon: HelpCircle,
      title: 'Weather quiz',
      description:
        'Guess tomorrow\'s temperature and test your weather intuition.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="Our Weather - Home"
          >
            <span className="text-2xl md:text-3xl font-calligraphic text-white/90 group-hover:text-white transition-colors">
              Our Weather
            </span>
          </Link>
          <a
            href="https://github.com/KOUSTAV2409/weather_app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>
        </header>

        {/* Hero - two column: content left, demo video right */}
        <main className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
            {/* Left: Hero content */}
            <div className="max-w-2xl mx-auto lg:mx-0 flex-shrink-0">
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Weather
              </h1>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12 max-w-lg">
                Weather that tells you what to wear, when to run, and plays rain
                sounds when it's raining.
              </p>

              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <span>Try the app</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Right: Demo video or placeholder */}
            <div className="mt-12 lg:mt-0 lg:flex-1 lg:min-w-0 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-gradient-to-br from-white/[0.05] to-transparent aspect-video min-h-[240px]">
                {!videoLoaded && <VideoPlaceholder />}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => setVideoLoaded(true)}
                  onError={() => setVideoLoaded(false)}
                  className={`w-full aspect-video object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100 relative z-10' : 'opacity-0 absolute'}`}
                >
                  <source src="/demo.webm" type="video/webm" />
                  <source src="/demo.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* Features - Grid with dividers */}
          <div className="mt-24 md:mt-32 mb-20 md:mb-28">
            <h2 className="text-sm font-medium tracking-widest uppercase text-white/50 mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group p-6 md:p-8 border-b border-r border-white/10 transition-all duration-300 hover:bg-white/[0.04] hover:shadow-[inset_0_0_30px_rgba(255,255,255,0.03)]"
                >
                  <Icon size={20} className="text-white/60 mb-4" strokeWidth={1.5} />
                  <h3 className="text-base font-semibold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1">
                    {title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">
              Built with{' '}
              <span className="text-white/60">love</span> by{' '}
              <a
                href="https://iamk.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
              >
                Koustav
              </a>
              {' · '}
              React, TypeScript, Tailwind, Zustand
            </p>
            <a
              href="https://github.com/KOUSTAV2409/weather_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              View source on GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
