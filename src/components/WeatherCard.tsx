import { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemp, formatDate, getWeekday, getWeatherIconClass, glassPanel } from '../utils/helpers';
import { getActivitySuggestion } from '../utils/activitySuggestions';
import { Star } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Props {
  data: WeatherData;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const WeatherCard = ({ data, unit, isFavorite, onToggleFavorite }: Props) => (
  <Card className={cn('fade-in border-border/80', glassPanel)}>
    <CardHeader className="border-border border-b pb-4">
      <CardTitle className="text-2xl font-medium tracking-tight">
        {data.resolvedAddress}
      </CardTitle>
      <CardDescription>
        {formatDate(data.date)} · {getWeekday(data.date)}
      </CardDescription>
      <CardAction>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={cn(isFavorite && 'fill-primary text-primary')}
          />
        </Button>
      </CardAction>
    </CardHeader>

    <CardContent className="flex flex-col gap-8 pt-6">
      <div className="flex flex-wrap items-end gap-2">
        <span className="text-8xl font-light tracking-tighter text-foreground">
          {convertTemp(data.temperature, unit)}°
        </span>
        <span className="mb-3 text-3xl font-light text-muted-foreground">{unit}</span>
        <span
          className={cn('mb-2 ml-4 text-6xl sm:ml-8', getWeatherIconClass(data.weatherCondition))}
        >
          {data.icon}
        </span>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-3">
        <p className="text-sm font-medium text-foreground">{getActivitySuggestion(data)}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium capitalize text-foreground">
          {data.weatherCondition.toLowerCase()}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{data.weatherDescription}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['Feels Like', `${convertTemp(data.feelsLike, unit)}°`],
          ['Humidity', `${data.humidity}%`],
          ['Wind', `${Math.round(data.windSpeed)} mph`],
          ['UV Index', data.uvIndex.toString()],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['Pressure', `${Math.round(data.pressure)} mb`],
          ['Visibility', `${Math.round(data.visibility)} mi`],
          ['Sunrise', data.sunrise],
          ['Sunset', data.sunset],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default WeatherCard;
