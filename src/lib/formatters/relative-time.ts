const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

type Unit = {
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
};

const UNITS: Unit[] = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "week", seconds: 60 * 60 * 24 * 7 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
];

export const formatRelativeTime = (input?: string | number | Date | null): string => {
  if (!input) return "nunca";

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "nunca";

  const now = Date.now();
  const diffSeconds = Math.round((date.getTime() - now) / 1000);

  for (const { unit, seconds } of UNITS) {
    const value = Math.trunc(diffSeconds / seconds);
    if (Math.abs(value) >= 1 || unit === "second") {
      return RELATIVE_TIME_FORMATTER.format(value, unit);
    }
  }

  return RELATIVE_TIME_FORMATTER.format(0, "second");
};

export const formatRelativeOrNever = (input?: string | null): string => formatRelativeTime(input ?? null);
