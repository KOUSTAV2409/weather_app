import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/map';

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
  /** Sync with app dark mode so Carto basemap matches the UI */
  theme?: 'light' | 'dark';
}

export default function WeatherMap({ lat, lon, city, theme }: WeatherMapProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">📍 Location</h3>
      <div className="h-64 rounded-xl overflow-hidden border border-white/10">
        <Map
          className="min-h-64 rounded-xl"
          center={[lon, lat]}
          zoom={10}
          theme={theme}
        >
          <MapControls
            position="bottom-right"
            className={
              theme === 'dark'
                ? 'z-30 !bottom-3 !right-3 [&>div]:border-white/25 [&>div]:bg-white [&>div]:shadow-lg [&>div]:ring-1 [&>div]:ring-white/40 [&_button]:min-h-10 [&_button]:min-w-10 [&_button]:text-zinc-900 [&_button]:hover:bg-zinc-100 [&_svg]:text-zinc-900'
                : 'z-30 !bottom-3 !right-3 [&>div]:border-zinc-300 [&>div]:bg-white [&>div]:shadow-lg [&>div]:ring-1 [&>div]:ring-black/10 [&_button]:min-h-10 [&_button]:min-w-10 [&_button]:text-zinc-900 [&_button]:hover:bg-zinc-100 [&_svg]:text-zinc-900'
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
