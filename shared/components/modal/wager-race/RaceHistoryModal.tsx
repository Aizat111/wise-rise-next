'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Modal, ModalContent } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import Table from '@/shared/ui/tables/Table';
import { formatWinAmount } from '@/shared/utils/numberUtils';

interface RaceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props: Record<string, unknown> & {
    raceData?: {
      affiliate_id: string;
      leaderboard_id: string;
      total_prize_pool: string;
      total_wagered: string;
      players: number;
      date: string;
    };
  };
}

interface ParticipantDetail {
  id: string;
  leaderboard_id: string;
  position: number;
  username: string;
  wagered_amount: number;
  prize_amount: string;
}

interface EndedLeaderboardDetailsResponse {
  success: boolean;
  data: ParticipantDetail[];
}

const RaceHistoryModal = ({ isOpen, onClose, props }: RaceHistoryModalProps) => {
  const t = useTranslations();
  const raceData = props.raceData;
  const [participantDetails, setParticipantDetails] = useState<ParticipantDetail[]>([]);

  const { data: detailsData, isFetching: isLoading } = useFetcher<EndedLeaderboardDetailsResponse>(
    TYPES.GET_ENDED_LEADERBOARD_DETAILS
  ).render(raceData?.leaderboard_id ? [{}, [raceData.leaderboard_id]] : undefined);

  useEffect(() => {
    if (detailsData?.data) {
      setParticipantDetails(detailsData.data);
    }
  }, [detailsData]);

  const truncateUsername = (username: string) => {
    if (!username) return '-';
    return username.length > 12 ? username.substring(0, 12) + '...' : username;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${formatWinAmount(numAmount)}`;
  };

  const participantColumns = [
    {
      title: 'Rank',
      dataIndex: 'position',
      key: 'position',
      render: (row: ParticipantDetail) => (
        <div className="flex items-center py-1 justify-center">
          <span className="text-sm font-bold text-white">{row.position}</span>
        </div>
      )
    },
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (row: ParticipantDetail) => (
        <span className="text-left text-sm font-semibold text-white pr-4 md:pr-6">
          {truncateUsername(row.username)}
        </span>
      )
    },
    {
      title: 'Wagered',
      dataIndex: 'wagered_amount',
      key: 'wagered_amount',
      render: (row: ParticipantDetail) => (
        <span className="text-sm font-semibold text-white80 pl-4 md:pl-6">
          {formatCurrency(row.wagered_amount || 0)}
        </span>
      )
    },
    {
      title: 'Prize',
      dataIndex: 'prize_amount',
      key: 'prize_amount',
      render: (row: ParticipantDetail) => (
        <span className={`text-sm font-semibold ${row.position <= 3 ? 'text-toshi-primary' : 'text-white80'}`}>
          {formatCurrency(row.prize_amount)}
        </span>
      )
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={t('affiliate.race_history_title')}
      size="lg"
      variant="default"
      modalClassName="bg-toshi_body overflow-y-scroll no-scrollbar"
    >
      <ModalContent className="p-0 pt-2 flex flex-col gap-6 ">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-toshi-primary border-t-transparent" />
              <span className="text-white80">{t('affiliate.loading_race_history')}</span>
            </div>
          </div>
        ) : raceData ? (
          <>
            <div className="flex flex-col gap-4 p-4 bg-bg_menu rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-bold text-white">{t('affiliate.wager_race')}</h3>
                <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded uppercase">
                  {t('affiliate.ended')}
                </span>
              </div>

              <div className="grid grid-cols-2 @[768px]:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white80">{t('affiliate.start_date')}</span>
                  <span className="text-sm font-semibold text-white">{formatDate(raceData.date)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white80">{t('affiliate.end_date')}</span>
                  <span className="text-sm font-semibold text-white">{formatDate(raceData.date)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white80">{t('affiliate.total_prize')}</span>
                  <span className="text-sm font-bold text-toshi-primary">
                    {formatCurrency(parseFloat(raceData.total_prize_pool))}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white80">{t('affiliate.total_wagered')}</span>
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(parseFloat(raceData.total_wagered || '0'))}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white80">{t('affiliate.players')}</span>
                  <span className="text-sm font-semibold text-white">{raceData.players}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-md font-semibold text-white">{t('affiliate.final_leaderboard')}</h3>

              <Table
                dataSource={participantDetails}
                columns={participantColumns}
                loading={isLoading}
                pagination={false}
                rowClassName={(_, index) =>
                  index % 2 === 0 ? 'bg-bg_menu hover:bg-bg_menu/80 py-3' : 'bg-toshi_body hover:bg-toshi_body/80 py-3'
                }
              />
            </div>

            <div className="flex justify-center pt-0">
              <Button appearance="solid" intent="primary" onClick={onClose} className="w-full @[768px]:w-auto">
                {t('affiliate.close')}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <span className="text-white80">{t('affiliate.no_race_data_found')}</span>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RaceHistoryModal;
