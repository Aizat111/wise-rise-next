'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Modal, ModalContent } from '../Modal';

import { useGraphWsFetcher } from '@/core/api/graphql';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import {
  lmsCanBuyLifeline,
  lmsIsLifelineRoundInCosts,
  lmsResolveLifelinePointsCost,
  lmsResolveRoundNo,
  lmsResolveTournamentPoints
} from '@/core/lib/lmsUtls';
import type {
  PlayerBuyLifelineResult,
  PlayerLifelineEligibilityResult,
  PlayerTournamentInformation
} from '@/core/types/lms.types';
import {
  MOCK_ELIMINATED_WORLD_CUP_TOURNAMENT_ID,
  getMockLifelineModalProps
} from '@/screens/last-man-standing/mocks/worldCupEliminatedMock';
import Image from '@/shared/ui/Images/Image';

interface LifelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  props?: {
    tournamentId?: string;
    pointsCurrencyCode?: string;
    pointsBalance?: number;
    lifelinePointsCost?: number;
    lifelineCanBuy?: boolean;
    lifelineEnabled?: boolean;
  };
}

const LifelineModal = ({ isOpen, onClose, props }: LifelineModalProps) => {
  const t = useTranslations('last_man_standing');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const searchParams = useSearchParams();
  const tournamentId = String(props?.tournamentId || searchParams?.get('tournamentId') || '');
  const isMockTournament = tournamentId === MOCK_ELIMINATED_WORLD_CUP_TOURNAMENT_ID;
  const mockProps = isMockTournament ? getMockLifelineModalProps() : null;
  const cardProps = mockProps ?? props;

  const tournamentInformation = useGraphWsFetcher<{
    playerTournamentInformation: PlayerTournamentInformation[];
  }>(GRAPHQL_TYPES.LMS_GET_PLAYER_TOURNAMENT_INFORMATION).render(tournamentId ? { tournamentId } : undefined, {
    enabled: Boolean(isOpen && tournamentId && !isMockTournament)
  });

  const lifelineEligibility = useGraphWsFetcher<{
    playerLifelineEligibility: PlayerLifelineEligibilityResult;
  }>(GRAPHQL_TYPES.LMS_CHECK_LIFELINE_ELIGIBILITY).render(tournamentId ? { tournamentId } : undefined, {
    enabled: Boolean(isOpen && tournamentId && !isMockTournament)
  });

  const buyLifelineAction = useGraphWsFetcher<{
    playerBuyLifeline: PlayerBuyLifelineResult;
  }>(GRAPHQL_TYPES.LMS_BUY_LIFELINE).action();

  const tournamentInfo = tournamentInformation.data?.playerTournamentInformation?.[0];
  const eligibility = lifelineEligibility.data?.playerLifelineEligibility;

  const lifelineRoundNo =
    eligibility?.round_no ??
    tournamentInfo?.current_lifeline_cost?.round_no ??
    (tournamentInfo ? lmsResolveRoundNo(tournamentInfo) : undefined);

  const pointsView = useMemo(() => {
    const tournamentPoints = tournamentInfo ? lmsResolveTournamentPoints(tournamentInfo) : null;

    return {
      balance: Number(eligibility?.points_balance ?? tournamentPoints?.balance ?? cardProps?.pointsBalance ?? 0),
      cost: Number(
        (tournamentInfo ? lmsResolveLifelinePointsCost(tournamentInfo, lifelineRoundNo) : undefined) ??
          cardProps?.lifelinePointsCost ??
          eligibility?.points_cost ??
          0
      ),
      currencyCode:
        eligibility?.points_currency_code || tournamentPoints?.currencyCode || cardProps?.pointsCurrencyCode || 'LMS'
    };
  }, [
    cardProps?.lifelinePointsCost,
    cardProps?.pointsBalance,
    cardProps?.pointsCurrencyCode,
    eligibility?.points_cost,
    eligibility?.points_balance,
    eligibility?.points_currency_code,
    lifelineRoundNo,
    tournamentInfo
  ]);

  const lifelineEnabled =
    eligibility?.lifeline_enabled ?? tournamentInfo?.lifeline_enabled ?? cardProps?.lifelineEnabled;
  const isLifelineRoundAvailable =
    isMockTournament ||
    (lifelineRoundNo != null &&
      (tournamentInfo
        ? lmsIsLifelineRoundInCosts(tournamentInfo, lifelineRoundNo)
        : Boolean(cardProps?.lifelineEnabled)));

  const canBuy =
    Boolean(tournamentId) &&
    Boolean(lifelineEnabled) &&
    isLifelineRoundAvailable &&
    (isMockTournament
      ? cardProps?.lifelineCanBuy === true
      : lmsCanBuyLifeline(tournamentInfo, eligibility, lifelineRoundNo)) &&
    pointsView.cost > 0 &&
    pointsView.balance >= pointsView.cost;

  const unavailableReason = eligibility?.reason || tournamentInfo?.player_lifeline_unavailable_reason || '';

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  const handleBuyLifeline = async () => {
    if (isMockTournament) return;

    try {
      await buyLifelineAction.mutateAsync({ tournamentId });
      setIsConfirmed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const primaryLabel = isConfirmed ? t('ok') : t('buy_for_lifeline', { price: pointsView.cost || 0 });
  const isPending = buyLifelineAction.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="sm"
      variant="default"
      modalClassName="bg-[#060E20]"
    >
      <ModalContent className="p-0 w-full">
        <div className="flex flex-col items-center gap-1 py-4 text-center">
          {/* <Image
            src="/assets/svgs/toshi-white.svg"
            alt="toshi-white"
            width={90}
            height={40}
            loading="eager"
            unoptimized
            priority
          /> */}
          <span
            className="text-xl uppercase font-bold"
            style={{
              background:
                'linear-gradient(135.34deg, #8C421D 15.43%, #FBE67B 38.47%, #FCFBE7 53.36%, #F7D14E 69.97%, #D4A041 86.26%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('buy_lifeline')}
          </span>
          <p className="text-white/70 text-sm max-w-[220px]">{t('lifeline_modal_description')}</p>
          <Image
            src="/assets/images/lifeline-card.png"
            alt="lifeline-card"
            width={180}
            height={100}
            loading="eager"
            unoptimized
            priority
          />
        </div>
        {!isConfirmed ? (
          <div className="flex flex-col pb-5 px-3">
            <div className="flex items-center text-white/70 text-sm justify-between">
              <span>{pointsView.currencyCode} Pts balance</span>
              <span>{pointsView.balance.toLocaleString()} pts</span>
            </div>
            <div className="flex items-center text-md justify-between">
              <span>{t('buy_lifeline')} cost</span>
              <span>{pointsView.cost.toLocaleString()} pts</span>
            </div>
            {!canBuy && unavailableReason ? (
              <span className="mt-3 text-center text-sm text-red-400">
                {t(`unavailable_reasons.${unavailableReason}`)}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center pb-5 px-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#03FF88]" />
              <span className="text-lg uppercase font-bold text-[#03FF88]">{t('confirmed')}</span>
            </div>
            <span>{t('lifeline_purchased')}</span>
          </div>
        )}
        <div className="p-0 h-full">
          <Button
            appearance="glossy"
            intent="primary"
            isLoading={isPending}
            className={isConfirmed ? 'w-full' : !canBuy || isPending ? 'opacity-50 w-full' : 'w-full'}
            disabled={isConfirmed ? false : !canBuy || isPending}
            onClick={async () => {
              if (isConfirmed) {
                handleClose();
              } else {
                await handleBuyLifeline();
              }
            }}
          >
            {primaryLabel}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default LifelineModal;
