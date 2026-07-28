'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import { PAGE } from '@/core/config/public-page.config';
import { getVipLevelBorderColor } from '@/core/constants/vip-levels.constants';
import { RootState } from '@/core/redux-toolkit/store';
import Image from '@/shared/ui/Images/Image';
import { Link } from '@/shared/ui/LoadingLink';
import VipLevelBadge from '@/shared/ui/badges/VipLevelBadge';
import ProgressBar from '@/shared/ui/progressbar/ProgressBar';
import { formatWinAmount } from '@/shared/utils/numberUtils';
import { getLevelSource } from '@/shared/utils/userUtils';

type LevelTrackingCardProps = {
  onClose: () => void;
};

const LevelTrackingCard: FC<LevelTrackingCardProps> = ({ onClose }) => {
  const t = useTranslations();
  const { user } = useSelector((state: RootState) => state.user);
  const userProgress = useSelector((state: RootState) => state.userProgress);

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
    <div className="p-[1.5px] rounded-xl" style={{ background: getVipLevelBorderColor(derivedLevel) }}>
      <div className="hidden md:block bg-bg_color rounded-xl p-0">
        <div className="flex px-4 pt-4 pb-0 flex-col border-b border-linebreak w-full items-center  gap-0   ">
          <div className="flex w-full ">
            <VipLevelBadge level={derivedLevel} widthClassName="w-full" />
          </div>

          <div className="flex flex-row w-full gap-0 -mt-8 overflow-hidden no-scrollbar items-center justify-between">
            <div className="w-full col-span-2 mt-12 -mr-4 justify-between h-full">
              <div className="mb-4 flex flex-col gap-4">
                <h4 className="text-sm  font-bold -mb-1 text-white">{user?.username}</h4>

                <Link href={PAGE.REWARDS}>
                  <Button
                    intent="primary"
                    size="md"
                    className="w-fit min-w-[121px] rounded-xl"
                    appearance="glossy"
                    onClick={onClose}
                  >
                    {t('rewards.rewards')}
                  </Button>
                </Link>
              </div>
            </div>

            <Image
              src={userProgress?.profileImage}
              alt="Profile"
              className="pl-2 -mb-12 col-span-1 max-h-[180px]"
              width={130}
              height={130}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <h5 className="text-base font-semibold text-white">
            ${formatWinAmount(totalWagered)} / ${formatWinAmount(nextTotalRequired)}
          </h5>
          <ProgressBar
            progress={nextPercent}
            footer={{
              title: getLevelSource(derivedLevel) as string,
              value: getLevelSource(derivedLevel + 1) as string
            }}
            progressColor="bg-yellow"
            footerTitleTextClassName=" text-xs text-white70"
          />
        </div>
      </div>

      {/* mobile */}

      <div className="block md:hidden bg-bg_color  rounded-xl p-0">
        <div className="flex px-3 pt-4 pb-0 flex-col border-b border-linebreak w-full items-center  gap-0   ">
          <div className="flex w-full ">
            <VipLevelBadge
              level={derivedLevel}
              textSizeClassName="text-xs"
              widthClassName="w-full"
              paddingClassName="p-2"
            />
          </div>

          <div className="flex flex-row w-full gap-0 -mt-12 overflow-x-hidden no-scrollbar items-center justify-between">
            <div className="w-full col-span-2 mt-14 -mr-4 justify-between h-full">
              <div className="mb-3 flex flex-col gap-3">
                <h4 className="text-sm  font-bold  ml-1 -mb-1 text-white">{user?.username}</h4>

                <Link href={PAGE.REWARDS}>
                  <Button
                    intent="primary"
                    size="xs"
                    className="w-fit min-w-[68÷px] rounded-md"
                    appearance="glossy"
                    onClick={onClose}
                  >
                    {t('rewards.rewards')}
                  </Button>
                </Link>
              </div>
            </div>

            <Image
              src={userProgress?.profileImage}
              alt="Profile"
              className="pl-0 mr-4 -mb-10 col-span-1 max-h-[140px]"
              width={95}
              height={95}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 pt-2 pb-4 px-3">
          <h5 className="text-sm font-semibold text-white">
            ${formatWinAmount(totalWagered)} / ${formatWinAmount(nextTotalRequired)}
          </h5>
          <ProgressBar
            progress={nextPercent}
            // footer={{
            //   title: getLevelSource(userProgress?.level) as string,
            //   value: getLevelSource(userProgress?.nextLevel) as string
            // }}
            progressColor="bg-yellow"
            footerTitleTextClassName=" text-xs text-white70"
          />
        </div>
      </div>
    </div>
  );
};

export default LevelTrackingCard;
