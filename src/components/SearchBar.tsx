import { useState, useEffect } from 'react';
import { MapPin, Search, Clock, Star } from 'lucide-react';
import { getSearchHistory, getFavorites } from '../utils/storage';
import { debounce } from '../utils/helpers';

interface Props {
  onSearch: (city: string) => void;
  onLocationFetch: () => void;
  defaultValue: string;
}

const SearchBar = ({ onSearch, onLocationFetch, defaultValue }: Props) => {
  const [input, setInput] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
    setFavorites(getFavorites().map(f => f.name));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = debounce((value: string) => {
    setInput(value);
  }, 300);

  const selectSuggestion = (city: string) => {
    setInput(city);
    onSearch(city);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          <input
            type="text"
            defaultValue={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search location..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-gray-900 dark:focus:border-white outline-none transition-colors text-sm"
          />
        </div>
        <button
          type="button"
          onClick={onLocationFetch}
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:border-gray-900 dark:hover:border-white transition-colors"
        >
          <MapPin size={18} className="text-gray-900 dark:text-white" />
        </button>
      </form>

      {showSuggestions && (favorites.length > 0 || history.length > 0) && (
        <div className="absolute top-full mt-2 w-full vercel-card rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
          {favorites.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 px-3 py-2 font-medium">
                Favorites
              </p>
              {favorites.map((city, i) => (
                <button
                  key={i}
                  onClick={() => selectSuggestion(city)}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors text-left"
                >
                  <Star size={14} className="text-gray-900 dark:text-white fill-current" />
                  <span className="text-sm text-gray-900 dark:text-white">{city}</span>
                </button>
              ))}
            </div>
          )}
          {history.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 px-3 py-2 font-medium">
                Recent
              </p>
              {history.map((city, i) => (
                <button
                  key={i}
                  onClick={() => selectSuggestion(city)}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors text-left"
                >
                  <Clock size={14} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{city}</span>
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
