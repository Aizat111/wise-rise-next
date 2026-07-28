'use client';

import React from 'react';

import { CaseChance } from '@/core/constants/coupon-chances.constants';

interface PrizeListProps {
  availablePrizes: CaseChance[];
  links: Record<string, string>;
}

export const PrizeList: React.FC<PrizeListProps> = ({ availablePrizes, links }) => {
  return (
    <div className="mt-10">
      <h4 className="text-[18px] -mt-6 font-black text-white mb-4">Available Prizes</h4>
      <div className="flex flex-wrap gap-4 w-full justify-start">
        {availablePrizes?.map((prize, index) => (
          <div
            key={index}
            className="p-4 rounded-md shadow-sm bg-[#1F2538] flex flex-col items-center gap-4 w-full sm:w-[calc(50%-8px)] md:w-[calc(25%-12px)] min-w-[200px]"
          >
            <div className="bg-[#181d2b] rounded w-full flex items-center justify-center p-4">
              <div className="w-[120px] h-[120px] relative">
                <img
                  src={links[prize.name] || '/placeholder.svg'}
                  alt={prize.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-center">
              <h4 className="text-base font-bold text-white">{prize.title}</h4>
              {prize.nbRounds && <p className="text-base font-bold text-[#c1c5d0]">{prize.nbRounds} Spins</p>}
              <div className="flex gap-1 items-center">
                <span className="font-black text-base text-white">
                  {prize.nbRounds && typeof prize.value === 'number'
                    ? (Number(prize.value) * Number(prize.nbRounds)).toLocaleString()
                    : prize.value}
                </span>
                {/* Icon placeholder */}
                <span className="text-green-500">$</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
