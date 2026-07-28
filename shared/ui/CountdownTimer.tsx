import { type FC, useEffect, useState } from 'react';

import { getTimeUntilNextMonday } from '@/shared/utils/dateTimeUtils';

interface CountdownTimerProps {
  className?: string;
}

interface TimeBlockProps {
  value: number;
  label: string;
  className?: string;
}
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeBlock: FC<TimeBlockProps> = ({ value, label, className = '' }) => (
  <div
    className={`bg-bg_menu w-full min-h-[80px] pt-2 pb-2 flex flex-col @[768px]:gap-0 gap-1 items-center justify-center rounded-lg text-center min-w-[60px] ${className}`}
  >
    <div className="text-lg @[768px]:text-3xl font-bold text-white">{value.toString().padStart(2, '0')}</div>
    <div className="@[768px]:text-xs text-sm font-bold text-grey2 -mt-2">{label}</div>
  </div>
);

const CountdownTimer: FC<CountdownTimerProps> = ({ className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextMonday());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className={`flex @[768px]:gap-3 gap-2 justify-center ${className}`}>
      <TimeBlock value={timeLeft.days} label="Day" />
      <TimeBlock value={timeLeft.hours} label="Hour" />
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <TimeBlock value={timeLeft.seconds} label="Sec" />
    </div>
  );
};

export default CountdownTimer;
