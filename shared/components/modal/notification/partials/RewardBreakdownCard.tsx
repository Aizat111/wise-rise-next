import type { ReactNode } from 'react';

import Card from '@/shared/components/card/Card';
import Image from '@/shared/ui/Images/Image';

type RewardBreakdownCardProps = {
  title: string;
  value: number | string;
  totalRewards: number;
  progressBarColor: string;
  progressBarShadow?: string;
  icon?: ReactNode;
  currencyIcon?: string;
  showDecimals?: boolean;
};

const RewardBreakdownCard: React.FC<RewardBreakdownCardProps> = ({
  title,
  value,
  totalRewards,
  progressBarColor,
  progressBarShadow,
  icon,
  currencyIcon = '/assets/currencies/dollar.svg',
  showDecimals = false
}) => {
  const numericValue = Number(value ?? 0);
  const progress = totalRewards > 0 ? (numericValue / totalRewards) * 100 : 0;
  const displayValue = showDecimals ? numericValue.toFixed(2) : numericValue;

  return (
    <Card className="self-stretch flex-1 inline-flex bg-bg_menu justify-start items-start gap-8">
      <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
        <div className="w-7 h-7 flex flex-col justify-center items-center gap-1.5 overflow-hidden">
          <div className="inline-flex justify-start items-center gap-1.5 overflow-hidden">
            {icon || <div className="w-7 h-7" />}
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="inline-flex justify-start items-center gap-2">
            <div className="flex justify-center items-center gap-2.5">
              <div className="justify-start whitespace-nowrap text-white/60 text-sm font-semibold font-suisse_intl leading-6 tracking-wide">
                {title}
              </div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <div className="flex justify-start items-center gap-1">
                <div className="justify-start text-white text-base font-semibold font-suisse_intl leading-6 tracking-wide">
                  {displayValue}
                </div>
                <Image src={currencyIcon} width={14} height={14} className="w-3.5 h-3.5" alt="$" />
              </div>
            </div>
          </div>
          <div className="self-stretch h-3 relative bg-white/10 rounded-[3px]">
            <div
              className={`h-3 left-0 top-0 absolute ${progressBarColor} rounded-[3px]`}
              style={{
                width: `${progress}%`,
                boxShadow: progressBarShadow
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RewardBreakdownCard;
