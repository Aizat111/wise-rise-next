import { useEffect, useState } from 'react';

import { useUserSocket } from './useUserSocket';

interface LeaderboardParticipant {
  user_id: string;
  username: string;
  wagered_amount: string;
  position: number;
  prize_amount: string;
}

interface LeaderboardUpdate {
  leaderboard_id: string;
  standings: LeaderboardParticipant[];
}

export const useLeaderboardSocket = () => {
  const { connected, on } = useUserSocket();
  const [leaderboardUpdate, setLeaderboardUpdate] = useState<LeaderboardUpdate | null>(null);

  useEffect(() => {
    if (!connected) return;

    const cleanup = on('leaderboard:standings_update', (data: LeaderboardUpdate) => {
      setLeaderboardUpdate(data);
    });

    return () => {
      cleanup();
    };
  }, [connected, on]);

  return { connected, leaderboardUpdate };
};
