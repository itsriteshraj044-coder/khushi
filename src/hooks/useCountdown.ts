import { useEffect, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Returns the next occurrence of a month/day at midnight, this year or next. */
function nextOccurrence(month: number, day: number): Date {
  const now = new Date();
  const year = now.getFullYear();
  let target = new Date(year, month, day, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target = new Date(year + 1, month, day, 0, 0, 0);
  }
  return target;
}

/** Live countdown to the next anniversary (recomputed every second). */
export function useCountdown(month: number, day: number): TimeLeft {
  const [left, setLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = nextOccurrence(month, day);

    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff / 3_600_000) % 24),
        minutes: Math.floor((diff / 60_000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [month, day]);

  return left;
}

export interface Elapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Calendar-accurate time elapsed between `start` and now. */
function computeElapsed(start: Date): Elapsed {
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) { seconds += 60; minutes -= 1; }
  if (minutes < 0) { minutes += 60; hours -= 1; }
  if (hours < 0) { hours += 24; days -= 1; }
  if (days < 0) {
    // Borrow the number of days in the previous month.
    const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += daysInPrevMonth;
    months -= 1;
  }
  if (months < 0) { months += 12; years -= 1; }

  return { years, months, days, hours, minutes, seconds };
}

/** Live "time since" a fixed start date, recomputed every second. */
export function useElapsedSince(start: Date): Elapsed {
  const [elapsed, setElapsed] = useState<Elapsed>(() => computeElapsed(start));

  useEffect(() => {
    const tick = () => setElapsed(computeElapsed(start));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [start]);

  return elapsed;
}
