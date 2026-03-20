import { useState, useEffect, useMemo } from 'react';
import { MapPin, Search, Clock, Star, Globe } from 'lucide-react';
import { getSearchHistory, getFavorites } from '../utils/storage';
import { searchLocations, type GeocodingResult } from '../services/geocodingService';
import { debounce } from '../utils/helpers';

interface Props {
  onSearch: (city: string) => void;
  onLocationFetch: () => void;
  defaultValue: string;
  centered?: boolean;
}

// Popular cities for quick suggestions when API returns nothing
const POPULAR_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'London', 'Paris', 'Tokyo', 'Sydney', 'Mumbai',
  'Dubai', 'Singapore', 'Toronto', 'Berlin', 'Madrid'
];

const SearchBar = ({ onSearch, onLocationFetch, defaultValue, centered = false }: Props) => {
  const [input, setInput] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [apiSuggestions, setApiSuggestions] = useState<GeocodingResult[]>([]);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    // Don't overwrite with lat,lon - keep the human-readable display name from geocoding
    const trimmed = defaultValue.trim();
    const isCoordinateFormat = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/.test(trimmed) ||
      /^-?\d+\.?\d*°?\s*[NS]?\s*,\s*-?\d+\.?\d*°?\s*[EW]?$/i.test(trimmed);
    if (isCoordinateFormat) return;
    setInput(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setHistory(getSearchHistory());
    setFavorites(getFavorites().map(f => f.name));
  }, []);

  const fetchLocations = useMemo(
    () =>
      debounce(async (query: unknown) => {
        const q = String(query ?? '');
        if (q.length < 2) {
          setApiSuggestions([]);
          return;
        }
        if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(q.trim())) {
          setApiSuggestions([]);
          return;
        }
        setApiLoading(true);
        try {
          const results = await searchLocations(q);
          setApiSuggestions(results);
        } catch {
          setApiSuggestions([]);
        } finally {
          setApiLoading(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    const trimmed = input.trim();
    if (trimmed.length >= 2) {
      fetchLocations(trimmed);
    } else {
      setApiSuggestions([]);
    }
  }, [input, fetchLocations]);

  useEffect(() => {
    if (input.trim().length >= 2 && apiSuggestions.length === 0 && !apiLoading) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 5);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [input, apiSuggestions.length, apiLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (city: string) => {
    setInput(city);
    onSearch(city);
    setShowSuggestions(false);
  };

  const selectApiSuggestion = (result: GeocodingResult) => {
    setInput(result.displayName);
    onSearch(result.query);
    setShowSuggestions(false);
  };

  const hasSuggestions =
    apiSuggestions.length > 0 ||
    filteredCities.length > 0 ||
    favorites.length > 0 ||
    history.length > 0;

  return (
    <div className={`relative w-full ${centered ? 'max-w-2xl' : 'max-w-2xl'}`}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/40 ${centered ? 'md:left-5' : ''}`}
            size={centered ? 22 : 18}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search city or place..."
            className={`w-full pl-11 pr-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 ${
              centered
                ? 'py-4 md:py-5 text-base md:text-lg pl-12 md:pl-14 rounded-2xl shadow-lg shadow-black/20'
                : 'py-3.5 text-sm'
            }`}
          />
        </div>
        <button
          type="button"
          onClick={onLocationFetch}
          className={`border border-white/20 rounded-xl bg-white/5 hover:border-white/40 hover:bg-white/10 transition-all duration-200 ${
            centered ? 'p-4 md:p-5 rounded-2xl' : 'p-3.5'
          }`}
          title="Use my location"
        >
          <MapPin size={centered ? 22 : 18} className="text-white/80" />
        </button>
      </form>

      {showSuggestions && hasSuggestions && (
        <div className="absolute top-full mt-2 w-full bg-black/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
          {apiLoading && (
            <div className="p-3 text-sm text-white/50">
              Searching...
            </div>
          )}
          {apiSuggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-white/50 px-3 py-2 font-medium">
                Locations
              </p>
              {apiSuggestions.map((result) => (
                <button
                  key={result.id}
                  onClick={() => selectApiSuggestion(result)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <Globe size={14} className="text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-white truncate">
                    {result.displayName}
                  </span>
                </button>
              ))}
            </div>
          )}
          {!apiLoading && apiSuggestions.length === 0 && filteredCities.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-white/50 px-3 py-2 font-medium">
                Popular
              </p>
              {filteredCities.map((city, i) => (
                <button
                  key={`${city}-${i}`}
                  onClick={() => selectSuggestion(city)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <Globe size={14} className="text-blue-400" />
                  <span className="text-sm text-white">{city}</span>
                </button>
              ))}
            </div>
          )}
          {favorites.length > 0 && (
            <div className="p-2 border-t border-white/10">
              <p className="text-xs text-white/50 px-3 py-2 font-medium">
                Favorites
              </p>
              {favorites.map((city, i) => (
                <button
                  key={`fav-${city}-${i}`}
                  onClick={() => selectSuggestion(city)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm text-white">{city}</span>
                </button>
              ))}
            </div>
          )}
          {history.length > 0 && (
            <div className="p-2 border-t border-white/10">
              <p className="text-xs text-white/50 px-3 py-2 font-medium">
                Recent
              </p>
              {history.map((city, i) => (
                <button
                  key={`hist-${city}-${i}`}
                  onClick={() => selectSuggestion(city)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <Clock size={14} className="text-white/40" />
                  <span className="text-sm text-white">{city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
