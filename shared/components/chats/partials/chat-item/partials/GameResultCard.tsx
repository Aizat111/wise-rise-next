import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

import type { BetData } from '@/core/types/chat.types';
import Image from '@/shared/ui/Images/Image';
import { ImageWithFallback } from '@/shared/ui/Images/ImageWithFallback';

interface GameResultCardProps {
  betData: BetData;
}

const GameResultCard: React.FC<GameResultCardProps> = ({ betData }) => {
  const t = useTranslations();
  const router = useRouter();

  const handleGameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (betData?.game_url) {
      router.push(betData.game_url);
    }
  };

  return (
    <div
      onClick={handleGameClick}
      role="button"
      tabIndex={0}
      aria-hidden="true"
      className="rounded-lg p-2 mt-2 bg-bg_menu border border-gray-500 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        {/* Game Image */}
        <div className="relative rounded-lg overflow-hidden flex-shrink-0 h-auto">
          <ImageWithFallback src={betData.game_image} alt={betData.game_name || 'Game'} width={85} height={140} />
        </div>

        {/* Bet Info */}
        <div className="w-full space-y-1">
          <div className="text-xs flex flex-col">
            <span className="text-white50">{t('bet')}:</span>{' '}
            <span className="text-white flex items-center gap-1">
              {Number(betData.amount)?.toFixed(2)}{' '}
              <Image src={'/assets/currencies/dollar.svg'} alt={betData.game_name || 'Game'} width={13} height={13} />
            </span>
          </div>
          <div className="text-xs  font-semibold flex flex-col">
            <span className="text-white50">{t('payout')}:</span>{' '}
            <span className="text-white flex items-center gap-1">
              {Number(betData.payout)?.toFixed(2)}{' '}
              <Image src={'/assets/currencies/dollar.svg'} alt={betData.game_name || 'Game'} width={13} height={13} />
            </span>
          </div>
          <div className="text-xs font-bold flex flex-col">
            <span className="text-white50">{t('multiplier')}:</span>{' '}
            <span className="text-green-400">{betData.multiplier}x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResultCard;
