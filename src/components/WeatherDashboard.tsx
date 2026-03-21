import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DailyForecast, HourlyWeather, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/helpers';

interface Props {
  hourly: HourlyWeather[];
  daily: DailyForecast[];
  unit: TemperatureUnit;
}

const unitSuffix = (u: TemperatureUnit) => `°${u}`;

function WeatherDashboard({ hourly, daily, unit }: Props) {
  const hourlyChart = useMemo(
    () =>
      hourly.map((h) => ({
        time: h.time,
        temp: convertTemp(h.temp, unit),
      })),
    [hourly, unit]
  );

  const dailyChart = useMemo(
    () =>
      daily.map((d) => ({
        day: d.day,
        max: convertTemp(d.tempMax, unit),
        min: convertTemp(d.tempMin, unit),
      })),
    [daily, unit]
  );

  const chartConfig = {
    temp: {
      label: `Temperature (${unitSuffix(unit)})`,
      color: 'var(--chart-1)',
    },
    max: {
      label: `High (${unitSuffix(unit)})`,
      color: 'var(--chart-1)',
    },
    min: {
      label: `Low (${unitSuffix(unit)})`,
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  if (!hourly.length && !daily.length) return null;

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Forecast dashboard</CardTitle>
        <CardDescription>
          Temperature charts and tabular forecasts for this location
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {hourlyChart.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">24-hour temperature</h3>
            <ChartContainer config={chartConfig} className="h-[260px] w-full min-w-0">
              <AreaChart
                accessibilityLayer
                data={hourlyChart}
                margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => (typeof value === 'string' ? `Time: ${value}` : '')}
                    />
                  }
                />
                <Area
                  dataKey="temp"
                  type="natural"
                  fill="var(--color-temp)"
                  fillOpacity={0.35}
                  stroke="var(--color-temp)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        {hourly.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">Hourly details</h3>
            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Temp</TableHead>
                    <TableHead>Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hourly.map((row, i) => (
                    <TableRow key={`${row.time}-${i}`}>
                      <TableCell className="font-medium">{row.time}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {convertTemp(row.temp, unit)}
                        {unitSuffix(unit)}
                      </TableCell>
                      <TableCell className="max-w-[min(280px,45vw)] truncate text-muted-foreground">
                        {row.condition}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {dailyChart.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">Daily high / low</h3>
            <ChartContainer config={chartConfig} className="h-[260px] w-full min-w-0">
              <BarChart
                accessibilityLayer
                data={dailyChart}
                margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="max" fill="var(--color-max)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="min" fill="var(--color-min)" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ChartContainer>
          </div>
        )}

        {daily.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">Multi-day outlook</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead className="text-right">High</TableHead>
                  <TableHead className="text-right">Low</TableHead>
                  <TableHead className="text-right">Rain</TableHead>
                  <TableHead>Condition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daily.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell className="font-medium">{row.day}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {convertTemp(row.tempMax, unit)}
                      {unitSuffix(unit)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {convertTemp(row.tempMin, unit)}
                      {unitSuffix(unit)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.precipProb}%</TableCell>
                    <TableCell className="max-w-[min(220px,40vw)] truncate text-muted-foreground">
                      {row.condition}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WeatherDashboard;
