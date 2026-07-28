import { FC, useEffect, useState } from 'react';

import { calculateTimeUntilNextDay, calculateTimeUntilWeekEnd } from '@/shared/utils/dateTimeUtils';

const CountdownTimerTask: FC<{ type: 'daily' | 'weekly' }> = ({ type }) => {
  const [imer, setTimer] = useState<{ days: number | undefined; hours: number; minutes: number; seconds: number }>({
    days: undefined,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (type !== 'daily') return;

    // Update timer immediately
    setTimer(calculateTimeUntilNextDay());

    // Set interval to update timer every second
    const dailyTimerInterval = setInterval(() => {
      setTimer(calculateTimeUntilNextDay());
    }, 1000);

    return () => clearInterval(dailyTimerInterval);
  }, [type]);

  useEffect(() => {
    if (type !== 'weekly') return;

    // Update timer immediately
    setTimer(calculateTimeUntilWeekEnd());

    // Set interval to update timer every second
    const timerInterval = setInterval(() => {
      setTimer(calculateTimeUntilWeekEnd());
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [type]);
  return (
    <div className="h-[68px] px-4 py-4 bg-transparent @[768px]:bg-[#060E20] border-y border-white10  @[768px]:border-none @[768px]:rounded-2xl flex @[768px]:justify-start justify-center items-center gap-2">
      <div className="self-stretch py-2.5 rounded flex justify-center items-center gap-2.5">
        <div className="justify-start">
          <span className="text-white60 text-lg @[768px]:text-base font-semibold  ">
            {type === 'daily' ? 'Renews in:' : 'Week ends in:'}
          </span>
          <span className="text-white text-base font-semibold  "> </span>
        </div>
      </div>
      <div className="self-stretch py-2.5 rounded flex justify-center items-center gap-2.5">
        <div className="justify-start text-white text-lg @[768px]:text-base font-bold ">
          {imer.days ? imer.days + 'd ' : ''}
          {imer.hours?.toString().padStart(2, '0')}h {imer.minutes?.toString().padStart(2, '0')}m{' '}
          {imer.seconds?.toString().padStart(2, '0')}s
        </div>
      </div>
    </div>
  );
};

export default CountdownTimerTask;
