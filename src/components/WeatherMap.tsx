import { useEffect, useState } from 'react';
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/map';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
  /** Sync with app dark mode so Carto basemap matches the UI */
  theme?: 'light' | 'dark';
}

export default function WeatherMap({ lat, lon, city, theme }: WeatherMapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(false);
  }, [lat, lon, theme]);

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-card/30'
      )}
    >
      <h3 className="mb-3 text-lg font-semibold text-white">📍 Location</h3>
      <div className="relative h-64 overflow-hidden rounded-xl border border-white/10">
        {!mapReady && (
          <Skeleton
            className="absolute inset-0 z-[5] min-h-64 rounded-xl"
            aria-hidden
          />
        )}
        <Map
          className="min-h-64 rounded-xl"
          center={[lon, lat]}
          zoom={10}
          theme={theme}
          onMapReady={() => setMapReady(true)}
        >
          <MapControls
            position="bottom-right"
            className={
              theme === 'dark'
                ? 'z-30 !bottom-3 !right-3 [&>div]:border-white/25 [&>div]:bg-white [&>div]:shadow-lg [&>div]:ring-1 [&>div]:ring-white/40 [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:text-zinc-900 [&_button]:hover:bg-zinc-100 [&_svg]:text-zinc-900'
                : 'z-30 !bottom-3 !right-3 [&>div]:border-zinc-300 [&>div]:bg-white [&>div]:shadow-lg [&>div]:ring-1 [&>div]:ring-black/10 [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:text-zinc-900 [&_button]:hover:bg-zinc-100 [&_svg]:text-zinc-900'
            }
          />
          <MapMarker longitude={lon} latitude={lat}>
            <MarkerContent />
            <MarkerPopup className="max-w-xs border-white/20 bg-black/90 text-white">
              <p className="text-sm font-medium">{city}</p>
            </MarkerPopup>
          </MapMarker>
        </Map>
      </div>
    </div>
  );
}
