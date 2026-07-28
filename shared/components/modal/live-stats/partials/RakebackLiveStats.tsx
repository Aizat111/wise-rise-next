import { Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { notify } from '@/core/lib/notify';
import { IClaimRakebackResponse } from '@/core/types/rewards';
import { IUserRakebackResponse } from '@/core/types/user.types';
import ClaimCard from '@/shared/components/rewardsMenu/ClaimCard';
import { useUserSocket } from '@/shared/hooks/sockets/useUserSocket';
import { useModalManager } from '@/shared/hooks/useModal';

type RakebackLiveStatsProps = {
  rakeback_balance?: number;
  containerClassName?: string;
};

export const RakebackLiveStats: React.FC<RakebackLiveStatsProps> = ({ containerClassName }) => {
  const { connected, on, off } = useUserSocket();
  const { openModal } = useModalManager();

  const claimRakeback = useFetcher<IClaimRakebackResponse>(TYPES.CLAIM_RABACK).action();
  const [rakebackBalance, setRakebackBalance] = useState<number>(0);

  const handleClaimRakeback = async () => {
    if (rakebackBalance <= 0) {
      notify('error', 'errors.error_not_enough_rakeback', 'errors.error_not_enough_rakeback_description');
      return;
    }
    claimRakeback.mutateAsync({}).then(response => {
      if (response) {
        openModal('claimNotification', 'claimNotification', {
          rewardName: 'Rakeback',
          amount: Number(response.value) / 2,
          days: 3
        });
      }
    });
  };

  useEffect(() => {
    if (connected) {
      on('user:rakeback', (response: IUserRakebackResponse) => {
        setRakebackBalance(response.rakeback_balance);
      });
    }
    return () => {
      off('user:rakeback');
    };
  }, [connected, on]);

  return (
    <ClaimCard
      Icon={<Zap className="w-4 h-4 text-primary-500" />}
      disabled={claimRakeback.isPending || rakebackBalance <= 0}
      title="Rakeback"
      containerClassName={containerClassName ?? 'bg-toshi_body/70'}
      buttonText={claimRakeback.isPending ? 'Claiming...' : `Claim $${Number(rakebackBalance).toFixed(2)}`}
      onButtonClick={claimRakeback.isPending ? () => {} : handleClaimRakeback}
    />
  );
};
