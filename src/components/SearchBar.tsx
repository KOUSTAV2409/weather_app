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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            defaultValue={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search city..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onLocationFetch}
          className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          <MapPin size={20} />
        </button>
      </form>

      {showSuggestions && (favorites.length > 0 || history.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-50">
          {favorites.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 font-semibold">
                FAVORITES
              </p>
              {favorites.map((city, i) => (
                <button
                  key={i}
                  onClick={() => selectSuggestion(city)}
                  className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-left"
                >
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-900 dark:text-gray-100">{city}</span>
                </button>
              ))}
            </div>
          )}
          {history.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 font-semibold">
                RECENT
              </p>
              {history.map((city, i) => (
                <button
                  key={i}
                  onClick={() => selectSuggestion(city)}
                  className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-left"
                >
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{city}</span>
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
