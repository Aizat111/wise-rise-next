import { FC } from 'react';

import { cn } from '@/core/lib/utils';
import { Toshibet } from '@/shared/assets/branding';
import Image from '@/shared/ui/Images/Image';
import { formatNumber } from '@/shared/utils/numberUtils';

type WinCardProps = {
  game: {
    multiplier: string;
    payout: string;
  };
  isModal: boolean;
};

const WinCard: FC<WinCardProps> = ({ game, isModal }) => {
  return (
    <>
      {game?.multiplier && Number(game?.multiplier) > 0 && (
        <div
          className={cn(
            'absolute transition-all duration-200 opacity-0 max-sm:top-[80px] top-1/2 justify-center items-center flex flex-col w-full left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-bg_content win z-[65]',
            // base: ~40% smaller (for containers below 800px)
            'border-2 w-[3em] rounded-2xl px-3 py-3 min-w-[150px] text-sm',
            // larger at container >= 800px
            '@mobg:border-4 @mobg:w-[5em] @mobg:rounded-3xl @mobg:px-6 @mobg:py-6 @mobg:min-w-[250px] @mobg:text-base',
            isModal && 'top-[100px]',
            Number(game?.multiplier) > 0 ? 'border-green-500' : 'border-red-500'
          )}
        >
          <p
            className={cn(
              // base small
              'bg-success-500/10 w-fit py-2 px-3 rounded-md text-sm',
              // larger at container >= 800px
              '@mobg:py-3 @mobg:px-5 @mobg:rounded-lg @mobg:text-xl',
              Number(game?.multiplier) > 0 ? 'text-[#67DF30] bg-success-500/10' : 'bg-red-500/10 text-red-500'
            )}
          >
            {formatNumber(Number(game?.multiplier) || 0)}x
          </p>

          <div className="flex flex-row gap-2 w-full items-center justify-center mt-3 mb-3 @mobg:mt-5 @mobg:mb-4">
            <hr className="w-full border-white30  " />
            <Toshibet className="opacity-30 w-[180px] @mobg:w-[300px]" />
            <hr className="w-full border-white30  " />
          </div>
          <p className="amount-won flex items-center justify-center gap-1 @mobg:gap-2 text-sm @mobg:text-xl">
            {formatNumber(Number(game?.payout) || 0)}
            <Image
              src={`/assets/currencies/dollar.svg`}
              width={18}
              height={18}
              className="w-3 h-3 @mobg:w-5 @mobg:h-5"
              alt="US Dollar"
            />
          </p>
        </div>
      )}
    </>
  );
};

export default WinCard;
