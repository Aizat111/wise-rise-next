import { useEffect, useState } from 'react';

import ChatsV2 from './ChatsV2';
import ChatBanners from './partials/ChatBanners';
import SendMessageV2 from './partials/SendMessageV2';
import type { ChatMessageV2 } from './partials/chat-item/ChatItemV2';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';

const SectionV2 = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [replyTo, setReplyTo] = useState<ChatMessageV2 | null>(null);
  const defaultRoom = useGraphWsFetcher<{ defaultChatRoom: { id: string; name: string } }>(
    GRAPHQL_TYPES.DEFAULT_CHAT_ROOM_QUERY
  ).render();

  useEffect(() => {
    if (defaultRoom?.data?.defaultChatRoom) {
      setRoomId(defaultRoom?.data?.defaultChatRoom?.id || null);
    }
  }, [defaultRoom]);

  return (
    <div className="flex flex-col h-full w-full">
      <ChatBanners />
      <ChatsV2 roomId={roomId} refreshToken={refreshToken} onReply={setReplyTo} />
      <SendMessageV2
        chatRoomId={roomId}
        onSent={() => setRefreshToken(Date.now())}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default SectionV2;
