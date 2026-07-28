import { Button } from '@investorcentretb/toshi-ui';
import { BookOpen, CornerUpLeft, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import type { ChatMessageV2 } from './chat-item/ChatItemV2';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config/types';
import { notify } from '@/core/lib/notify';
import { useModalManager } from '@/shared/hooks/useModal';
import Input from '@/shared/ui/inputs/Input';
import { getTipCommandUsername, isTipCommand } from '@/shared/utils/chatCommands';

interface UserLookupResponse {
  success: boolean;
  message?: string;
  user?: {
    id?: string;
  };
}

interface SendMessageV2Props {
  chatRoomId: string | null;
  onSent?: () => void;
  replyTo?: ChatMessageV2 | null;
  onCancelReply?: () => void;
}

const REPLY_SNIPPET_MAX = 60;

function stripReplyPrefix(message: string): string {
  return message.replace(/^\[Re: @[^:]+:[^\]]*\]\s*/, '');
}

function buildReplyMessage(replyTo: ChatMessageV2, userMessage: string): string {
  const username = replyTo.user?.username || 'Anon';
  const stripped = stripReplyPrefix(replyTo.message || '');
  const snippet = stripped.replace(/[^\x20-\x7E]/g, '').slice(0, REPLY_SNIPPET_MAX);
  return `[Re: @${username}: ${snippet}] ${userMessage}`;
}

const SendMessageV2 = ({ chatRoomId, onSent, replyTo, onCancelReply }: SendMessageV2Props) => {
  const sendMessageMutation = useGraphWsFetcher<{ sendChatMessage: { id: string } }>(
    GRAPHQL_TYPES.SEND_MESSAGE_MUTATION
  ).action();
  const t = useTranslations();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { openModal } = useModalManager();
  const lookupUser = useFetcher<UserLookupResponse>(TYPES.GET_USER_LOOKUP).action();

  const handleTipCommand = async () => {
    if (!isTipCommand(message)) return false;
    const username = getTipCommandUsername(message);
    if (!username) {
      notify('error', 'errors.error', 'errors.user_not_found');
      return true;
    }
    lookupUser.mutateAsync({ username }).then(res => {
      openModal('userDetails', 'default', { userId: res?.user?.id });
      setMessage('');
    });
    return true;
  };

  useEffect(() => {
    if (replyTo) {
      textareaRef.current?.focus();
    }
  }, [replyTo]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (await handleTipCommand()) return;
    if (!chatRoomId) return;
    const finalMessage = replyTo ? buildReplyMessage(replyTo, message.trim()) : message.trim();
    sendMessageMutation.mutateAsync({ chat_room_id: chatRoomId, message: finalMessage }).then(() => {
      setMessage('');
      onCancelReply?.();
      onSent?.();
    });
  };

  return (
    <div className="border-t border-white30 no-scrollbar pt-3 pb-3 px-4">
      {replyTo && (
        <div className="flex items-start gap-2 mb-2 px-3 py-2 bg-bg_menu rounded-lg">
          <CornerUpLeft className="w-3.5 h-3.5 text-white50 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-xxs text-white50 font-semibold block">
              Replying to @{replyTo.user?.username || 'Anon'}:
            </span>
            <span className="text-xxs text-white30 break-words line-clamp-2">
              {stripReplyPrefix(replyTo.message || '').slice(0, REPLY_SNIPPET_MAX) || ''}
            </span>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            aria-label="Cancel reply"
            className="text-white30 hover:text-white50 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <Input
        variant="chat"
        placeholder="speak_your_mind"
        maxLength={200}
        isTranslated
        value={message}
        fontSize="sm"
        isRequired
        ref={textareaRef}
        aria-label={t('speak_your_mind')}
        readOnly={sendMessageMutation.isPending || sendMessageMutation.isPending}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => {
          if (
            e.key === 'Enter' &&
            !e.shiftKey &&
            message?.trim()?.length > 0 &&
            !sendMessageMutation.isPending &&
            !sendMessageMutation.isPending
          ) {
            e.preventDefault();
            sendMessage();
          }
        }}
        enterKeyHint="send"
        className="mb-2.5 py-2 px-4 text-white70 no-scrollbar"
      />
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button
            intent="gray"
            onClick={() => {
              setMessage('/betid ');
              if (textareaRef.current) {
                textareaRef.current.focus();
              }
            }}
            appearance="solid"
            className="text-white70"
            borderRadius="md"
            size="xs"
          >
            {t('send_bet')}
          </Button>
          <button
            type="button"
            onClick={() => openModal('chatRules')}
            aria-label="Chat rules"
            title="Chat rules"
            className="text-white50 hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-white space-x-0.5">
            <span>{message?.trim()?.length}</span> <span>/</span> <span>{200}</span>
          </div>
          <Button
            intent="green"
            isLoading={sendMessageMutation.isPending || sendMessageMutation.isPending}
            appearance="claim"
            className="text-[#000000] font-bold"
            disabled={sendMessageMutation.isPending || sendMessageMutation.isPending || message?.trim()?.length === 0}
            onClick={sendMessage}
            borderRadius="md"
            size="xs"
          >
            {t('send')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageV2;
