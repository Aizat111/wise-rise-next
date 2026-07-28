'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { resetBets } from '@/core/redux-toolkit/slices/betsSlice';
import Card from '@/shared/components/card/Card';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';

export default function LiveSessionStats() {
  const dispatch = useDispatch();
  const t = useTranslations();
  const { profit, wins, losses, currentWagered } = useAppSelector((state: any) => state.bets);

  const handleReset = () => {
    dispatch(resetBets());
  };

  return (
    <Card className="p-3 gap-2 bg-toshi_body/70">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm text-white">{t('live_session')}</span>
        <div className="relative group">
          <CustomTooltip label={t('reset_session')}>
            <Button
              intent="gray"
              appearance="3d"
              size="xs"
              iconOnly
              icon={<RefreshCw className="h-4" />}
              className="rounded-md"
              onClick={handleReset}
              aria-label="Reset session"
            />
          </CustomTooltip>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <span className={`text-sm ${profit >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
            ${profit.toFixed(2)}
          </span>
          <span className="text-sm text-white70 ">Profit</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-white">${currentWagered.toFixed(2)}</span>
          <span className="text-sm text-white70 ">Wagered</span>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-success-500">{wins}</span>
          <span className="text-sm text-white70 ">Wins</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-danger-500">{losses}</span>
          <span className="text-sm text-white70 ">Losses</span>
        </div>
      </div>
    </Card>
  );
}
