import { useEffect } from 'react';

import { useSocket } from './useSocket';
import { SocketNamespace } from '@/core/lib/socketConfig';
import { EnumTokens } from '@/core/types/auth.types';
import type { UserClientToServer, UserServerToClient } from '@/core/types/socket-events';
import tokenStorage from '@/shared/utils/tokenStorage';

export const useUserSocket = () => {
  const { connected, emit, on, off } = useSocket<UserServerToClient, UserClientToServer>(SocketNamespace.USER);

  useEffect(() => {
    if (!connected) return;
    const token = tokenStorage.getItem(EnumTokens.ACCESS_TOKEN);
    if (token) emit('user:join', token);
    return () => {
      off('user:leave');
    };
  }, [connected, emit, off]);

  return { connected, emit, on, off };
};
