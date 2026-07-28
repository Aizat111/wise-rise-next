'use client';

import { useTranslations } from 'next-intl';

import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { RootState } from '@/core/redux-toolkit/store';
import Card from '@/shared/components/card/Card';
import ProgressBar from '@/shared/ui/progressbar/ProgressBar';
import { formatWinAmount } from '@/shared/utils/numberUtils';
import { getLevelSource } from '@/shared/utils/userUtils';

const LevelTrackingLiveStats = () => {
  const t = useTranslations();
  const userProgress = useAppSelector((state: RootState) => state.userProgress);

  // Source of truth
  const totalWagered = Number(userProgress?.amountWagered ?? 0);
  const currentBand =
    (userProgress?.levelBands || []).find(b => totalWagered >= b.min && totalWagered <= b.max) ??
    (userProgress?.levelBands || [])[((userProgress?.levelBands || []).length || 1) - 1];
  const derivedLevel = Number(currentBand?.level || 0);
  const nextBand = (userProgress?.levelBands || []).find(b => b.level === derivedLevel + 1) ?? currentBand;
  const bandBase = Number(currentBand?.min || 0);
  const nextTotalRequired = Number(nextBand?.min || currentBand?.max || bandBase);
  const bandSpan = Math.max(1, nextTotalRequired - bandBase);
  const progressInBand = Math.max(0, Math.min(bandSpan, totalWagered - bandBase));
  const nextPercent = Math.min(100, Math.max(0, (progressInBand / bandSpan) * 100));

  return (
    <Card className="bg-toshi_body/70 gap-2 px-3 py-2">
      <h5 className="text-sm text-white flex justify-between items-center">
        <span>{t('vip_progress')}</span>
        <span>
          ${formatWinAmount(totalWagered)} / ${formatWinAmount(nextTotalRequired)}
        </span>
      </h5>
      <ProgressBar
        progress={nextPercent}
        footer={{
          title: getLevelSource(derivedLevel) as string,
          value: getLevelSource(derivedLevel + 1) as string
        }}
      />
    </Card>
  );
};

export default LevelTrackingLiveStats;
