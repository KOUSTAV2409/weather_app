import type { HourlyWeather } from '../types/weather';

/**
 * Rotate hourly rows so the strip starts at the current local hour for `timeZone`
 * (IANA name from the weather API, e.g. "America/New_York").
 */
export function orderHourlyFromCurrentHour(
  hourly: HourlyWeather[],
  timeZone: string
): HourlyWeather[] {
  if (hourly.length === 0) return [];

  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const currentHour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);

  const slotHour = (time: string) => Number(time.slice(0, 2));

  let idx = hourly.findIndex((h) => slotHour(h.time) === currentHour);
  if (idx === -1) {
    const partsM = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now);
    const hh = Number(partsM.find((p) => p.type === 'hour')?.value ?? 0);
    const mm = Number(partsM.find((p) => p.type === 'minute')?.value ?? 0);
    const nowM = hh * 60 + mm;
    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    idx = hourly.findIndex((h) => toMin(h.time) >= nowM);
  }
  if (idx === -1) idx = 0;

  return [...hourly.slice(idx), ...hourly.slice(0, idx)];
}
