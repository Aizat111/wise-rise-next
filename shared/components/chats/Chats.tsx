'use client';

// import ChatItem from './ChatItem';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';

// import { useChatSocket } from '@/hooks/useChatSocket';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { cn } from '@/core/lib/utils';
import type { ISocketChatMessage, Message } from '@/core/types/chat.types';
import { useChatSocket } from '@/shared/hooks/sockets/useChatSocket';
import { SkeletonLoader } from '@/shared/ui/SkeletonLoader';

const ChatItem = dynamic(() => import('./ChatItem').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="" /> // placeholder
});

const normalize = (m: ISocketChatMessage): Message => {
  let metadata = m.metadata;
  if (typeof metadata === 'string') {
    try {
      metadata = JSON.parse(metadata);
    } catch (e) {
      console.error('Error parsing metadata', e);
    }
  }
  return {
    id: m.id,
    user: m.user,
    message: m.message,
    message_type: m.message_type,
    metadata: metadata as any,
    profile_img: m.profile_img,
    username: m.username,
    level: m.level,
    created_at: m.created_at,
    updated_at: m.updated_at
  };
};

const mergeDedupe = (a: Message[], b: Message[]) => {
  const map = new Map<string, Message>();
  for (const m of [...a, ...b]) map.set(m.id.toString(), m);
  return [...map.values()].sort((x, y) => {
    const dx = new Date(x.created_at).getTime();
    const dy = new Date(y.created_at).getTime();
    return dx - dy;
  });
};

const Chats = () => {
  const { connected, on } = useChatSocket();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUpRef = useRef(false);
  const userInteractedRef = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const initializedFromFetchRef = useRef(false);

  const messagesList = useFetcher<Message[]>(TYPES.GET_MESSAGES).render({
    page: 1,
    perPage: 50
  });

  useEffect(() => {
    const data = messagesList?.data ?? [];
    if (!data.length) return;

    if (!initializedFromFetchRef.current) {
      initializedFromFetchRef.current = true;
      setMessages(mergeDedupe([], data));
    }
  }, [messagesList?.data]);

  // ✅ Yeni mesajlar (socket)
  useEffect(() => {
    if (!connected) return;

    const unsubscribeNew = on('chat:newMessage', (socketMessage: ISocketChatMessage) => {
      const msg = normalize(socketMessage);
      setMessages(prev => {
        // Fast check: does message already exist?
        if (prev.find(m => m.id === msg.id)) return prev;
        // Otherwise, add to front and keep sorted
        return mergeDedupe([msg], prev);
      });
    });

    const unsubscribeUpdate = on('chat:updateMessage', (socketMessage: ISocketChatMessage) => {
      const msg = normalize(socketMessage);
      setMessages(prev => {
        const index = prev.findIndex(m => m.id === msg.id);
        if (index === -1) return prev;

        const newMessages = [...prev];
        newMessages[index] = { ...newMessages[index], ...msg };
        return newMessages;
      });
    });

    return () => {
      unsubscribeNew?.();
      unsubscribeUpdate?.();
    };
  }, [connected, on]);

  useEffect(() => {
    if (!connected) return;

    const unsubscribe = on('chat:deleteMessage', (resp: { messageId: string }) => {
      setMessages(prev => {
        // Fast check: is message in list?
        const exists = prev.findIndex(m => m.id === resp.messageId) >= 0;
        if (!exists) return prev;
        return prev.filter(m => m.id !== resp.messageId);
      });
    });

    return () => {
      unsubscribe?.();
    };
  }, [connected, on]);

  // Track user scroll to pause autoscroll when scrolled up
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!userInteractedRef.current) return;
      const threshold = 48;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
      userHasScrolledUpRef.current = !atBottom;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Mark user interaction so we only pause when the user actually scrolls
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const markInteracted = () => {
      userInteractedRef.current = true;
    };
    el.addEventListener('wheel', markInteracted, { passive: true });
    el.addEventListener('touchstart', markInteracted, { passive: true });
    el.addEventListener('pointerdown', markInteracted);
    return () => {
      el.removeEventListener('wheel', markInteracted);
      el.removeEventListener('touchstart', markInteracted);
      el.removeEventListener('pointerdown', markInteracted);
    };
  }, []);

  const lastMessageId = useMemo(() => messages.at(-1)?.id ?? null, [messages]);
  useEffect(() => {
    if (!lastMessageId) return;
    if (userHasScrolledUpRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [lastMessageId]);

  return (
    <div ref={containerRef} className={cn('flex flex-col gap-2 overflow-y-auto h-full min-h-0 no-scrollbar')}>
      {messagesList?.isFetching && <SkeletonLoader count={10} containerClassName="flex-wrap" variant="chat-item" />}

      {messages.map(message => (
        <ChatItem key={message.id} message={message} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default Chats;
