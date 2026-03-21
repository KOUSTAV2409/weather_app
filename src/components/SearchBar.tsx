import { useState, useEffect, useMemo } from 'react';
import { MapPin, Search, Clock, Star, Globe } from 'lucide-react';
import { getSearchHistory, getFavorites } from '../utils/storage';
import { searchLocations, type GeocodingResult } from '../services/geocodingService';
import { debounce } from '../utils/helpers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DEFAULT_CITY_DISPLAY } from '@/constants/defaults';

interface Props {
  onSearch: (city: string) => void;
  onLocationFetch: () => void;
  defaultValue: string;
  centered?: boolean;
}

const POPULAR_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'London', 'Paris', 'Tokyo', 'Sydney', 'Mumbai',
  'Dubai', 'Singapore', 'Toronto', 'Berlin', 'Madrid',
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
    const trimmed = defaultValue.trim();
    const isCoordinateFormat = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/.test(trimmed) ||
      /^-?\d+\.?\d*°?\s*[NS]?\s*,\s*-?\d+\.?\d*°?\s*[EW]?$/i.test(trimmed);
    if (isCoordinateFormat) return;
    setInput(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setHistory(getSearchHistory());
    setFavorites(getFavorites().map((f) => f.name));
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
      const filtered = POPULAR_CITIES.filter((city) =>
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
    <div className={cn('relative w-full max-w-2xl')}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className={cn(
              'pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white/40',
              centered && 'md:left-5'
            )}
            aria-hidden
          />
          <Input
            id="weather-search"
            name="weather-search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
            aria-label={`Search for a city or place. Suggested: ${DEFAULT_CITY_DISPLAY}.`}
            placeholder="Search city or place..."
            className={cn(
              'w-full border-white/20 bg-white/5 pr-4 text-white shadow-lg shadow-black/20 placeholder:text-white/40',
              'focus-visible:border-white/40 focus-visible:ring-white/25',
              'dark:bg-white/5',
              '!h-auto',
              centered
                ? 'min-h-12 rounded-2xl py-4 pl-12 text-base md:min-h-14 md:pl-14 md:text-lg'
                : 'min-h-10 rounded-xl py-3 pl-11 text-sm'
            )}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size={centered ? 'icon-lg' : 'icon'}
          onClick={onLocationFetch}
          title="Use my location"
          aria-label="Use my current location for weather"
          className={cn(
            'shrink-0 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white',
            centered && 'size-14 rounded-2xl'
          )}
        >
          <MapPin />
        </Button>
      </form>

      {showSuggestions && hasSuggestions && (
        <div
          className={cn(
            'absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border',
            'bg-popover/95 text-popover-foreground shadow-lg backdrop-blur-sm'
          )}
        >
          {apiLoading && (
            <div className="p-3 text-sm text-muted-foreground">Searching…</div>
          )}
          {apiSuggestions.length > 0 && (
            <div className="flex flex-col gap-0 p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground">Locations</p>
              {apiSuggestions.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => selectApiSuggestion(result)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Globe className="shrink-0 text-primary" />
                  <span className="truncate">{result.displayName}</span>
                </button>
              ))}
            </div>
          )}
          {!apiLoading && apiSuggestions.length === 0 && filteredCities.length > 0 && (
            <div className="flex flex-col gap-0 p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground">Popular</p>
              {filteredCities.map((city, i) => (
                <button
                  key={`${city}-${i}`}
                  type="button"
                  onClick={() => selectSuggestion(city)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Globe className="text-primary" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          )}
          {favorites.length > 0 && (
            <div className="flex flex-col gap-0 border-t border-border p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground">Favorites</p>
              {favorites.map((city, i) => (
                <button
                  key={`fav-${city}-${i}`}
                  type="button"
                  onClick={() => selectSuggestion(city)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Star className="fill-amber-400 text-amber-400" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          )}
          {history.length > 0 && (
            <div className="flex flex-col gap-0 border-t border-border p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground">Recent</p>
              {history.map((city, i) => (
                <button
                  key={`hist-${city}-${i}`}
                  type="button"
                  onClick={() => selectSuggestion(city)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Clock className="text-muted-foreground" />
                  <span>{city}</span>
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
