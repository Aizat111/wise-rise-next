'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { formatDateToWeekdayOrdinalMonth } from '../../../utils/dateTimeUtils';
import { Modal, ModalContent } from '../Modal';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { lmsFormatCurrencyMinor, lmsMapActiveRoundResponseToSelectData } from '@/core/lib/lmsUtls';
import type {
  PlayerActiveRoundFixturesResponse,
  PlayerTournamentInformation,
  SelectGameData
} from '@/core/types/lms.types';
import LeagueLogo from '@/screens/last-man-standing/partials/LeagueLogo';
import MatchList from '@/screens/last-man-standing/partials/MatchList';
import Image from '@/shared/ui/Images/Image';
import ContentAccordion from '@/shared/ui/accordions/ContentAccordion';

interface LmsFixtureModalProps {
  isOpen: boolean;
  onClose: () => void;
  props?: {
    tournamentId?: string;
  };
}

const formatRoundDateRange = (dateGroups: SelectGameData['dateGroups']) => {
  const dates = dateGroups.map(group => group.date).filter(Boolean);
  if (dates.length === 0) return '';
  if (dates.length === 1) return formatDateToWeekdayOrdinalMonth(dates[0]);
  return `${formatDateToWeekdayOrdinalMonth(dates[0])} - ${formatDateToWeekdayOrdinalMonth(dates[dates.length - 1])}`;
};

const LmsFixtureModal = ({ isOpen, onClose, props }: LmsFixtureModalProps) => {
  const t = useTranslations('last_man_standing');
  const params = useParams();
  const routeTournamentId = String(params?.id || '');
  const tournamentId = String(props?.tournamentId || routeTournamentId || '');
  const [rounds, setRounds] = useState<SelectGameData[]>([]);
  const [isLoadingRounds, setIsLoadingRounds] = useState(false);

  const tournamentInformation = useGraphWsFetcher<{
    playerTournamentInformation: PlayerTournamentInformation[];
  }>(GRAPHQL_TYPES.LMS_GET_PLAYER_TOURNAMENT_INFORMATION).render(tournamentId ? { tournamentId } : undefined, {
    enabled: Boolean(tournamentId && isOpen)
  });
  const getPlayerAvailableTeamsAction = useGraphWsFetcher<{
    playerActiveRoundFixtures: PlayerActiveRoundFixturesResponse;
  }>(GRAPHQL_TYPES.LMS_GET_PLAYER_AVAILABLE_TEAMS).action();

  const tournamentInfo = tournamentInformation.data?.playerTournamentInformation?.[0];
  const totalRounds = Number(tournamentInfo?.total_round_count || tournamentInfo?.max_rounds || 0);

  useEffect(() => {
    if (!isOpen || !tournamentId || totalRounds <= 0) {
      if (!isOpen) setRounds([]);
      return;
    }

    if (tournamentInformation.isLoading) return;

    let cancelled = false;

    const loadRounds = async () => {
      setIsLoadingRounds(true);
      try {
        const responses = await Promise.all(
          Array.from({ length: totalRounds }, (_, index) =>
            getPlayerAvailableTeamsAction.mutateAsync({
              tournamentId,
              roundNo: index + 1
            })
          )
        );
        if (cancelled) return;
        setRounds(
          responses.map((response, index) =>
            lmsMapActiveRoundResponseToSelectData(response.playerActiveRoundFixtures, {
              alwaysShowOddsInBoxes: true,
              roundNo: index + 1,
              pickedTeams: tournamentInfo?.picked_teams
            })
          )
        );
      } catch {
        if (!cancelled) setRounds([]);
      } finally {
        if (!cancelled) setIsLoadingRounds(false);
      }
    };

    void loadRounds();
    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    totalRounds,
    tournamentId,
    tournamentInformation.isLoading,
    tournamentInfo?.competition_name,
    tournamentInfo?.game_name,
    tournamentInfo?.picked_teams
  ]);

  const accordionData = useMemo(
    () =>
      rounds.map((round, index) => ({
        id: String(index + 1),
        header: (
          <div className="flex flex-col">
            <span className="uppercase">{round.matchDay}</span>
            <span className="text-white/70 text-sm">{formatRoundDateRange(round.dateGroups) || 'No fixtures'}</span>
          </div>
        ),
        content: <MatchList data={round} selectionDisabled={true} showOddsBookmaker />
      })),
    [rounds]
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="full"
      variant="default"
      header={t('fixture_title')}
      closeButtonSize="md"
      headerClassName="text-left text-[17px] tracking-[0.08em] uppercase"
      mainClassName="!p-0"
      modalClassName="bg-toshi_body h-[85vh] w-full max-w-[450px] max-md:max-w-full"
      contentClassName="!p-0"
    >
      <ModalContent className="p-0 overflow-y-scroll w-full h-[75vh] pb-10">
        <div className="relative h-[200px]">
          <Image
            src={tournamentInfo?.image_url || '/assets/images/tournament_join.jpg'}
            alt="LMS Fixture"
            width={1000}
            height={1000}
            className="h-full w-full object-cover absolute top-0 left-0"
          />
          <div
            className="relative h-full w-full"
            style={{
              background: 'linear-gradient(180deg, rgba(27, 32, 49, 0) 0%, rgba(27, 32, 49, 0.8) 50%, #1B2031 100%)'
            }}
          >
            <div className="absolute inset-x-0 bottom-1 z-10 flex items-center justify-between p-1 w-full gap-2 px-3">
              <div className="w-full rounded-xl p-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white">{tournamentInfo?.game_name || 'Tournament'}</p>
                </div>

                <p className="text-md font-black text-white">
                  {lmsFormatCurrencyMinor(
                    tournamentInfo?.prize_amount_minor || 0,
                    tournamentInfo?.prize_currency || 'USD'
                  )}
                </p>
              </div>
              <LeagueLogo
                logoUrl={tournamentInfo?.competition_image || '/assets/images/team.png'}
                className="w-20 h-16 p-2 rounded-xl"
              />
            </div>
          </div>
        </div>
        {isLoadingRounds ? (
          <div className="px-6 py-10 text-center text-sm text-white/50">Loading fixtures...</div>
        ) : accordionData.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-white/50">No round fixtures found.</div>
        ) : (
          <ContentAccordion
            data={accordionData}
            bgColor="transparent"
            accordionClassName="p-0"
            accordionItemClassName="border-y border-white/10 rounded-none px-6"
            accordionTriggerClassName="py-4"
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default LmsFixtureModal;
