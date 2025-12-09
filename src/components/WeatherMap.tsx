import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

const icon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
}

export default function WeatherMap({ lat, lon, city }: WeatherMapProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">📍 Location</h3>
      <div className="h-64 rounded-xl overflow-hidden">
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lon]} icon={icon}>
            <Popup>{city}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
