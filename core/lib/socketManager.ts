/* eslint-disable no-unused-vars */
import type { Socket } from 'socket.io-client';

import { type NamespaceOptions, SOCKET_API_URLS, SOCKET_DEBUG, SocketNamespace } from './socketConfig';

// ✅ HMR-safe, app-wide cache (Next.js dev fast-refresh friendly)
//   - Avoids creating a new Manager on every refresh/rerender
const globalKey = '__TOSHI_SOCKETS__';
const globalCache: Map<SocketNamespace, Socket<any, any>> = (globalThis as any)[globalKey] ||
((globalThis as any)[globalKey] = new Map());

const isBrowser = () => typeof window !== 'undefined';

const attachHeartbeat = (socket: Socket, intervalMs = 25000) => {
  let timer: ReturnType<typeof setInterval> | undefined;
  const start = () => {
    clearInterval(timer as any);
    timer = setInterval(() => {
      if (socket.connected) socket.emit('client:ping');
    }, intervalMs);
  };
  const stop = () => timer && clearInterval(timer);
  socket.on('connect', start);
  socket.on('disconnect', stop);
  return () => stop();
};

const materializeOptions = async (opts: NamespaceOptions): Promise<NamespaceOptions> => {
  const auth = typeof opts.authResolver === 'function' ? await opts.authResolver() : undefined;
  const { ...rest } = opts;
  return auth ? { ...rest, auth } : rest;
};

export const getSocket = async <
  S2C extends Record<string, (...a: any[]) => void> = any,
  C2S extends Record<string, (...a: any[]) => void> = any
>(
  namespace: SocketNamespace
): Promise<Socket<S2C, C2S>> => {
  if (!isBrowser()) throw new Error('Sockets are only available in the browser');
  const existing = globalCache.get(namespace);
  if (existing) return existing as Socket<S2C, C2S>;

  // Lazy-load socket.io-client to keep it out of the initial JS bundle.
  const { io } = await import('socket.io-client');

  const { url, options } = SOCKET_API_URLS[namespace];
  const resolved = await materializeOptions(options);
  const socket = io(url, resolved);

  socket.on('connect', () => SOCKET_DEBUG && console.log(`[${namespace}] ✅ connected`, { id: socket.id }));
  socket.on('disconnect', reason => SOCKET_DEBUG && console.warn(`[${namespace}] ⚠️ disconnected:`, reason));
  socket.on('connect_error', err => SOCKET_DEBUG && console.error(`[${namespace}] ❌ connect_error:`, err.message));
  socket.on('reconnect_attempt', n => SOCKET_DEBUG && console.log(`[${namespace}] reconnect_attempt #${n}`));
  socket.on('error', (err: any) => SOCKET_DEBUG && console.error(`[${namespace}] general error:`, err));

  attachHeartbeat(socket);

  globalCache.set(namespace, socket);
  return socket as Socket<S2C, C2S>;
};

export const connectSocket = async (namespace: SocketNamespace) => {
  const socket = await getSocket(namespace);
  // ✅ Guard against duplicate connect calls (StrictMode / multiple hooks)
  // - socket.connected: already connected
  // - (socket as any).active: true if a connection attempt is in flight
  const s: any = socket as any;
  if (socket.connected || s.active) return socket;
  if (!s.__connecting) {
    s.__connecting = true;
    socket.connect();
    // release the flag on first connect_error/connected
    const release = () => {
      s.__connecting = false;
      socket.off('connect', release);
      socket.off('connect_error', release);
    };
    socket.once('connect', release);
    socket.once('connect_error', release);
  }
  return socket;
};

export const disconnectSocket = (namespace: SocketNamespace) => {
  const sock = globalCache.get(namespace);
  if (!sock) return;
  try {
    sock.removeAllListeners();
  } catch {
    /* noop */
  }
  sock.disconnect();
  globalCache.delete(namespace);
};

export const withSocket = async <R>(namespace: SocketNamespace, fn: (s: Socket) => R | Promise<R>) => {
  const s = await connectSocket(namespace);
  return fn(s);
};
