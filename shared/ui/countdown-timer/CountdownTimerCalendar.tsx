import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

const CountdownTimerCalendar = () => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  useEffect(() => {
    const updateCountdown = () => {
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

      const nextMidnight = new Date(pacificNow);
      nextMidnight.setDate(pacificNow.getDate() + 1);
      nextMidnight.setHours(0, 0, 0, 0);

      const timeDiff = nextMidnight.getTime() - pacificNow.getTime();

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h: ${minutes}m: ${seconds}s`);
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // initial call to set the countdown immediately

    return () => clearInterval(timer);
  });
  return (
    <div className="text-sm whitespace-nowrap gap-2.5 flex items-center">
      {timeRemaining} <Lock className="w-5 h-5" />
    </div>
  );
};

export default CountdownTimerCalendar;
