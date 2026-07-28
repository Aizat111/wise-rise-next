import {
  add,
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addYears,
  differenceInMinutes,
  endOfDay,
  format,
  formatISO,
  fromUnixTime,
  getDate as getDateFNS,
  getDay as getDayFNS,
  getHours as getHoursFNS,
  getMinutes,
  getUnixTime,
  isAfter as isAfterFNS,
  isBefore,
  isDate as isDateFNS,
  isEqual,
  isWithinInterval,
  parseISO,
  setDay as setDayFNS,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  subDays,
  subMinutes,
  toDate
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import {
  dateFormat,
  dateFormatBackend,
  dateHour,
  dateTimeAnnoFormat,
  dateTimeFormat,
  dateTimeMiliSecondFormatBackend,
  dateTimeSecondFormat,
  dateTimeSecondFormatFileName,
  dateTimeSecondMiliFormat,
  monthFormatToBackend,
  monthYearFormat,
  timeFormat
} from '@/core/constants/dateFormats';

// GetDays
export const getYesterday = () => subDays(new Date(), 1);
export const getToday = (format?: string) => (format ? new Date(format) : new Date());
export const getTomorrow = () => addDays(new Date(), 1);
export const getTodayFileName = () => format(new Date(), dateTimeSecondFormatFileName);
export const getSubtractDays = (count: number) => subDays(new Date(), count);
export const getSubtractMinutes = (date: Date, count: number) => subMinutes(date, count);
export const getStartOfDay = () => startOfDay(new Date());
export const getEndOfDay = () => endOfDay(new Date());
export const getStartDate = (date: any) => format(startOfDay(parseISO(date)), "yyyy-MM-dd'T'HH:mm:ss");
export const getEndDate = (date: any) => format(endOfDay(parseISO(date)), "yyyy-MM-dd'T'HH:mm:ss");

// Get Now
export const getNowHour = () => getHoursFNS(new Date());
export const getNowMinutes = () => getMinutes(new Date());

// Set Date
export const setDay = (date: Date, day: number) => setDayFNS(date, day);
export const setHour = (date: Date, hour: number) => setHours(date, hour);
export const setMinute = (date: Date, minute: number) => setMinutes(date, minute);
export const setSecond = (date: Date, second: number) => setSeconds(date, second);

// Get Specific Moments
export const getDate = (date: Date) => getDateFNS(date);
export const getDay = (date: Date) => getDayFNS(date);
export const getMinute = (date: Date) => getMinutes(date);
export const getHours = (date: Date) => getHoursFNS(date);

// Add Date
export const subtractDay = (date: Date, count: number) => subDays(date, count);
export const addMinute = (date: Date, count: number) => addMinutes(date, count);
export const addHour = (date: Date, count: number) => addHours(date, count);
export const addDay = (count: number) => addDays(new Date(), count);
export const addMonth = (count: number) => addMonths(new Date(), count);
export const addYear = (count: number) => addYears(new Date(), count);

// Formatted to Dates
export const getFormattedDate = (date: Date, dateformat?: string) =>
  date ? format(date, dateformat || dateFormat) : ' ';
export const getFormattedDateTime = (date: Date, dateformat?: string) => format(date, dateformat || dateTimeFormat);
export const getFormattedStrDateTime = (date: Date, dateformat?: string) =>
  isValidDateTime(date) ? format(new Date(date), dateformat || dateTimeFormat) : ' ';

export const getFormattedHour = (date: Date, dateformat?: string) => format(date, dateformat || dateHour);
export const getFormattedMonth = (date: Date, dateformat?: string) => format(date, dateformat || monthYearFormat);

// Backend To Component
export const backendToDate = (date: string) => parseISO(date);
export const backendToDateWithFormat = (date: string, dateformat: string) => format(parseISO(date), dateformat);
export const backendUnixToDate = (date: number) => fromUnixTime(date);
export const backendToISOString = (date: string) => {
  const newDate = new Date(date);
  return add(newDate, { hours: -3 });
};

export const stringToTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');

  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date;
};

// To Backend Formatters
export const dateToBackend = (date: Date) => format(date, dateFormatBackend);
export const timeToBackend = (date: Date) => format(date, timeFormat);
export const monthToBackend = (date: Date) => format(date, monthFormatToBackend);
export const dateToBackendAnnoTime = (date: Date) => format(date, dateTimeAnnoFormat);
export const dateTimeToBackend = (date: Date) => parseISO(formatISO(date));
export const dateTimeToBackendISO = (date: Date) => formatISO(date);
export const dateTimeMiliSecondToBackend = (date: Date) => format(date, dateTimeMiliSecondFormatBackend);
export const dateTimeToBackendUnix = (date: Date) => getUnixTime(date);
export const dateTimeToBackendISOString = (date: Date) => {
  const newDate = new Date(parseISO(formatISO(date)));
  return add(newDate, { hours: 3 });
};

// Stamp
export const stampToString = (date: Date, dateformat?: string) => format(date, dateformat || dateTimeFormat);
export const stampToStringSeconds = (date: Date, dateformat?: string) =>
  format(date, dateformat || dateTimeSecondFormat);
export const stampToStringMiliSeconds = (date: Date, dateformat?: string) =>
  format(date, dateformat || dateTimeSecondMiliFormat);
export const stampToDate = (date: Date) => toDate(date);

// Controls
export const isDate = (value: Date) => isDateFNS(value);
export const isBeforeToday = (value: Date) => isBefore(value, getStartOfDay());
export const isBetween = (date: Date, startDate: Date, endDate: Date) =>
  isWithinInterval(date, { start: startDate, end: endDate });
export const isAfter = (date: Date, date2: Date) => isAfterFNS(date, date2);
export const isEqualDate = (date: Date, date2: Date) => isEqual(date, date2);

export const getDateFromHours = (time: string) => {
  const newTime = time.split(':');
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...newTime.map(Number));
};

export const getDateWithTimeZone = () => {
  const istanbulDate = new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' });

  return formatInTimeZone(new Date(istanbulDate), 'Europe/Istanbul', 'yyyy-MM-dd HH:mm:ssXXX');
};

export const calculateMinuteDifference = (startDate: Date, endDate: Date) => {
  const startTime = new Date(startDate);
  const endTime = new Date(endDate);
  return differenceInMinutes(endTime, startTime);
};

export const isValidDateTime = (dateTimeString: Date): boolean => {
  // Regular expression to match YYYY-MM-DDTHH:MM:SS format
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

  // Check if the date-time string matches the format
  return regex.test(dateTimeString.toISOString());
};
export const getDateByTimeZone = (timeZone: string, localeDate: Date, utcDate: Date) =>
  timeZone === 'U' ? utcDate : localeDate || new Date();

export const getTimeUntilNextSunday = () => {
  // Get current time in PST
  const now = new Date();
  const pst = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

  // Create target time (next Monday at midnight PST)
  const nextMonday = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  nextMonday.setDate(pst.getDate() + ((8 - pst.getDay()) % 7));
  nextMonday.setHours(0, 0, 0, 0);

  // If we're already past Monday midnight PST, get next week's Monday
  if (pst > nextMonday) {
    nextMonday.setDate(nextMonday.getDate() + 7);
  }

  // Calculate difference in milliseconds
  const diff = nextMonday.getTime() - pst.getTime();

  // Convert to days, hours, minutes
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
};

export const getNextRaffleDrawTime = (): Date => {
  // Calculate next Sunday midnight PST
  const now = new Date();
  const daysUntilSunday = (7 - now.getUTCDay()) % 7 || 7; // If today is Sunday, get next Sunday
  const nextSunday = new Date();
  nextSunday.setUTCDate(now.getUTCDate() + daysUntilSunday);
  nextSunday.setUTCHours(7, 0, 0, 0); // Midnight PST is 7:00 UTC
  return nextSunday;
};

export const getTimeUntilNextMonday = () => {
  // Get current time in PST
  const now = new Date();
  const pst = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

  // Create target time (next Monday at midnight PST)
  const nextMonday = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  nextMonday.setDate(pst.getDate() + ((8 - pst.getDay()) % 7));
  nextMonday.setHours(0, 0, 0, 0);

  // If we're already past Monday midnight PST, get next week's Monday
  if (pst > nextMonday) {
    nextMonday.setDate(nextMonday.getDate() + 7);
  }

  // Calculate difference in milliseconds
  const diff = nextMonday.getTime() - pst.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
};

export const calculateTimeUntilNextDay = () => {
  const now = new Date();

  // Calculate next UTC midnight
  const tomorrowUTC = new Date();
  tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);
  tomorrowUTC.setUTCHours(0, 0, 0, 0); // Set to UTC midnight

  const diff = tomorrowUTC.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days: undefined, hours, minutes, seconds };
};

export const calculateTimeUntilWeekEnd = () => {
  const now = new Date();
  const daysUntilSunday = 7 - now.getUTCDay();
  const endOfWeek = new Date();

  // If today is Sunday, set to next Sunday
  if (daysUntilSunday === 7) {
    endOfWeek.setUTCDate(now.getUTCDate() + 7);
  } else {
    endOfWeek.setUTCDate(now.getUTCDate() + daysUntilSunday);
  }

  // Set to UTC midnight
  endOfWeek.setUTCHours(23, 59, 59, 999);

  // Calculate difference
  const diff = endOfWeek.getTime() - now.getTime();

  // Convert to days, hours, minutes, seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

// Get the current date in PST/PDT timezone only
const getCurrentPSTDate = () => {
  // This creates a date string in PST/PDT timezone
  const pstDateString = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Parse the date parts from the string (MM/DD/YYYY format)
  const [month, day, year] = pstDateString.split('/').map(part => part.trim());

  // Return a date string in YYYY-MM-DD format
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Get the next N days in PST/PDT timezone
export const getNextNDaysInPST = (days: number): string[] => {
  const result = [];

  // Get the current PST date as a starting point
  const currentPSTDate = getCurrentPSTDate();
  const [year, month, day] = currentPSTDate.split('-').map(Number);

  // Create a date object for manipulation
  // Month is 0-indexed in JavaScript Date
  const baseDate = new Date(year, month - 1, day);

  // Generate the next N days
  for (let i = 0; i < days; i++) {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + i);

    const nextYear = nextDate.getFullYear();
    const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
    const nextDay = String(nextDate.getDate()).padStart(2, '0');

    result.push(`${nextYear}-${nextMonth}-${nextDay}`);
  }

  return result;
};

export const getOrdinalDaySuffix = (dayNum: number): string => {
  if (dayNum % 10 === 1 && dayNum !== 11) return 'st';
  if (dayNum % 10 === 2 && dayNum !== 12) return 'nd';
  if (dayNum % 10 === 3 && dayNum !== 13) return 'rd';
  return 'th';
};

/** Calendar date string `YYYY-MM-DD` → e.g. Friday 16th January */
export const formatDateToWeekdayOrdinalMonth = (dateString: string): string => {
  const trimmed = dateString.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    return trimmed;
  }
  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) {
    return trimmed;
  }
  const suffix = getOrdinalDaySuffix(day);
  return `${format(date, 'EEEE')} ${day}${suffix} ${format(date, 'MMMM')}`;
};

// Format date from YYYY-MM-DD to "12th March" format
export const formatDateToReadable = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));

  // Get day with ordinal suffix (1st, 2nd, 3rd, etc.)
  // Get day with ordinal suffix (1st, 2nd, 3rd, etc.)
  // Get day with ordinal suffix (1st, 2nd, 3rd, etc.)
  const dayNum = Number.parseInt(day);
  let suffix = 'th';
  if (dayNum % 10 === 1 && dayNum !== 11) suffix = 'st';
  if (dayNum % 10 === 2 && dayNum !== 12) suffix = 'nd';
  if (dayNum % 10 === 3 && dayNum !== 13) suffix = 'rd';

  // Format as "12th March"
  return `${dayNum}${suffix} ${date.toLocaleString('en-US', { month: 'long' })}`;
};

// Pacific Time (PST/PDT) utility functions
export const getTodayPSTMidnight = (): Date => {
  const now = new Date();
  const pacificNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const todayPST = new Date(pacificNow);
  todayPST.setHours(0, 0, 0, 0);
  return todayPST;
};

export const getDatePSTMidnight = (dateString: string): Date => {
  const targetDate = new Date(dateString);
  const pacificTargetDate = new Date(targetDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  pacificTargetDate.setHours(0, 0, 0, 0);
  return pacificTargetDate;
};

export const getYesterdayPSTMidnight = (): Date => {
  const yesterday = new Date(getTodayPSTMidnight());
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

export const isOneDayBeforeTarget = (targetDateString: string): boolean => {
  const todayPST = getTodayPSTMidnight();
  const targetPST = getDatePSTMidnight(targetDateString);
  const oneDayBeforeTarget = new Date(targetPST);
  oneDayBeforeTarget.setDate(targetPST.getDate());
  return todayPST.getTime() === oneDayBeforeTarget.getTime();
};

export const isClaimableDate = (targetDateString: string): boolean => {
  const yesterdayPST = getYesterdayPSTMidnight();
  const targetPST = getDatePSTMidnight(targetDateString);
  return targetPST.getTime() === yesterdayPST.getTime();
};
