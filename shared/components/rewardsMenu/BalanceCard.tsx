'use client';

import type { FC } from 'react';

interface BalanceCardProps {
  title: string;
  balance: string;
  Icon: React.ReactNode;
}

export const BalanceCard: FC<BalanceCardProps> = ({ title, balance, Icon }) => {
  return (
    <div className="flex flex-row items-center justify-between bg-bg_color gap-2  rounded-md p-1.5">
      <div className="flex flex-row items-center gap-2">
        <div className="w-7 h-7 inline-flex items-center justify-center">{Icon}</div>
        <p className="text-white font-semibold text-base"> {title}</p>
      </div>
      <p className="text-white font-semibold bg-bg_color border border-white10 rounded-lg py-1 px-2 text-base">
        {balance}
      </p>
    </div>
  );
};

export default BalanceCard;
