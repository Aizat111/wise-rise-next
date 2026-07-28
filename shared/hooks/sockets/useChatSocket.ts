import { useSocket } from './useSocket';
import { SocketNamespace } from '@/core/lib/socketConfig';
import type { ChatClientToServer, ChatServerToClient } from '@/core/types/socket-events';

export const useChatSocket = () => {
  const { connected, emit, on } = useSocket<ChatServerToClient, ChatClientToServer>(SocketNamespace.CHAT);

  return { connected, emit, on };
};
