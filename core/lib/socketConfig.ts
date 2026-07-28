/* eslint-disable no-unused-vars */
import type { ManagerOptions, SocketOptions } from 'socket.io-client';

export enum SocketNamespace {
  CHAT = 'chat',
  LIVEWINS = 'livewins',
  PLINKO = 'plinko',
  USER = 'user',
  GAMES = 'games'
}

export type NamespaceOptions = Partial<ManagerOptions & SocketOptions> & {
  authResolver?: () => Promise<Record<string, unknown> | undefined> | Record<string, unknown> | undefined;
};
const GENERAL_SOCKET_OPTIONS = {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 800,
  reconnectionDelayMax: 8000,
  timeout: 20000,
  forceNew: false,
  closeOnBeforeunload: false
};

export const SOCKET_API_URLS: Record<SocketNamespace, { url: string; options: NamespaceOptions }> = {
  [SocketNamespace.CHAT]: {
    url: process.env.NEXT_PUBLIC_CHAT_API_URL ?? 'http://localhost:4000/chat',
    options: {
      ...GENERAL_SOCKET_OPTIONS
    }
  },
  [SocketNamespace.LIVEWINS]: {
    url: process.env.NEXT_PUBLIC_USER_SOCKET_URL ?? 'http://localhost:4000/livewins',
    options: {
      ...GENERAL_SOCKET_OPTIONS
    }
  },
  [SocketNamespace.PLINKO]: {
    url: process.env.NEXT_PUBLIC_PLINKO_API_URL ?? 'http://localhost:4000/plinko',

    options: {
      ...GENERAL_SOCKET_OPTIONS
    }
  },
  [SocketNamespace.USER]: {
    url: process.env.NEXT_PUBLIC_USER_SOCKET_URL ?? 'http://localhost:4000/user',
    options: {
      ...GENERAL_SOCKET_OPTIONS
    }
  },
  [SocketNamespace.GAMES]: {
    url: process.env.NEXT_PUBLIC_SLOTEGRATOR_API_URL ?? 'http://localhost:4000/games',
    options: {
      ...GENERAL_SOCKET_OPTIONS
    }
  }
};

export const SOCKET_DEBUG = false;
