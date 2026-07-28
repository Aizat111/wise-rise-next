import { useEffect, useState } from 'react';

export function useCountdown(targetDate: string) {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      // Get current time in Pacific Time
      const now = new Date();
      const pacificTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      }).format(now);

      const pacificNow = new Date(pacificTime);

      // Extract date string from ISO format (YYYY-MM-DD)
      const dateString = targetDate.split('T')[0];

      // Create target date at midnight in Pacific timezone
      // We need to construct the date in Pacific timezone directly
      const [year, month, day] = dateString.split('-').map(Number);
      const pacificTarget = new Date(pacificNow);
      pacificTarget.setFullYear(year);
      pacificTarget.setMonth(month - 1); // months are 0-indexed
      pacificTarget.setDate(day);
      pacificTarget.setHours(0, 0, 0, 0);

      // Calculate time difference
      const timeDiff = pacificTarget.getTime() - pacificNow.getTime();

      if (timeDiff <= 0) {
        setCountdown('');
        return;
      }

      // Convert to hours, minutes, seconds
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // initial call

    return () => clearInterval(timer);
  }, [targetDate]);

  return countdown;
}
