import type { FC } from 'react';

import { getVipLevelBorderColor, getVipLevelColor } from '@/core/constants/vip-levels.constants';
import Image from '@/shared/ui/Images/Image';

interface Reward {
  amount?: string;
  title: string;
  description: string;
  icon?: string;
  isUnlocked?: boolean;
}

interface VipRankCardProps {
  rank: string;
  level: number;
  wageredAmount: string;
  rewards: Reward[];
  image: string;
  className?: string;
  levelDescription?: string;
  levelName?: string;
}

const VipRankCard: FC<VipRankCardProps> = ({
  rank,
  level,
  wageredAmount,
  rewards,
  image,
  levelDescription: _levelDescription,
  levelName: _levelName,
  className = ''
}) => {
  const headerColor = getVipLevelColor(Number(level));
  const vipBorderColor = getVipLevelBorderColor(level);
  return (
    <div
      className={`relative max-w-[320px] min-w-[285px] h-[580px] rounded-[28px] p-1 ${className}`}
      style={{ background: vipBorderColor }}
    >
      <div
        className="relative h-full w-full rounded-3xl p-4 overflow-hidden"
        style={{
          backgroundColor: '#060E20'
        }}
      >
        {/* Green gradient background for bottom 50% */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-xl"
          // style={{
          //   background: bggradient
          // }}
        />
        {/* Dragon Character */}
        <div className="absolute top-12 right-1 z-10">
          <Image src={image} alt="Profile" className="w-40 " width={150} height={100} />
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col z-5 justify-between h-full">
          {/* Header Section */}
          <div className="flex flex-col gap-16">
            <div className="flex flex-col rounded-xl p-2.5 gap-0" style={{ background: headerColor }}>
              <div className="text-base font-bold text-white ">{rank.toUpperCase()}</div>
              <p className="text-sm text-white60 ">Rank {level}</p>
            </div>
            <div>
              <p className="text-base font-bold font-byrd mt-10 text-white70">{wageredAmount}</p>
              <p className="text-sm text-white60">Wagered</p>
            </div>
          </div>

          {/* Rewards Section */}
          <div className=" rounded-xl flex flex-col z-50 gap-0.5 overflow-hidden">
            {rewards.map((reward, index) => (
              <div key={index} className="bg-toshi_body z-50  px-3 py-4 flex items-center gap-2.5">
                {reward.icon && (
                  <div className="flex items-center gap-2.5 bg-bg_menu rounded-md px-2 py-2 flex-shrink-0">
                    <div className="w-6 h-6 flex-shrink-0">
                      <Image
                        src={reward.icon}
                        alt={reward.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white80 font-medium text-sm">{reward.title}</p>
                  <p className="text-white60 text-xs">{reward.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipRankCard;
