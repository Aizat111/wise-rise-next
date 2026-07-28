'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Loader } from '../../../ui/loaders/Loader';
import { Modal, ModalContent } from '../Modal';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { cn } from '@/core/lib/utils';
import type {
  PlayerTournamentInformation,
  PlayerTournamentParticipant,
  PlayerTournamentReport
} from '@/core/types/lms.types';
import StatsContent from '@/screens/last-man-standing/lms-place-a-bet/partials/stats/partials/StatsContent';
import SwitchInput from '@/shared/ui/inputs/SwitchInput';

export interface ParticipantItem {
  username: string;
  avatarUrl?: string | null;
  eliminated?: boolean;
  eliminatedOnMatchDay?: number;
}

interface LmsParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  props?: {
    tournamentId?: string;
  };
  participants?: ParticipantItem[];
}

const LmsParticipantsModal = ({ isOpen, onClose, props, participants }: LmsParticipantsModalProps) => {
  const t = useTranslations('last_man_standing');
  const params = useParams();
  const routeTournamentId = String(params?.id || '');
  const [hideEliminated, setHideEliminated] = useState(false);
  const tournamentId = String(props?.tournamentId || routeTournamentId || '');

  const tournamentInformation = useGraphWsFetcher<{
    playerTournamentInformation: PlayerTournamentInformation[];
  }>(GRAPHQL_TYPES.LMS_GET_PLAYER_TOURNAMENT_INFORMATION).render(tournamentId ? { tournamentId } : undefined, {
    enabled: Boolean(tournamentId && isOpen)
  });

  const tournamentReport = useGraphWsFetcher<{
    playerTournamentReport: PlayerTournamentReport;
  }>(GRAPHQL_TYPES.LMS_GET_TOURNAMENT_REPORT).render(tournamentId ? { tournamentId } : undefined, {
    enabled: Boolean(tournamentId && isOpen)
  });

  const tournamentParticipants = useGraphWsFetcher<{
    playerTournamentParticipants: PlayerTournamentParticipant[];
  }>(GRAPHQL_TYPES.LMS_GET_TOURNAMENT_PARTICIPANTS).render(tournamentId ? { tournamentId } : undefined, {
    enabled: Boolean(tournamentId && isOpen)
  });

  const tournamentInfo = tournamentInformation.data?.playerTournamentInformation?.[0];
  const tournamentReportData = tournamentReport.data?.playerTournamentReport;
  const resolvedParticipants = useMemo<ParticipantItem[]>(() => {
    if (participants?.length) return participants;
    return (tournamentParticipants.data?.playerTournamentParticipants || []).map(participant => ({
      username: participant.username || participant.player_id,
      avatarUrl: null,
      eliminated: participant.state !== 'ACTIVE' || Number(participant.eliminated_round || 0) > 0,
      eliminatedOnMatchDay: Number(participant.eliminated_round || 0) || undefined
    }));
  }, [participants, tournamentParticipants.data?.playerTournamentParticipants]);

  const visibleParticipants = useMemo(() => {
    if (hideEliminated) return resolvedParticipants.filter(p => !p.eliminated);
    return resolvedParticipants;
  }, [resolvedParticipants, hideEliminated]);

  const totalPlayers = Number(tournamentReportData?.total_players || 0);
  const activeRoundNo = Number(tournamentInfo?.player_current_round || 1);
  const remainingPlayers = Number(
    tournamentInfo?.active_players || resolvedParticipants.filter(participant => !participant.eliminated).length || 0
  );
  const eliminatedPlayers = Math.max(totalPlayers - remainingPlayers, 0);

  const topPercent = totalPlayers > 0 ? Number(((remainingPlayers / totalPlayers) * 100).toFixed(1)) : 0;
  const chanceOfWinningPercent =
    tournamentInfo?.player_state === 'ACTIVE' && remainingPlayers > 0 ? Number((100 / remainingPlayers).toFixed(1)) : 0;
  const graphData =
    totalPlayers > 0
      ? [
          { week: 0, value: 0 },
          ...(tournamentReportData?.rounds?.slice(0, activeRoundNo).map(round => ({
            week: round.round_no,
            value: round.round_no <= activeRoundNo ? round.participant_count : 0
          })) || [])
        ]
      : undefined;

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
      header={t('participants_title')}
      closeButtonSize="md"
      headerClassName="text-left text-[17px] tracking-[0.08em] uppercase"
      mainClassName="!p-0"
      modalClassName="bg-toshi_body h-[85vh] w-full max-w-[450px] max-md:max-w-full"
    >
      <ModalContent className="p-0 overflow-y-scroll w-full h-[75vh] pb-10 pt-5">
        {tournamentParticipants?.isFetching ? (
          <Loader variant="spinner" size="lg" />
        ) : (
          <>
            <StatsContent
              totalParticipants={totalPlayers}
              eliminatedCount={eliminatedPlayers}
              remainingCount={remainingPlayers}
              topPercent={topPercent}
              chanceOfWinningPercent={chanceOfWinningPercent}
              graphData={graphData}
              statsGraphClassName="bg-bg_menu p-3"
              showBottomStats={false}
              participantRowsClassName="bg-bg_menu p-3"
            />

            {/* Names section - participant list with Hide Eliminated toggle */}
            <div className="mt-4 px-0 pb-6">
              <div className="rounded-xl overflow-hidden bg-bg_menu">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white uppercase">{t('names')}</h3>
                  <SwitchInput
                    label={t('hide_eliminated')}
                    labelPosition="left"
                    isTranslated={false}
                    labelClassName="text-sm font-medium text-white/70"
                    containerClassName="mb-0"
                    inputWrapperClassName="gap-2"
                    checked={hideEliminated}
                    onCheckedChange={value => setHideEliminated(Boolean(value))}
                  />
                </div>
                <div className="divide-y divide-white/10 max-h-[50vh] overflow-y-auto">
                  {tournamentParticipants.isLoading && !participants?.length ? (
                    <div className="px-4 py-6 text-center text-sm text-white/50">Loading participants...</div>
                  ) : visibleParticipants.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-white/50">No participants found.</div>
                  ) : (
                    visibleParticipants.map((participant, index) => (
                      <div
                        key={`${participant.username}-${index}`}
                        className={cn(
                          'flex items-center justify-between gap-3 px-4 py-3',
                          'bg-toshi_body/80 hover:bg-toshi_body/90 transition-colors'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={cn(
                              'h-9 w-9 shrink-0 rounded-full overflow-hidden bg-bg_content flex items-center justify-center border border-white/10',
                              participant.eliminated && 'opacity-60'
                            )}
                          >
                            {participant.avatarUrl ? (
                              <Image
                                src={participant.avatarUrl.trim()}
                                alt={participant.username}
                                width={36}
                                height={36}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span
                                className={cn(
                                  'text-sm font-semibold text-white/90',
                                  participant.eliminated && 'text-white/50'
                                )}
                              >
                                {participant.username.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span
                            className={cn(
                              'text-sm font-medium truncate',
                              participant.eliminated ? 'text-white/60' : 'text-white'
                            )}
                          >
                            {participant.username}
                          </span>
                        </div>
                        {participant.eliminated && participant.eliminatedOnMatchDay != null && (
                          <div className="shrink-0 text-right">
                            <p className="text-xs font-semibold text-destructive text-red-500/60">
                              {t('eliminated_on')}
                            </p>
                            <p className="text-xs text-white/60">
                              {t('match_day', { number: participant.eliminatedOnMatchDay })}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LmsParticipantsModal;
