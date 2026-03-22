import { useLayoutEffect, useMemo, useRef } from 'react';
import { HourlyWeather, TemperatureUnit } from '../types/weather';
import { convertTemp, glassPanel } from '../utils/helpers';
import { orderHourlyFromCurrentHour } from '../utils/hourlyOrder';
import { cn } from '@/lib/utils';

interface Props {
  hourly: HourlyWeather[];
  unit: TemperatureUnit;
  /** IANA timezone from the weather API (e.g. America/New_York) */
  timeZone: string;
}

const HourlyForecast = ({ hourly, unit, timeZone }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ordered = useMemo(
    () => orderHourlyFromCurrentHour(hourly, timeZone),
    [hourly, timeZone]
  );

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = 0;
  }, [ordered, timeZone]);

  return (
    <div className={cn('rounded-2xl p-6 fade-in', glassPanel)}>
      <h3 className="mb-6 text-sm font-medium tracking-tight text-foreground">
        Next 24 hours
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          (from current hour)
        </span>
      </h3>
      <div
        ref={scrollRef}
        className="scrollbar-thin flex gap-6 overflow-x-auto pb-2"
      >
        {ordered.map((hour) => (
          <div
            key={`${hour.time}-${hour.condition}`}
            className="group min-w-[60px] shrink-0 text-center"
          >
            <p className="mb-3 text-xs text-muted-foreground">{hour.time}</p>
            <span className="mb-3 block text-3xl transition-transform group-hover:scale-110">
              {hour.icon}
            </span>
            <p className="text-sm font-medium text-foreground">
              {convertTemp(hour.temp, unit)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
