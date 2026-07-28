'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { mapRoundPickToMatchPick } from '../../../../core/lib/lmsUtls';
import { Modal, ModalContent } from '../Modal';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { cn } from '@/core/lib/utils';
import type { PlayerTournamentInformation } from '@/core/types/lms.types';
import Image from '@/shared/ui/Images/Image';

interface PastSelectionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PastSelections = ({ isOpen, onClose }: PastSelectionsProps) => {
  const t = useTranslations('last_man_standing');
  const params = useParams();
  const tournamentId = String(params?.id || '');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleClose = () => {
    onClose();
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const tournamentInformation = useGraphWsFetcher<{
    playerTournamentInformation: PlayerTournamentInformation[];
  }>(GRAPHQL_TYPES.LMS_GET_PLAYER_TOURNAMENT_INFORMATION).render(tournamentId ? { tournamentId } : undefined, {
    enabled: Boolean(tournamentId && isOpen)
  });

  const tournamentInfo = tournamentInformation.data?.playerTournamentInformation?.[0];

  const pastSelections = useMemo(() => {
    return [...(tournamentInfo?.picked_teams || [])]
      .filter(selection => selection.fixture_status === 'CLOSED')
      .sort((a, b) => (Number(b.round_no || 0) || 0) - (Number(a.round_no || 0) || 0))
      .map((selection, index) => {
        const matchPick = mapRoundPickToMatchPick(selection);
        return {
          id: `${selection.round_no}-${selection.team_id}-${index}`,
          roundNo: selection.round_no,
          selectedTeamId: selection.team_id as unknown as number,
          ...matchPick
        };
      });
  }, [tournamentInfo]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="full"
      variant="default"
      header={t('your_past_selections')}
      headerClassName="uppercase"
      mainClassName="!p-0"
      modalClassName="bg-toshi_body h-[85vh] w-full max-w-[450px] max-md:max-w-full"
    >
      <ModalContent className="p-0 overflow-y-scroll w-full max-h-[90vh]">
        <div className="flex flex-col gap-2 py-2">
          {tournamentInformation.isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-white/50">Loading selections...</div>
          ) : pastSelections.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-white/50">
              No past selections found for this tournament.
            </div>
          ) : (
            pastSelections.map(selection => {
              const isExpanded = expandedIds.has(selection.id);

              return (
                <div key={selection.id} className="rounded-lg overflow-hidden bg-bg_color">
                  <button
                    className="flex items-center w-full px-3 py-3 gap-3"
                    onClick={() => toggleExpand(selection.id)}
                  >
                    <Image
                      src={
                        selection.selectedTeamId === selection.homeId
                          ? selection.homeLogo || ''
                          : selection.awayLogo || ''
                      }
                      alt={selection.selectedTeamId === selection.homeId ? selection.homeTeam : selection.awayTeam}
                      width={44}
                      height={44}
                      className=" shrink-0"
                    />
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <p className="text-white/60 text-[13px]">Match Game {selection.roundNo}</p>
                      <h3 className="text-white font-bold truncate w-full text-left text-[17px]">
                        {selection.homeTeam}
                      </h3>
                    </div>
                    <div className="shrink-0 bg-[#1B2031] rounded-md px-2.5 py-4">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-2 py-4 border-t-2 border-toshi_body">
                      <div className="flex items-center justify-between gap-2 ">
                        <div
                          className={cn(
                            'flex items-center gap-2 flex-1 justify-end rounded-lg min-w-0 py-3 px-2',
                            selection.selectedTeamId === selection.homeId && 'bg-[#B4B7BC] text-black/80'
                          )}
                        >
                          <span className="text-sm truncate text-right">{selection.homeTeam}</span>
                          <Image
                            src={selection.homeLogo || ''}
                            alt={selection.homeTeam}
                            width={28}
                            height={28}
                            className="shrink-0"
                          />
                        </div>
                        <hr className="w-px h-[20px] border-none bg-white/10" />
                        <div
                          className={cn(
                            'flex items-center gap-2 flex-1 min-w-0 rounded-lg py-3 px-2 ',
                            selection.selectedTeamId === selection.awayId && 'bg-[#B4B7BC] text-black/80'
                          )}
                        >
                          <Image
                            src={selection.awayLogo || ''}
                            alt={selection.awayTeam}
                            width={28}
                            height={28}
                            className="shrink-0"
                          />
                          <span className="text-sm truncate font-medium">{selection.awayTeam}</span>
                        </div>
                      </div>
                      <div className="w-full flex items-center justify-center gap-2 text-white/70 text-[12px] font-bold mt-1">
                        <span>{selection.homeScore}</span>
                        <span>-</span>
                        <span>{selection.awayScore}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PastSelections;
