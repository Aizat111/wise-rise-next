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
  LMS_DRAW_CARD_STATE_ACTIVE,
  LMS_DRAW_CARD_STATE_OWNED,
  lmsCanBuyDrawCard,
  lmsResolveDrawCardPointsCost,
  lmsResolveTournamentPoints,
  lmsUsesTournamentPoints
} from '@/core/lib/lmsUtls';
import type {
  PlayerBuyDrawCardResult,
  PlayerLmsProfile,
  PlayerTournamentInformation,
  PlayerUseDrawCardResult
} from '@/core/types/lms.types';
import Image from '@/shared/ui/Images/Image';

interface DrawCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  props?: {
    tournamentId?: string;
    pointsCurrencyCode?: string;
    pointsBalance?: number;
    drawCardPointsCost?: number;
  };
}

const DrawCardModal = ({ isOpen, onClose, props }: DrawCardModalProps) => {
  const t = useTranslations('last_man_standing');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [localDrawCardState, setLocalDrawCardState] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const tournamentId = String(props?.tournamentId || searchParams?.get('tournamentId') || '');
  const cardProps = props;

  const tournamentInformation = useGraphWsFetcher<{
    playerTournamentInformation: PlayerTournamentInformation[];
  }>(GRAPHQL_TYPES.LMS_GET_PLAYER_TOURNAMENT_INFORMATION).render(tournamentId ? { tournamentId } : undefined, {
    enabled: Boolean(isOpen && tournamentId)
  });

  const tournamentInfo = tournamentInformation.data?.playerTournamentInformation?.[0];
  const usesTournamentPoints = lmsUsesTournamentPoints(tournamentInfo);
  const needsLmsProfile = isOpen && (!tournamentId || (Boolean(tournamentInfo) && !usesTournamentPoints));

  const lmsProfile = useGraphWsFetcher<{
    playerLmsProfile: PlayerLmsProfile;
  }>(GRAPHQL_TYPES.LMS_GET_LMS_PROFILE).render(undefined, { enabled: needsLmsProfile });

  const buyDrawCardAction = useGraphWsFetcher<{
    playerBuyDrawCard: PlayerBuyDrawCardResult;
  }>(GRAPHQL_TYPES.LMS_BUY_DRAW_CARD).action();
  const useDrawCardAction = useGraphWsFetcher<{
    playerUseDrawCard: PlayerUseDrawCardResult;
  }>(GRAPHQL_TYPES.LMS_USE_DRAW_CARD).action();

  const drawCardState = localDrawCardState || String(tournamentInfo?.player_draw_card_state || 'NONE');

  const pointsView = useMemo(() => {
    const tournamentPoints = tournamentInfo ? lmsResolveTournamentPoints(tournamentInfo) : null;

    if (usesTournamentPoints && tournamentPoints) {
      return {
        balance: tournamentPoints.balance,
        cost: lmsResolveDrawCardPointsCost(tournamentInfo),
        currencyCode: tournamentPoints.currencyCode
      };
    }

    if (tournamentInfo && !usesTournamentPoints) {
      return {
        balance: Number(lmsProfile.data?.playerLmsProfile?.points_balance || 0),
        cost: lmsResolveDrawCardPointsCost(tournamentInfo),
        currencyCode: 'LMS'
      };
    }

    return {
      balance: Number(cardProps?.pointsBalance ?? 0),
      cost: Number(
        cardProps?.drawCardPointsCost ?? (tournamentInfo ? lmsResolveDrawCardPointsCost(tournamentInfo) : 0)
      ),
      currencyCode: cardProps?.pointsCurrencyCode || 'LMS'
    };
  }, [
    cardProps?.drawCardPointsCost,
    cardProps?.pointsBalance,
    cardProps?.pointsCurrencyCode,
    lmsProfile.data?.playerLmsProfile?.points_balance,
    tournamentInfo,
    usesTournamentPoints
  ]);

  const canBuy =
    Boolean(tournamentId) && lmsCanBuyDrawCard(tournamentInfo, drawCardState) && pointsView.balance >= pointsView.cost;
  const canUse = Boolean(tournamentId) && drawCardState === LMS_DRAW_CARD_STATE_OWNED;
  const isActive = drawCardState === LMS_DRAW_CARD_STATE_ACTIVE;

  const handleClose = async () => {
    setIsConfirmed(false);
    setLocalDrawCardState(null);
    onClose();
  };
  const handleUseDrawCard = async () => {
    try {
      if (canUse) {
        const result = await useDrawCardAction.mutateAsync({ tournamentId, automatic: false });
        setLocalDrawCardState(result?.playerUseDrawCard?.draw_card_state || LMS_DRAW_CARD_STATE_ACTIVE);
        setIsConfirmed(true);
        return;
      }

      const result = await buyDrawCardAction.mutateAsync({ tournamentId, automatic: true });
      const nextState = result?.playerBuyDrawCard?.draw_card_state || 'NONE';
      setLocalDrawCardState(nextState);
      if (nextState === LMS_DRAW_CARD_STATE_ACTIVE) {
        setIsConfirmed(true);
        return;
      }
    } catch (error: any) {
      console.error(error);
      return;
    }
  };

  const title =
    drawCardState === LMS_DRAW_CARD_STATE_OWNED ? 'Use Draw Card' : isActive ? 'Draw Card Active' : t('buy_draw_card');
  const description =
    drawCardState === LMS_DRAW_CARD_STATE_OWNED
      ? 'You already own a draw card.'
      : isActive
        ? 'Your draw card is active for this round.'
        : t('draw_card_modal_description');
  const primaryLabel =
    isConfirmed || isActive
      ? t('ok')
      : canUse
        ? 'Use Draw Card'
        : t('buy_for_draw_card', { price: pointsView.cost || 0 });
  const isPending = buyDrawCardAction.isPending || useDrawCardAction.isPending;
  const isActionDisabled = !isConfirmed && !isActive && !canUse && !canBuy;
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
          <Image
            src="/assets/svgs/toshi-white.svg"
            alt="toshi-white"
            width={90}
            height={40}
            loading="eager"
            unoptimized
            priority
          />
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
            {title}
          </span>
          <p className="text-white/70 text-sm max-w-[220px]">{description}</p>
          <Image
            src="/assets/images/draw-card.png"
            alt="draw-card"
            width={180}
            height={100}
            loading="eager"
            unoptimized
            priority
          />
        </div>
        {!isConfirmed && !isActive ? (
          <div className="flex flex-col pb-5 px-3">
            <div className="flex items-center text-white/70 text-sm justify-between">
              <span>{pointsView.currencyCode} Pts balance</span>
              <span>{pointsView.balance.toLocaleString()} pts</span>
            </div>
            <div className="flex items-center text-md justify-between">
              <span>Draw Card cost</span>
              <span>{pointsView.cost.toLocaleString()} pts</span>
            </div>
            {drawCardState === LMS_DRAW_CARD_STATE_OWNED && (
              <span className="mt-3 text-center text-sm text-[#03FF88]">Draw Card Purchased</span>
            )}
            {!canBuy && tournamentInfo?.player_draw_card_unavailable_reason ? (
              <span className="mt-3 text-center text-sm text-red-400">
                {t(`unavailable_reasons.${tournamentInfo.player_draw_card_unavailable_reason}`)}
              </span>
            ) : null}
          </div>
        ) : !isActive ? (
          <div className="flex flex-col items-center pb-5 px-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#03FF88]" />
              <span className="text-lg uppercase font-bold text-[#03FF88]">{t('confirmed')}</span>
            </div>
            <span>{t('you_have_played_your_draw_card')}</span>
          </div>
        ) : null}
        <div className="p-0 h-full">
          <Button
            appearance="glossy"
            intent="primary"
            className="w-full"
            isLoading={useDrawCardAction?.isPending || buyDrawCardAction?.isPending}
            disabled={isConfirmed && !isActive && (isActionDisabled || isPending)}
            onClick={async () => {
              if (isActive) {
                handleClose();
              } else {
                handleUseDrawCard();
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

export default DrawCardModal;
