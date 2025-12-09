type Formatted = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const ONE_SEC = 1000;
const ONE_MIN = 60 * ONE_SEC;
const ONE_HOUR = 60 * ONE_MIN;
const ONE_DAY = 24 * ONE_HOUR;

export const format = (time: number): Formatted => {
  let rest = time;

  const days = Math.floor(rest / ONE_DAY);
  rest = rest % ONE_DAY;

  const hours = Math.floor(rest / ONE_HOUR);
  rest = rest % ONE_HOUR;

  const minutes = Math.floor(rest / ONE_MIN);
  rest = rest % ONE_MIN;

  const seconds = Math.floor(rest / ONE_SEC);
  rest = rest % ONE_SEC;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

const plural = (count: number, word: string) => {
  const suffix = count > 1 || count === 0 ? 's' : '';
  return `${word}${suffix}`;
};

const getFormattedTimePart = (num: number, word: string) => {
  const padded = num.toString().padStart(2, '0');
  return `${padded} ${plural(num, word)} `;
};

export const getFormattedString = (
  formatted: Formatted,
  allowZeros: Partial<Record<keyof Formatted, boolean>>,
) => {
  let result = '';
  if (formatted.days || allowZeros.days) {
    result += getFormattedTimePart(formatted.days, 'day');
  }

  if (formatted.hours || allowZeros.hours) {
    result += getFormattedTimePart(formatted.hours, 'hour');
  }

  if (formatted.minutes || allowZeros.minutes) {
    result += getFormattedTimePart(formatted.minutes, 'minute');
  }

  if (formatted.seconds || allowZeros.seconds) {
    result += getFormattedTimePart(formatted.seconds, 'second');
  }

  return result;
};
