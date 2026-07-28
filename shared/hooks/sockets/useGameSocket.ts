import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useSocket } from './useSocket';
import { SocketNamespace } from '@/core/lib/socketConfig';
import { updateBetStats } from '@/core/redux-toolkit/slices/betsSlice';
import { EnumTokens } from '@/core/types/auth.types';
import { BetAmount } from '@/core/types/games.type';
import type { GamesClientToServer, GamesServerToClient } from '@/core/types/socket-events';
import tokenStorage from '@/shared/utils/tokenStorage';

export const useGameSocket = () => {
  const { connected, emit, on, off } = useSocket<GamesServerToClient, GamesClientToServer>(SocketNamespace.GAMES);
  const dispatch = useDispatch();

  useEffect(() => {
    if (connected && tokenStorage.getItem(EnumTokens.ACCESS_TOKEN)) {
      emit('games:join', tokenStorage.getItem(EnumTokens.ACCESS_TOKEN) ?? '');
      const handleBets = (data: BetAmount) => {
        const betAmount = parseFloat(data.b);
        const winAmount = data.nw;
        dispatch(
          updateBetStats({
            win: winAmount,
            bet: betAmount,
            gameType: 'hub88'
          })
        );
      };
      off('games:bets');
      on('games:bets', handleBets);
    }
    return () => {
      if (connected) {
        off('games:bets');
      }
    };
  }, [connected, emit, off, tokenStorage.getItem(EnumTokens.ACCESS_TOKEN)]);

  return { connected, emit, on, off };
};
