import { Button } from '@investorcentretb/toshi-ui';
import { Tags, Ticket, TrophyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import RakebackBoost from './RakebackBoost';
import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import { PAGE } from '@/core/config/public-page.config';
import { notify } from '@/core/lib/notify';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { setBonusStatus } from '@/core/redux-toolkit/slices/userProgressSlice';
import { nextMonth } from '@/screens/rewards/partials/inventory/partials/MonthlyBonusCard';
import CrystalIcon from '@/shared/assets/sidebar/Crystal';
import Card from '@/shared/components/card/Card';
import { RakebackLiveStats } from '@/shared/components/modal/live-stats/partials/RakebackLiveStats';
import BalanceCard from '@/shared/components/rewardsMenu/BalanceCard';
import ClaimCard from '@/shared/components/rewardsMenu/ClaimCard';
import { useMyCouponCount, useRedeemCouponCode } from '@/shared/hooks/useCoupons';
import { useModalManager } from '@/shared/hooks/useModal';
import Image from '@/shared/ui/Images/Image';
import { Link } from '@/shared/ui/LoadingLink';
import { formatNumber, formatNumberWithCommas } from '@/shared/utils/numberUtils';
import { ClaimBonusResponse, MonthlyBonusStatusResponse, WeeklyBonusStatusResponse } from '@/types/rewards';

type RewardsContentProps = {
  onClose?: () => void;
};

const RewardsContent: FC<RewardsContentProps> = ({ onClose }) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.user);
  const { bonusStatus, ddBalance } = useAppSelector(state => state.userProgress);

  const claimWeekly = useFetcher<ClaimBonusResponse>(TYPES.CLAIM_WEEKLY_BONUS).action();
  const claimMonthly = useFetcher<ClaimBonusResponse>(TYPES.CLAIM_MONTHLY_BONUS).action();
  const claimDailyDollar = useFetcher<ClaimBonusResponse>(TYPES.CLAIM_DAILY_DOLLAR_CLAIM).action();
  const weeklyBonusStatus = useFetcher<WeeklyBonusStatusResponse>(TYPES.GET_WEEKLY_BONUS_STATUS).action();
  const [weeklyBonusStatusData, setWeeklyBonusStatusData] = useState<WeeklyBonusStatusResponse | null>(null);
  const monthlyBonusStatus = useFetcher<MonthlyBonusStatusResponse>(TYPES.GET_MONTHLY_BONUS_STATUS).action();
  const [monthlyBonusStatusData, setMonthlyBonusStatusData] = useState<MonthlyBonusStatusResponse | null>(null);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const couponCount = useMyCouponCount();
  const redeemCoupon = useRedeemCouponCode();

  const { openModal } = useModalManager();

  const handleRedeemCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      notify('error', 'errors.error', 'Coupon code is required');
      return;
    }
    try {
      await redeemCoupon.mutateAsync({ code });
      notify('success', 'success.success', 'Coupon redeemed');
      setCouponCode('');
      setCouponDialogOpen(false);
      await couponCount.refetch();
    } catch (error: any) {
      notify('error', 'errors.error', error?.message || 'Failed to redeem coupon');
    }
  };

  const handleClaimWeekly = () => {
    claimWeekly
      .mutateAsync({})
      .then(response => {
        if (response?.success) {
          notify('success', 'success.weekly_bonus_claimed', {
            key: 'success.you_received_weekly_bonus',
            params: { amount: response.value || '0' }
          });
          openModal('claimNotification', 'claimNotification', {
            rewardName: 'Weekly Bonus',
            amount: Number(response.value ?? 0) / 2,
            days: 3
          });
        } else {
          notify('error', 'errors.failed_to_claim', response?.message || 'errors.failed_to_claim_description');
        }
      })
      .catch((error: any) => {
        notify('error', 'errors.failed_to_claim', error?.message || 'errors.failed_to_claim_description');
      });
  };

  const hasWagered = user?.amount_wagered && Number(user.amount_wagered) > 0;

  const handleClaimMonthly = () => {
    claimMonthly
      .mutateAsync({})
      .then(response => {
        if (response?.success) {
          notify('success', 'success.monthly_bonus_claimed', {
            key: 'success.monthly_bonus_claimed_description',
            params: { amount: response.value || '0' }
          });
          openModal('claimNotification', 'claimNotification', {
            rewardName: 'Monthly Bonus',
            amount: Number(response.value ?? 0) / 2,
            days: 3
          });
          dispatch(setBonusStatus({ weekly: bonusStatus.weeklyActive, monthly: false }));
        } else {
          const errorMsg = response?.message || 'errors.failed_to_claim_description';
          notify('error', 'errors.failed_to_claim', errorMsg);
        }
      })
      .catch((error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || 'errors.failed_to_claim_description';
        notify('error', 'errors.failed_to_claim', errorMsg);
      });
  };

  const handleClaimDailyDollar = () => {
    claimDailyDollar.mutateAsync({}).then((response: any) => {
      if (response?.data?.message === 'You are not eligible for rewards.') {
        notify('error', 'errors.not_eligible_for_rewards', 'errors.not_eligible_for_rewards_description');
        return;
      }
      if (response) {
        openModal('claimNotification', 'claimNotification', {
          rewardName: t('rewards_menu.daily_dollars'),
          amount: Number(response.value ?? 0) / 2,
          days: 3
        });
      }
    });
  };

  useEffect(() => {
    weeklyBonusStatus.mutateAsync({}).then(response => {
      setWeeklyBonusStatusData(response);
    });
  }, []);

  useEffect(() => {
    weeklyBonusStatus.mutateAsync({}).then(response => {
      setWeeklyBonusStatusData(response);
    });
  }, [claimWeekly.isSuccess]);

  useEffect(() => {
    monthlyBonusStatus.mutateAsync({}).then(response => {
      setMonthlyBonusStatusData(response);
    });
  }, []);

  useEffect(() => {
    monthlyBonusStatus.mutateAsync({}).then(response => {
      setMonthlyBonusStatusData(response);
    });
  }, [claimMonthly.isSuccess]);

  return (
    <Card className="w-[346px]  min-w-0 p-4 threed-empty">
      <div className="flex flex-col gap-1">
        <Link href={PAGE.FARMING} prefetch onClick={() => onClose?.()}>
          <BalanceCard
            title={t('toshi_gold')}
            balance={formatNumberWithCommas(Number(user?.token_balance || 0))}
            Icon={<CrystalIcon />}
          />
        </Link>
        <Link href={PAGE.RAFFLE} prefetch onClick={() => onClose?.()}>
          <BalanceCard
            title={t('raffle_tickets')}
            balance={formatNumberWithCommas(
              Number(user?.raffle_tickets_with_wagering || 0) + Number(user?.raffle_tickets_with_gold || 0)
            )}
            Icon={<Ticket className="w-4 h-4 text-primary-500" />}
          />
        </Link>
        <div className="flex flex-row items-center justify-between bg-bg_color gap-2 rounded-md p-1.5">
          <div className="flex flex-row items-center gap-2">
            <div className="w-7 h-7 inline-flex items-center justify-center">
              <Tags className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-white font-semibold text-base">Coupons</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold bg-bg_color border border-white10 rounded-lg py-1 px-2 text-base">
              {couponCount.data?.myCouponCount || '0'}
            </p>
            <Button
              intent="green"
              appearance="green"
              borderRadius="md"
              size="sm"
              className="text-xs text-bg_color font-bold"
              onClick={() => setCouponDialogOpen(true)}
            >
              Add
            </Button>
          </div>
        </div>
        {couponDialogOpen && (
          <div className="bg-bg_color border border-white10 rounded-md p-3 flex flex-col gap-2">
            <input
              value={couponCode}
              onChange={event => setCouponCode(event.target.value)}
              placeholder="Enter coupon code"
              className="w-full rounded-md bg-toshi_body border border-white10 px-3 py-2 text-sm text-white outline-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                intent="gray"
                appearance="solid"
                borderRadius="md"
                size="sm"
                onClick={() => setCouponDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                intent="green"
                appearance="green"
                borderRadius="md"
                size="sm"
                disabled={redeemCoupon.isPending}
                onClick={handleRedeemCoupon}
              >
                {redeemCoupon.isPending ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        )}
        <ClaimCard
          Icon={<Image src="/assets/svgs/weeklychest.svg" alt="weekly bonus" width={16} height={16} />}
          title={t('rewards_menu.weekly_bonus')}
          buttonText={
            claimWeekly.isPending
              ? t('rewards_menu.claiming')
              : weeklyBonusStatusData?.can_claim
                ? t('rewards_menu.add')
                : t('rewards_menu.unlocks_friday')
          }
          onButtonClick={handleClaimWeekly}
          disabled={!weeklyBonusStatusData?.can_claim || !hasWagered || claimWeekly.isPending}
        />
        <ClaimCard
          Icon={<Image src="/assets/svgs/lockedchest.svg" alt="monthly bonus" width={16} height={16} />}
          title={t('rewards_menu.monthly_bonus')}
          buttonText={
            claimMonthly.isPending
              ? t('rewards_menu.claiming')
              : monthlyBonusStatusData?.can_claim
                ? t('rewards_menu.add')
                : t('rewards_menu.unlocks_next_month', { month: nextMonth() })
          }
          onButtonClick={handleClaimMonthly}
          disabled={!monthlyBonusStatusData?.can_claim || claimMonthly.isPending || !hasWagered}
        />
        <RakebackLiveStats containerClassName="bg-bg_color" />
        <ClaimCard
          Icon={<Image src="/assets/currencies/dollar.svg" alt="rakeback" width={16} height={16} />}
          title={t('rewards_menu.daily_dollars')}
          buttonText={t('rewardsPage.claim_dollar', { amount: formatNumber(ddBalance || 0) })}
          onButtonClick={handleClaimDailyDollar}
        />
        <RakebackBoost />
        <div className="flex flex-row items-center justify-between gap-2 bg-bg_color rounded-md px-2 py-2">
          <div className="flex flex-row items-center gap-1">
            <div className="w-7 h-7 inline-flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-yellow" />
            </div>

            <p className="text-white font-semibold text-sm whitespace-nowrap"> {t('rewards.win_100k')}</p>
          </div>

          <Button
            intent="primary"
            appearance="solid"
            borderRadius="md"
            onClick={() => {
              router.push(PAGE.LAST_MAN_STANDING);
              onClose?.();
            }}
          >
            {t('rewards.play_now')}
          </Button>
        </div>
        <Link href={PAGE.REWARDS} prefetch>
          <Button
            intent="primary"
            appearance="glossy"
            borderRadius="md"
            className="w-full mt-6"
            onClick={() => onClose?.()}
          >
            {t('rewards_menu.rewards')}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default RewardsContent;
