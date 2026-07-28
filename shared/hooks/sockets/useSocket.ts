/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';

import { SocketNamespace } from '@/core/lib/socketConfig';
import { connectSocket } from '@/core/lib/socketManager';

class EmitQueue<C2S extends Record<string, (...a: any[]) => void>> {
  private q: Array<{ event: keyof C2S & string; args: any[] }> = [];
  enqueue(event: keyof C2S & string, args: any[]) {
    this.q.push({ event, args });
  }
  flush(socket?: Socket<any, C2S>) {
    if (!socket || !socket.connected) return;
    while (this.q.length) {
      const item = this.q.shift()!;
      socket.emit(item.event, ...(item.args as Parameters<C2S[keyof C2S & string]>));
    }
  }
}

export function useSocket<
  S2C extends Record<string, (...a: any[]) => void>,
  C2S extends Record<string, (...a: any[]) => void>
>(namespace: SocketNamespace) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket<S2C, C2S> | null>(null);
  const queueRef = useRef(new EmitQueue<C2S>());

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let mounted = true;
    (async () => {
      const socket = await connectSocket(namespace);
      if (!mounted) return;
      socketRef.current = socket as Socket<S2C, C2S>;

      const onConnect = () => {
        setConnected(true);
        queueRef.current.flush(socketRef.current as any);
      };
      const onDisconnect = () => {
        setConnected(false);
      };
      const onError = () => {
        setConnected(false);
      };

      if (socket.connected) onConnect();
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('connect_error', onError);

      unsub = () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('connect_error', onError);
      };
    })();

    return () => {
      mounted = false;
      unsub?.();
    };
  }, [namespace]);

  const emit = useCallback(<K extends keyof C2S & string>(event: K, ...args: Parameters<C2S[K]>) => {
    const sock = socketRef.current as Socket<S2C, C2S> | null;
    if (!sock) return;
    if (!sock.connected) {
      queueRef.current.enqueue(event, args as unknown as any[]);
      sock.once('connect', () => queueRef.current.flush(sock));
      return;
    }
    sock.emit(event, ...(args as any));
  }, []);

  const on = useCallback(<K extends keyof S2C & string>(event: K, cb: S2C[K]) => {
    const sock = socketRef.current as Socket<S2C, C2S> | null;
    if (!sock) return () => {};
    const handler = (...a: any[]) => (cb as any)(...a);
    sock.on(event, handler as any);
    return () => sock.off(event, handler as any);
  }, []);

  const off = useCallback(<K extends keyof S2C & string>(event: K, cb?: S2C[K]) => {
    const sock = socketRef.current as Socket<S2C, C2S> | null;
    if (!sock) return;
    sock.off(event, cb as any);
  }, []);

  return { connected, emit, on, off, socket: socketRef.current };
}
