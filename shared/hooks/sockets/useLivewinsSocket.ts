import { useEffect } from 'react';

import { useSocket } from './useSocket';
import { SocketNamespace } from '@/core/lib/socketConfig';
import type { LivewinsClientToServer, LivewinsServerToClient } from '@/core/types/socket-events';

export const useLivewinsSocket = () => {
  const { connected, emit, on, socket } = useSocket<LivewinsServerToClient, LivewinsClientToServer>(
    SocketNamespace.LIVEWINS
  );

  useEffect(() => {
    if (!connected) return;
    emit('user:liveWins');
    return () => {
      // Avoid queuing a leave when disconnected; only emit if still connected
      if (socket?.connected) {
        socket.emit('user:liveWinsLeave');
      }
    };
  }, [connected, emit, socket]);

  return { connected, on, emit };
};
