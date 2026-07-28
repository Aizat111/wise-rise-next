'use client';

import { ArrowDown, Pause, Pin, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';

import MuteUserModal from '../modal/chats/MuteUser';
import TimeoutUserModal from '../modal/chats/TimeoutUser';
import UserNotesModal from '../modal/chats/UserNotes';

import type { ChatMessageV2 } from './partials/chat-item/ChatItemV2';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphQLSubscription, useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { notify } from '@/core/lib/notify';
import { cn } from '@/core/lib/utils';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { SkeletonLoader } from '@/shared/ui/SkeletonLoader';
import {
  compareMessages,
  filterSuppressed,
  mergeDedupe,
  reconcileMessages,
  scrollToBottom
} from '@/shared/utils/chatCommands';

const ChatItemV2 = dynamic(() => import('./partials/chat-item/ChatItemV2').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="" />
});

interface ChatsV2Props {
  roomId: string | null;
  refreshToken?: number;
  onReply?: (_message: ChatMessageV2) => void;
}

const ChatsV2 = ({ roomId, refreshToken, onReply }: ChatsV2Props) => {
  const { user } = useAppSelector(state => state.user);

  // Fetchers
  const renderMessages = useGraphWsFetcher<{ getLastChatMessagesByChatRoom: { messageList: ChatMessageV2[] } }>(
    GRAPHQL_TYPES.MESSAGES_QUERY
  ).action();
  const actionSuppressMessage = useGraphWsFetcher<{ suppressChatMessage: { success: boolean } }>(
    GRAPHQL_TYPES.SUPPRESS_MESSAGE_MUTATION
  ).action();

  const actionPresenceHeartbeat = useGraphWsFetcher<{ chatPresenceHeartbeat: { success: boolean } }>(
    GRAPHQL_TYPES.PRESENCE_HEARTBEAT_MUTATION
  ).action();

  const actionGetPinnedMessage = useGraphWsFetcher<{ getPinnedChatMessage: ChatMessageV2 | null }>(
    GRAPHQL_TYPES.GET_PINNED_MESSAGE_QUERY
  ).action();
  const actionPinMessage = useGraphWsFetcher<{ pinChatMessage: ChatMessageV2 }>(
    GRAPHQL_TYPES.PIN_MESSAGE_MUTATION
  ).action();
  const actionUnpinMessage = useGraphWsFetcher<{ unpinChatMessage: boolean }>(
    GRAPHQL_TYPES.UNPIN_MESSAGE_MUTATION
  ).action();

  const canModerate = ['admin', 'super_admin', 'moderator'].includes(user?.role || '');
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [muteOpen, setMuteOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [target, setTarget] = useState<ChatMessageV2 | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUpRef = useRef(false);
  const userInteractedRef = useRef(false);
  const initialLoadRef = useRef(false);
  const lastMessageIdRef = useRef<string | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  const [messages, setMessages] = useState<ChatMessageV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pinnedMessage, setPinnedMessage] = useState<ChatMessageV2 | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const onDeleteMessage = async (message: ChatMessageV2) => {
    if (!roomId) return;
    try {
      await actionSuppressMessage.mutateAsync({
        chat_room_id: message.chat_room_id || roomId,
        message_id: message.id
      });
    } catch (error: any) {
      notify('error', 'errors.error', error?.message || 'Failed');
    }
  };

  const onTimeoutUser = (message: ChatMessageV2) => {
    setTarget(message);
    setTimeoutOpen(true);
  };

  const onMuteUser = (message: ChatMessageV2) => {
    setTarget(message);
    setMuteOpen(true);
  };

  const onOpenNotes = (message: ChatMessageV2) => {
    if (!message.user?.id) return;
    setTarget(message);
    setNotesOpen(true);
  };

  const onPinMessage = async (message: ChatMessageV2) => {
    if (!roomId) return;
    try {
      setPinnedMessage(message);
      await actionPinMessage.mutateAsync({ chat_room_id: roomId, message_id: message.id });
    } catch (error: any) {
      setPinnedMessage(null);
      notify('error', 'errors.error', error?.message || 'Failed to pin message');
    }
  };

  const onUnpinMessage = async () => {
    if (!roomId) return;
    try {
      setPinnedMessage(null);
      await actionUnpinMessage.mutateAsync({ chat_room_id: roomId });
    } catch (error: any) {
      notify('error', 'errors.error', error?.message || 'Failed to unpin message');
    }
  };

  const resumeChat = () => {
    userHasScrolledUpRef.current = false;
    setIsPaused(false);
    setNewMessageCount(0);
    scrollToBottom(containerRef.current, bottomRef.current, 'smooth');
  };

  const loadInitial = async (id: string) => {
    setLoading(true);
    const data = await renderMessages.mutateAsync({ chat_room_id: id, limit: 30 });
    const list: ChatMessageV2[] = data?.getLastChatMessagesByChatRoom?.messageList || [];
    setMessages(prev => {
      const normalized = filterSuppressed([...list].reverse());
      if (!prev.length) return normalized;
      return mergeDedupe(prev, normalized);
    });
    lastMessageIdRef.current = list[0]?.id?.toString() || lastMessageIdRef.current;
    setHasMore(list.length >= 30);
    setLoading(false);
    initialLoadRef.current = true;
    window.requestAnimationFrame(() => {
      scrollToBottom(containerRef.current, bottomRef.current, 'auto');
      setTimeout(() => scrollToBottom(containerRef.current, bottomRef.current, 'auto'), 50);
    });
  };

  const loadOlder = async () => {
    if (!roomId || loadingMore || !hasMore || messages.length === 0) return;
    setLoadingMore(true);
    const oldest = messages[0];
    const data = await renderMessages.mutateAsync({
      chat_room_id: roomId,
      limit: 30,
      before_id: oldest.id
    });
    const list: ChatMessageV2[] = data?.getLastChatMessagesByChatRoom?.messageList || [];
    const older = filterSuppressed([...list].reverse());
    setMessages(prev => [...older, ...prev]);
    setHasMore(list.length >= 30);
    setLoadingMore(false);
  };

  // Subscribe to new messages
  useGraphQLSubscription<{ chatMessageSent: ChatMessageV2 }>(
    GRAPHQL_TYPES.MESSAGE_SUBSCRIPTION,
    { chatRoomId: roomId },
    {
      next: data => {
        const msg = (data as any)?.chatMessageSent as ChatMessageV2;
        if (!msg) return;
        if (msg.suppressed) return;
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg].sort(compareMessages);
        });
        if (userHasScrolledUpRef.current) {
          setNewMessageCount(prev => prev + 1);
        }
        lastMessageIdRef.current = msg.id?.toString() || lastMessageIdRef.current;
      }
    },
    [roomId]
  );

  // Subscribe to message updates (suppress, edit, etc.)
  useGraphQLSubscription<{ chatMessageUpdated: ChatMessageV2 }>(
    GRAPHQL_TYPES.MESSAGE_UPDATE_SUBSCRIPTION,
    { chatRoomId: roomId },
    {
      next: data => {
        const msg = (data as any)?.chatMessageUpdated as ChatMessageV2;
        if (!msg) return;
        setMessages(prev => {
          const idx = prev.findIndex(m => m.id === msg.id);
          if (msg.suppressed) {
            return prev.filter(m => m.id !== msg.id);
          }
          if (idx === -1) return prev;
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...msg };
          return copy;
        });
      }
    },
    [roomId]
  );

  // Subscribe to pinned message changes
  useGraphQLSubscription<{ chatPinnedMessageChanged: { pinned: boolean; message: ChatMessageV2 | null } }>(
    GRAPHQL_TYPES.PINNED_MESSAGE_SUBSCRIPTION,
    { chatRoomId: roomId },
    {
      next: data => {
        const event = (data as any)?.chatPinnedMessageChanged;
        if (!event) return;
        setPinnedMessage(event.pinned ? event.message : null);
      }
    },
    [roomId]
  );

  const lastMessageId = useMemo(() => messages.at(-1)?.id ?? null, [messages]);

  // Effects
  useEffect(() => {
    if (!roomId) return;
    userHasScrolledUpRef.current = false;
    loadInitial(roomId);
    actionGetPinnedMessage
      .mutateAsync({ chat_room_id: roomId })
      .then(data => setPinnedMessage(data?.getPinnedChatMessage ?? null))
      .catch(() => {
        /* ignore */
      });
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !refreshToken) return;
    const fetchLatest = async () => {
      try {
        const data = await renderMessages.mutateAsync({ chat_room_id: roomId, limit: 1 });
        const list: ChatMessageV2[] = data?.getLastChatMessagesByChatRoom?.messageList || [];
        if (!list.length) return;
        const latest = list[0];
        if (latest?.suppressed) return;
        setMessages(prev => {
          if (prev.find(m => m.id === latest.id)) return prev;
          return [...prev, latest].sort(compareMessages);
        });
      } catch {
        // ignore fetch errors
      }
    };
    fetchLatest();
  }, [refreshToken, roomId]);

  useEffect(() => {
    if (!roomId) return;
    const heartbeat = async () => {
      try {
        await actionPresenceHeartbeat.mutateAsync({ chat_room_id: roomId });
      } catch {
        // ignore heartbeat errors
      }
    };
    heartbeat();
    const interval = setInterval(heartbeat, 10000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    let active = true;
    const interval = setInterval(async () => {
      if (!active) return;
      try {
        const data = await renderMessages.mutateAsync({ chat_room_id: roomId, limit: 30 });
        const list: ChatMessageV2[] = data?.getLastChatMessagesByChatRoom?.messageList || [];
        if (!list.length) return;
        const latest = list[0];
        setMessages(prev => reconcileMessages(prev, list));
        lastMessageIdRef.current = latest?.id?.toString() || lastMessageIdRef.current;
      } catch {
        // ignore polling errors
      }
    }, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [roomId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!userInteractedRef.current) return;
      const threshold = 48;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
      const wasPaused = userHasScrolledUpRef.current;
      userHasScrolledUpRef.current = !atBottom;
      if (!atBottom && !wasPaused) {
        setIsPaused(true);
        setNewMessageCount(0);
      } else if (atBottom && wasPaused) {
        setIsPaused(false);
        setNewMessageCount(0);
      }
      if (el.scrollTop <= 24) {
        loadOlder();
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, [roomId, messages, loadingMore, hasMore]);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const autoScrollIfNeeded = () => {
      if (userHasScrolledUpRef.current) return;
      scrollToBottom(containerRef.current, bottomRef.current, 'auto');
    };

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = new ResizeObserver(() => {
        autoScrollIfNeeded();
      });
      resizeObserverRef.current.observe(el);
    }

    if (typeof MutationObserver !== 'undefined') {
      mutationObserverRef.current?.disconnect();
      mutationObserverRef.current = new MutationObserver(() => {
        autoScrollIfNeeded();
      });
      mutationObserverRef.current.observe(el, { childList: true, subtree: true });
    }

    return () => {
      resizeObserverRef.current?.disconnect();
      mutationObserverRef.current?.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (!lastMessageId) return;
    if (userHasScrolledUpRef.current) return;
    if (!initialLoadRef.current) return;
    window.requestAnimationFrame(() => {
      scrollToBottom(containerRef.current, bottomRef.current, 'smooth');
    });
  }, [lastMessageId]);

  useEffect(() => {
    if (!roomId || loading || !messages.length) return;
    if (userHasScrolledUpRef.current) return;
    window.requestAnimationFrame(() => {
      scrollToBottom(containerRef.current, bottomRef.current, 'auto');
      setTimeout(() => scrollToBottom(containerRef.current, bottomRef.current, 'auto'), 50);
    });
  }, [roomId, loading, messages.length]);

  return (
    <>
      {pinnedMessage && (
        <div className="px-4 py-2 shrink-0">
          <div className="flex items-start gap-2 px-3 py-2 bg-green-600 border border-green-300 rounded-lg">
            <Pin className="w-3.5 h-3.5 text-green-300 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xxs text-green-300 font-semibold uppercase tracking-wide block mb-0.5">
                {pinnedMessage.user?.username}
              </span>
              <span className="text-xs text-white break-words line-clamp-2">{pinnedMessage.message}</span>
            </div>
            {canModerate && (
              <button
                type="button"
                onClick={onUnpinMessage}
                className="text-green-200 hover:text-white transition-colors shrink-0"
                aria-label="Unpin message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="relative flex-1 min-h-0">
        <div ref={containerRef} className={cn('flex flex-col gap-2 p-4 overflow-y-auto h-full min-h-0 no-scrollbar')}>
          {loading && <SkeletonLoader count={10} containerClassName="flex-wrap" variant="chat-item" />}
          {loadingMore && <SkeletonLoader count={3} containerClassName="flex-wrap" variant="chat-item" />}
          {messages.map(message => (
            <ChatItemV2
              key={message.id}
              message={message}
              canModerate={canModerate}
              onDelete={onDeleteMessage}
              onTimeout={onTimeoutUser}
              onMute={onMuteUser}
              onNotes={onOpenNotes}
              onPin={onPinMessage}
              onReply={onReply}
            />
          ))}

          <div ref={bottomRef} />
        </div>
        {isPaused && (
          <button
            type="button"
            onClick={resumeChat}
            className="group absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-4 py-1.5 bg-bg_menu border border-white/15 rounded-full text-white text-xs font-medium whitespace-nowrap hover:border-white/30 transition-all"
          >
            <span className="flex items-center gap-1.5 group-hover:hidden">
              <Pause className="w-3.5 h-3.5" />
              Chat paused due to scroll
            </span>
            <span className="hidden group-hover:flex items-center gap-1.5">
              <ArrowDown className="w-3.5 h-3.5" />
              {newMessageCount > 0
                ? `${newMessageCount} new message${newMessageCount === 1 ? '' : 's'}`
                : 'Scroll to bottom'}
            </span>
          </button>
        )}
      </div>
      {canModerate && (
        <TimeoutUserModal
          username={target?.user?.username || 'User'}
          open={timeoutOpen}
          onClose={() => setTimeoutOpen(false)}
        />
      )}
      {canModerate && (
        <MuteUserModal username={target?.user?.username || 'User'} open={muteOpen} onClose={() => setMuteOpen(false)} />
      )}
      {canModerate && target && <UserNotesModal user={target} open={notesOpen} onClose={() => setNotesOpen(false)} />}
    </>
  );
};

export default ChatsV2;
