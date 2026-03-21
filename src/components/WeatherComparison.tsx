import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';
import { fetchWeatherData, parseCurrentWeather } from '../services/weatherService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Props {
  unit: TemperatureUnit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WeatherComparison = ({ unit, open, onOpenChange }: Props) => {
  const [cities, setCities] = useState<WeatherData[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCity = async () => {
    if (!input.trim() || cities.length >= 3) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(input);
      setCities([...cities, parseCurrentWeather(data)]);
      setInput('');
    } catch {
      setError('City not found. Try another name or spelling.');
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (idx: number) => setCities(cities.filter((_, i) => i !== idx));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[90vh] max-w-[calc(100%-2rem)] flex-col gap-4 overflow-y-auto sm:max-w-4xl"
      >
        <DialogHeader>
          <DialogTitle>Compare cities</DialogTitle>
          <DialogDescription>
            Add up to three locations to compare current conditions side by side.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && addCity()}
            placeholder="Enter city name…"
            disabled={cities.length >= 3}
            className="min-h-9 flex-1"
            aria-invalid={error ? true : undefined}
          />
          <Button
            type="button"
            onClick={addCity}
            disabled={loading || cities.length >= 3 || !input.trim()}
            className="shrink-0 sm:w-auto"
          >
            <Plus data-icon="inline-start" />
            Add
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {cities.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Add cities to compare (max 3).
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cities.map((city, idx) => (
            <Card key={`${city.resolvedAddress}-${idx}`} size="sm" className="relative gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeCity(idx)}
                aria-label={`Remove ${city.resolvedAddress}`}
              >
                <X />
              </Button>
              <CardHeader className="pr-10">
                <CardTitle className="line-clamp-2 text-base leading-snug">
                  {city.resolvedAddress}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-0">
                <div className="text-4xl font-light text-foreground">
                  {convertTemp(city.temperature, unit)}°{unit}
                </div>
                <p className="text-sm text-muted-foreground">{city.weatherCondition}</p>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Feels like</span>
                    <span className="font-medium text-foreground">
                      {convertTemp(city.feelsLike, unit)}°
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Humidity</span>
                    <span className="font-medium text-foreground">{city.humidity}%</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Wind</span>
                    <span className="font-medium text-foreground">
                      {Math.round(city.windSpeed)} mph
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeatherComparison;
