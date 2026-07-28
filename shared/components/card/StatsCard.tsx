import type { FC } from 'react';

import Card from './Card';
import { formatWinAmount } from '@/shared/utils/numberUtils';

interface StatsCardProps {
  title: string;
  description: string;
  unit?: string;
  value: string | number;
}

const StatsCard: FC<StatsCardProps> = ({ title, description, value, unit }) => {
  return (
    <Card className="gap-0.5 h-[130px] p-2 pt-4">
      <div className="relative w-full flex-col gap-2 flex rounded-md h-full">
        <div className="relative w-full  flex-col flex items-center rounded-md h-full">
          <div className="text-base font-bold text-white ">{title}</div>
          <h2 className="text-base font-semibold text-white50"> {description} </h2>
        </div>
      </div>

      <div className="relative w-full flex text-base font-semibold flex-row justify-center items-center  bg-bg_menu p-2.5 rounded-md">
        <p>
          {unit}
          {formatWinAmount(Number(value), !!unit)}
        </p>
      </div>
    </Card>
  );
};

export default StatsCard;
