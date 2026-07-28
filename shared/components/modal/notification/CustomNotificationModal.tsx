'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Modal } from '../Modal';

import RewardBreakdownCard from './partials/RewardBreakdownCard';
import RewardStat from './partials/RewardStat';
// import { Loader } from '@/ui/loaders/Loader';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { getVipLevelBorderColor, getVipLevelImage } from '@/core/constants/vip-levels.constants';
import { buildImgixUrl, resolveImagePath } from '@/core/lib/imgix';
import { RootState } from '@/core/redux-toolkit/store';
import { IRewardStatsResponse } from '@/core/types/rewards';
import Image from '@/shared/ui/Images/Image';
import VipLevelBadge from '@/shared/ui/badges/VipLevelBadge';

export type CustomNotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  props: Record<string, any>;
};

const CustomNotificationModal: React.FC<CustomNotificationModalProps> = ({ isOpen, onClose, props }) => {
  const { amount } = props;
  const t = useTranslations();
  const userProgress = useSelector((state: RootState) => state.userProgress);
  const user = useSelector((state: RootState) => state.user.user);
  const getRewardsStats = useFetcher<IRewardStatsResponse>(TYPES.GET_REWARDS_STATS).render();
  const [totalRewards, setTotalRewards] = useState(0);
  const [rakeback, setRakeback] = useState(0);
  const [dailyDollars, setDailyDollars] = useState(0);
  const [levelUpRewards, setLevelUpRewards] = useState(0);
  const [weeklyBonus, setWeeklyBonus] = useState(0);
  const bgUrl = buildImgixUrl(resolveImagePath('home.rewardsclaim'), { fit: 'crop', w: 2000, q: 100 });

  const [monthlyBonus, setMonthlyBonus] = useState(0);
  async function calculateTotalRewards(response: IRewardStatsResponse) {
    const total =
      Number(response.rakeback) +
      Number(response.dailyDollars) +
      Number(response.LUR) +
      Number(response.wb) +
      Number(response.mb);
    setTotalRewards(total);
  }

  useEffect(() => {
    if (getRewardsStats.data) {
      setRakeback(getRewardsStats.data.rakeback);
      setDailyDollars(getRewardsStats.data.dailyDollars);
      setLevelUpRewards(getRewardsStats.data.LUR);
      setWeeklyBonus(getRewardsStats.data.wb);
      setMonthlyBonus(getRewardsStats.data.mb);
      calculateTotalRewards(getRewardsStats.data);
    }
  }, [getRewardsStats.data]);

  // useEffect(() => {
  //   if (isOpen) {
  //     const timer = setTimeout(() => {
  //       onClose();
  //     }, 5000);

  //     return () => {
  //       clearTimeout(timer);
  //     };
  //   }
  // }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      closeOnOverlayClick={false}
      variant="minimal"
      size="4xl"
      header={t('rewards.rewards_stats_title')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body p-0"
      contentClassName="p-6"
    >
      <div className="self-stretch flex-1  flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex-1 inline-flex justify-start items-center gap-6">
          {/* Left column */}
          <div className="w-80 self-stretch rounded-3xl inline-flex flex-col justify-between items-start">
            <div
              className="w-80 z-0 rounded-lg p-0.5 overflow-visible  "
              style={{ background: getVipLevelBorderColor(Number(userProgress?.level ?? 0)) }}
            >
              <div className="relative overflow-hidden bg-toshi_body rounded-lg  flex flex-col p-4 ">
                {/* VIP Level Background Image - positioned bottom right, larger than container to poke above */}
                <div className="absolute z-50 bottom-0 right-4 z-0 -mb-6">
                  <Image
                    src={getVipLevelImage(Number(userProgress?.level ?? 0))}
                    alt="VIP Level Background"
                    width={75}
                    height={75}
                    className="z-50 object-cover"
                  />
                </div>
                {/* Content */}
                <div className="relative z-10 w-full flex flex-col justify-start items-start gap-3">
                  {/* Top row: VIP Level Badge */}
                  <div className="w-full">
                    <VipLevelBadge
                      level={userProgress?.level}
                      widthClassName="w-full"
                      paddingClassName="py-2 px-3"
                      textSizeClassName="text-sm"
                    />
                  </div>
                  {/* Second row: Username */}
                  <div className="w-full">
                    <div className="text-white/70 text-xs font-semibold font-suisse_intl leading-4 tracking-tight">
                      {user?.username || 'Username'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-80 flex-1 pt-4 mix-blend-lighten flex flex-col justify-center items-center gap-9">
              <Image src={bgUrl} width={1000} height={1000} className="w-full h-full" alt="$" />
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="justify-start text-white/60 text-sm font-semibold font-suisse_intl leading-5 tracking-tight">
                  {t('added_to_balance') || 'Added to your balance'}
                </div>
                <div className="justify-start text-white text-3xl font-semibold font-suisse_intl leading-8">
                  ${(Number(amount ?? 0) * 2).toFixed(2)}
                </div>
              </div>
              {/* <div className="self-stretch px-4 bg-slate-800 rounded-lg flex flex-col justify-start items-center overflow-hidden">
                <div className="self-stretch pt-3 pb-2.5 border-t inline-flex justify-between items-center">
                  <div className="flex-1 flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-white text-base font-semibold font-suisse_intl leading-6 tracking-wide">
                      {t('breakdown') || 'Breakdown'}
                    </div>
                  </div>
                  <div className="w-5 h-5 relative rounded-sm overflow-hidden">
                    <div className="w-3 h-2 left-[4.02px] top-[6.64px] absolute bg-neutral-300" />
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Middle and Right columns: Breakdown cards */}
          <div className="flex-1 self-stretch flex justify-start items-center gap-4">
            {/* Left breakdown column */}
            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-4">
              {/* Daily Dollars */}
              <RewardBreakdownCard
                title={t('rewards.dailyDollars')}
                value={dailyDollars}
                totalRewards={totalRewards}
                progressBarColor="bg-blue-400"
                progressBarShadow="0px_0px_24px_0px_rgba(82,174,255,1.00)"
                currencyIcon={bgUrl}
              />

              {/* Weekly Bonus */}
              <RewardStat
                key="weekly-bonus"
                title={t('rewards.weeklyBonus')}
                value={Number(weeklyBonus)}
                totalRewards={Number(totalRewards)}
                backgroundColor="bg-blue-600"
              />

              {/* Monthly Bonus */}
              <RewardStat
                key="monthly-bonus"
                title={t('rewards.monthlyBonus')}
                value={Number(monthlyBonus)}
                totalRewards={Number(totalRewards)}
                backgroundColor="bg-purple-600"
              />
            </div>

            {/* Right breakdown column */}
            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-4">
              {/* Level Up Rewards */}
              <RewardBreakdownCard
                title={t('vip.level_up_rewards') || 'Level up Rewards:'}
                value={levelUpRewards}
                totalRewards={totalRewards}
                progressBarColor="bg-yellow-400"
                progressBarShadow="0px_0px_24px_0px_rgba(221,225,20,1.00)"
                icon={<div className="w-7 h-7 bg-yellow-400" />}
              />

              {/* Rakeback */}
              <RewardBreakdownCard
                title={t('rewards.rakeback')}
                value={rakeback}
                totalRewards={totalRewards}
                progressBarColor="bg-lime-500"
                progressBarShadow="0px_0px_24px_0px_rgba(153,250,108,1.00)"
                icon={
                  <div className="w-7 h-7 relative">
                    <div className="w-4 h-4 left-[5.59px] top-[5.59px] absolute overflow-hidden">
                      <div className="w-4 h-4 left-0 top-0 absolute bg-lime-500" />
                      <div className="w-2 h-2.5 left-[3.44px] top-[2.01px] absolute bg-white shadow-[0.8526705503463745px_0.8526705503463745px_0px_0px_rgba(27,32,49,1.00)]" />
                    </div>
                    <div className="w-7 h-7 left-0 top-0 absolute rounded-full outline outline-[3.23px] outline-offset-[-1.62px] outline-white/10" />
                    <div className="w-7 h-7 left-0 top-0 absolute rounded-full outline outline-[3.23px] outline-offset-[-1.62px] outline-lime-500" />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomNotificationModal;
