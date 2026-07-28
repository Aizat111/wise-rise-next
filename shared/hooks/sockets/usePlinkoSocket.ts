import { useSocket } from './useSocket';
import { SocketNamespace } from '@/core/lib/socketConfig';
import type { PlinkoClientToServer, PlinkoServerToClient } from '@/core/types/socket-events';

export const usePlinkoSocket = () => {
  const { connected, emit, on, off } = useSocket<PlinkoServerToClient, PlinkoClientToServer>(SocketNamespace.PLINKO);

  return { connected, emit, on, off };
};
