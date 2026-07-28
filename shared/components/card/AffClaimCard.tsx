import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useSelector } from 'react-redux';

import Card from './Card';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { RootState } from '@/core/redux-toolkit/store';
import { Livestats, Time } from '@/shared/assets/general';
import { formatWinAmount } from '@/shared/utils/numberUtils';

interface AffClaimCardProps {
  title: string;
  value: string | number;
}

const AffClaimCard: FC<AffClaimCardProps> = ({ title, value }) => {
  const t = useTranslations();
  const { user } = useSelector((state: RootState) => state.user);
  const claimReferralBonus = useFetcher(TYPES.GET_CLAIM_REFERRAL_BONUS).action();
  return (
    <Card className="gap-9">
      <div className="relative w-full flex-col gap-2 flex rounded-md h-full">
        <div className="relative w-full  flex-col gap-2 flex rounded-md h-full">
          <h2 className="text-md font-bold text-white ">{title}</h2>
          <p className="text-base font-semibold text-grey ">{t('affiliate.earn_bonus_description')}</p>
        </div>

        <div className="relative w-full  flex-col gap-2 flex rounded-xl h-full">
          <h2 className="text-md font-bold text-white ">{t('affiliate.rewards')}</h2>
          <div className="flex flex-row gap-2.5">
            <Livestats width={22} height={22} />
            <p className="text-base font-semibold text-grey">{t('affiliate.earn_bonus_description')}</p>
          </div>
          <div className="flex flex-row gap-2.5">
            <Time width={22} height={22} />
            <p className="text-base font-semibold text-grey">{t('affiliate.earn_bonus_description2')}</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="relative w-full flex flex-row justify-between items-center bg-bg_menu pl-5 p-2.5 rounded-xl">
          <p className="text-lg font-bold text-white"> ${formatWinAmount(Number(value))}</p>
          <Button
            className="lg:w-[145px] rounded-xl"
            onClick={() => claimReferralBonus.mutate({})}
            intent="primary"
            size="lg"
            isLoading={claimReferralBonus.isPending}
            appearance="glossy"
            borderRadius="md"
          >
            {t('affiliate.claim')}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AffClaimCard;
