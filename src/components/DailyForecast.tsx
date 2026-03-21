import { DailyForecast as DailyForecastType, TemperatureUnit } from '../types/weather';
import { convertTemp, glassPanel } from '../utils/helpers';
import { cn } from '@/lib/utils';

interface Props {
  forecast: DailyForecastType[];
  unit: TemperatureUnit;
}

const DailyForecast = ({ forecast, unit }: Props) => (
  <div className={cn('rounded-2xl p-6 fade-in', glassPanel)}>
    <h3 className="mb-6 text-sm font-medium tracking-tight text-foreground">
      5-day forecast
    </h3>
    <div className="flex flex-col gap-4">
      {forecast.map((day) => (
        <div
          key={day.date}
          className="-mx-2 flex items-center justify-between rounded-lg border-b border-border py-3 px-2 transition-colors last:border-0 hover:bg-muted/50"
        >
          <span className="w-16 text-sm font-medium text-foreground">{day.day}</span>
          <div className="ml-4 flex flex-1 items-center">
            <span className="mr-4 text-2xl">{day.icon}</span>
            <span className="flex-1 text-sm capitalize text-muted-foreground">
              {day.condition.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {day.precipProb > 0 && (
              <span className="text-xs text-primary">
                💧 {day.precipProb}%
              </span>
            )}
            <div className="flex w-24 items-center justify-end gap-2">
              <span className="text-sm text-muted-foreground">
                {convertTemp(day.tempMin, unit)}°
              </span>
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-400 to-orange-400" />
              <span className="text-sm font-medium text-foreground">
                {convertTemp(day.tempMax, unit)}°
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DailyForecast;
