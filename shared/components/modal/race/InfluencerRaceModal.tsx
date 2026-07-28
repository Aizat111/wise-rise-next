'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Modal, ModalContent } from '../Modal';

import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import { cn } from '@/core/lib/utils';
import type { IMyRace, IMyRaceResponse } from '@/core/types/user.types';
import UserName from '@/screens/profile/UserName';
import Image from '@/shared/ui/Images/Image';
import { Loader } from '@/shared/ui/loaders/Loader';
import { formatNumberWithDecimals } from '@/shared/utils/numberUtils';

interface InfluencerRaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: string;
  props?: {
    raceData?: IMyRaceResponse['data'];
  };
}

const formatTimeRemaining = (endTime: string): string => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const difference = end - now;

  if (difference <= 0) {
    return 'Race Ended';
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const InfluencerRaceModal = ({ isOpen, onClose, props: modalProps }: InfluencerRaceModalProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const raceDataFetcher = useFetcher<IMyRaceResponse>(TYPES.GET_LEADERBOARD_MY_RACE).render();

  const raceData = modalProps?.raceData || raceDataFetcher.data?.data;
  const isLoading = !modalProps?.raceData && raceDataFetcher.isFetching;

  useEffect(() => {
    if (raceData?.stats?.end_date) {
      const updateTimer = () => {
        setTimeLeft(formatTimeRemaining(raceData.stats.end_date));
      };
      updateTimer();
      const interval = setInterval(updateTimer, 60000);
      return () => clearInterval(interval);
    }
  }, [raceData?.stats?.end_date]);

  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnEscape={true}
        size="lg"
        variant="default"
        header="Loading Race..."
        headerClassName="text-center"
        modalClassName="bg-toshi_body"
      >
        <ModalContent className="flex items-center justify-center h-64">
          <Loader variant="spinner" size="lg" />
        </ModalContent>
      </Modal>
    );
  }

  if (!raceData) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnEscape={true}
        size="lg"
        variant="default"
        header="No Active Race"
        headerClassName="text-center"
        modalClassName="bg-toshi_body"
      >
        <ModalContent className="flex flex-col items-center justify-center gap-4 h-64">
          <div className="bg-white/10 px-4 py-3 rounded-lg flex items-center gap-3">
            <div className="size-5 rounded-full bg-primary-500/20 flex items-center justify-center">
              <div className="size-2 rounded-full bg-primary-500" />
            </div>
            <p className="text-white/70 text-sm">You are not currently participating in any race.</p>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  const { stats, standings } = raceData;
  const userEntry = standings.find((entry: IMyRace) => entry.me);
  const userPosition = userEntry?.position || 0;
  const userPrize = userEntry?.prize_amount || '0';
  const userWagered = userEntry?.wagered_amount || '0';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="lg"
      variant="default"
      header={
        <div className="flex items-center justify-center gap-1">
          <UserName username={stats.username} level={0} isTruncated={false} className="!max-w-none text-base pr-0" />
          <span>'s Race</span>
        </div>
      }
      headerClassName="text-center"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 max-h-[70vh] overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between bg-white/5 p-4 rounded-lg border-l-4 border-primary-500">
            <div className="flex flex-col gap-1">
              <span className="text-white text-sm font-bold">Time Left</span>
              <div className="flex items-center gap-2 bg-toshi_menu px-3 py-1 rounded">
                <Clock className="size-4 text-primary-500" />
                <span className="text-white text-base font-bold">{timeLeft}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-white/70 text-sm font-bold">Prize Pool</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-base font-bold">
                  {formatNumberWithDecimals(Number(stats.total_prize_pool))}
                </span>
                <Image src="/assets/currencies/dollar.svg" alt="dollar" width={18} height={18} />
              </div>
            </div>
          </div>

          {userPosition > 0 && (
            <div className="bg-toshi_menu p-4 rounded-lg">
              <h3 className="text-white text-base font-bold mb-3">Your Stats</h3>
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-xs">Position</span>
                  <span className="text-white text-sm font-bold">{getOrdinal(userPosition)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-xs">Prize</span>
                  <span className="text-white text-sm font-bold">${formatNumberWithDecimals(Number(userPrize))}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-xs">Wagered</span>
                  <span className="text-white text-sm font-bold">${formatNumberWithDecimals(Number(userWagered))}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/5 p-3 rounded-lg">
            <h3 className="text-white text-sm font-bold mb-2">About the Race</h3>
            <p className="text-white/70 text-sm font-semibold">
              Wager more to climb the leaderboard and win a share of the $
              {formatNumberWithDecimals(Number(stats.total_prize_pool))} prize pool. Winnings will be added to your
              balance automatically.
            </p>
          </div>

          <div className="bg-toshi_menu p-3 rounded-lg min-h-[400px]">
            <h3 className="text-white text-sm font-bold mb-2">Leaderboard</h3>
            <div className="flex justify-between px-2 py-1 mb-1 bg-white/5 rounded-sm">
              <span className="text-white/70 text-xs font-bold w-[15%]">Rank</span>
              <span className="text-white/70 text-xs font-bold w-[25%]">User</span>
              <span className="text-white/70 text-xs font-bold w-[40%] text-left">Wagered</span>
              <span className="text-white/70 text-xs font-bold w-[20%] text-right">Prize</span>
            </div>
            <div className="flex flex-col gap-1">
              {standings.length > 0 ? (
                standings.map((entry: IMyRace, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      'flex justify-between p-2 rounded-sm transition-all',
                      entry.me ? 'bg-white/10 border border-primary-500/50' : 'hover:bg-white/5'
                    )}
                  >
                    <span className="text-white text-xs font-bold w-[15%]">{entry.position}.</span>
                    <span className="w-[25%] truncate">
                      <UserName
                        username={entry.username}
                        level={0}
                        maxLength={100}
                        className="!max-w-none text-xs text-white font-semibold pr-0"
                      />
                    </span>
                    <span className="text-white/70 text-xs font-semibold w-[40%] text-left">
                      ${formatNumberWithDecimals(Number(entry.wagered_amount))}
                    </span>
                    <span className="text-white text-xs font-bold w-[20%] text-right">
                      ${formatNumberWithDecimals(Number(entry.prize_amount || 0))}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-white/70 text-xs text-center py-8">No standings available yet</p>
              )}
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default InfluencerRaceModal;
