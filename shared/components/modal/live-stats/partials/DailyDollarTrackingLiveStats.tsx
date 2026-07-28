'use client';

import { CircleQuestionMark } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAppSelector } from '@/core/redux-toolkit/hooks';
import Card from '@/shared/components/card/Card';
import ProgressBar from '@/shared/ui/progressbar/ProgressBar';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';

const DailyDollarTrackingLiveStats = () => {
  const t = useTranslations();
  const { ddProgress, ddTarget } = useAppSelector(state => state.userProgress);

  return (
    <Card className="bg-toshi_body/70 gap-2 px-3 py-2">
      <h5 className="text-sm text-white flex justify-between items-center">
        <span>{t('daily_dollar_hunt')}</span>
        <span>
          <CustomTooltip label={t('daily_dollar_hunt_description')} contentClassName="max-w-[300px]">
            <CircleQuestionMark className="size-4" />
          </CustomTooltip>
        </span>
      </h5>
      <ProgressBar
        progress={(ddProgress / ddTarget) * 100 || 0}
        footer={{
          title: `${ddProgress || 0} XP`,
          value: `${Number(ddTarget || 0)?.toFixed(0)} XP`
        }}
      />
    </Card>
  );
};

export default DailyDollarTrackingLiveStats;
