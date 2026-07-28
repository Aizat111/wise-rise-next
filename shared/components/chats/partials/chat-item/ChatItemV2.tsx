import { CornerUpLeft, Pin, StickyNote, Timer, Trash2, VolumeX } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import ChatMessageText from './partials/ChatMessageText';
import GameResultCard from './partials/GameResultCard';
import TipCard from './partials/TipCard';
import { getVipLevelBorderColor } from '@/core/constants/vip-levels.constants';
import { getVipBackgroundByLevel } from '@/core/lib/utils';
import type { BetData } from '@/core/types/chat.types';
import Shuriken from '@/icons/Shuriken';
import { useModalManager } from '@/shared/hooks/useModal';
import Avatar from '@/shared/ui/avatars/Avatar';
import { Loader } from '@/shared/ui/loaders/Loader';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';
import { truncateText } from '@/shared/utils/stringUtils';
import { getLevelSource, getProfileImageForLevel } from '@/shared/utils/userUtils';

export interface ChatUserV2 {
  id?: string | null;
  username: string;
  profile_img?: string | null;
  level?: number | null;
  role?: string | null;
}

export interface ChatMessageV2 {
  id: string;
  chat_room_id: string;
  message: string;
  message_type?: string;
  metadata?: any;
  user: ChatUserV2 | null;
  created_at: string;
  updated_at: string;
  suppressed: boolean;
}

interface ChatItemProps {
  message: ChatMessageV2;
  canModerate?: boolean;
  onDelete?: (_message: ChatMessageV2) => void;
  onTimeout?: (_message: ChatMessageV2) => void;
  onMute?: (_message: ChatMessageV2) => void;
  onNotes?: (_message: ChatMessageV2) => void;
  onPin?: (_message: ChatMessageV2) => void;
  onReply?: (_message: ChatMessageV2) => void;
}

const ChatItemV2: React.FC<ChatItemProps> = React.memo(
  ({ message, canModerate = false, onDelete, onTimeout, onMute, onNotes, onPin, onReply }) => {
    const { openModal } = useModalManager();
    const [isHovered, setIsHovered] = useState(false);
    const user = message.user;
    const level = user?.level ?? 0;
    const levelName = getLevelSource(level);
    const profileImage = getProfileImageForLevel(level);
    const vipBackground = getVipBackgroundByLevel(Number(level ?? 0));
    const vipBorderColor = getVipLevelBorderColor(Number(level ?? 0));
    const username = user?.username || 'Anon';
    const isMod = ['admin', 'super_admin', 'moderator'].includes(user?.role ?? '');

    const processedMessage = useMemo(() => {
      if (!message) return message;
      const processedMsg = { ...message };
      let hasBetData = false;
      let hasTipData = false;
      let isPendingBet = false;

      if (processedMsg.message_type === 'tip') {
        let meta = processedMsg.metadata;
        if (meta) {
          try {
            meta = typeof meta === 'string' ? JSON.parse(meta) : meta;
            processedMsg.metadata = meta;
            hasTipData = true;
          } catch (error) {
            console.error('Error parsing tip metadata:', error);
          }
        }
      } else if (
        (processedMsg.message_type === 'bet_share' || processedMsg.message_type === 'bet') &&
        processedMsg.metadata
      ) {
        try {
          const metadataRaw =
            typeof processedMsg.metadata === 'string' ? JSON.parse(processedMsg.metadata) : processedMsg.metadata;
          processedMsg.metadata = {
            id: metadataRaw.bet_id || metadataRaw.id || 'bet',
            game_image:
              metadataRaw.game_image ||
              'https://img.freepik.com/free-vector/keno-lottery-balls-gambling-game_107791-1699.jpg',
            game_image_gradient: metadataRaw.game_image_gradient || 'linear(to-r, #6d237a, #9c3587)',
            game_name: metadataRaw.game_name || 'Game',
            game_url: metadataRaw.game_url,
            amount: Number(metadataRaw.amount ?? 0),
            multiplier: Number(metadataRaw.multiplier ?? 1),
            payout: Number(metadataRaw.payout ?? 0)
          };
          hasBetData = true;
        } catch (error) {
          console.error('Error parsing bet_share metadata:', error);
        }
      } else if (processedMsg.metadata) {
        try {
          processedMsg.metadata =
            typeof processedMsg.metadata === 'string' ? JSON.parse(processedMsg.metadata) : processedMsg.metadata;
          hasBetData = true;
        } catch (error) {
          console.error('Error parsing generic metadata:', error);
          hasBetData = false;
        }
      } else if (processedMsg.message?.startsWith('/betid')) {
        hasBetData = false;
        isPendingBet = true;
      }

      return { message: processedMsg, hasBetData, hasTipData, isPendingBet };
    }, [message]);

    const hasBetData = processedMessage?.hasBetData || false;
    const hasTipData = processedMessage?.hasTipData || false;
    const isPendingBet = processedMessage?.isPendingBet || false;
    const messageWithData = processedMessage?.message || message;

    return (
      <div className="flex gap-3 relative justify-end w-full">
        <div className="absolute left-0 -top-0 mt-2">
          <div className="w-10 h-10 p-[1px] rounded-md" style={{ background: vipBorderColor }}>
            <div className="w-full h-full p-1 bg-bg_menu rounded-md">
              <Avatar src={profileImage} alt={username} size="sm" />
            </div>
          </div>
        </div>
        <div
          className="py-3 px-2 w-full min-w-0 ml-2 bg-toshi_body rounded-md"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex  flex-row pb-1 justify-between gap-1">
            <div className="flex items-center gap-1 pl-6 ml-2">
              <span
                aria-hidden="true"
                className="font-bold text-white70 text-xs truncate cursor-pointer hover:text-primary-500 transition-colors"
                onClick={() => {
                  if (user?.id) openModal('userDetails', 'default', { userId: user.id });
                }}
              >
                {truncateText(username, 10)}
              </span>
              {isMod && (
                <CustomTooltip label="Moderator" placement="top" openDelay={100}>
                  <img
                    src="https://static.toshi.bet/public/modbadge.png?auto=format&w=32"
                    alt="Moderator"
                    className="h-3 w-auto shrink-0 cursor-default"
                  />
                </CustomTooltip>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xxs pr-0.5 whitespace-nowrap uppercase text-white50">{levelName}</span>
              <Shuriken className="shrink-0 w-3 h-3" fill={vipBackground} aria-hidden="true" />
            </div>
          </div>
          <div className="h-px w-full mb-2.5" style={{ background: vipBorderColor }} />
          {onReply && isHovered && (
            <button
              type="button"
              onClick={() => onReply(message)}
              title="Click to reply"
              aria-label="Reply to message"
              className="absolute right-1.5 top-1.5 w-6 h-6 flex items-center justify-center bg-bg_menu border border-white/30 rounded-full text-white70 hover:text-white hover:border-white/50 transition-colors"
            >
              <CornerUpLeft className="w-3 h-3" />
            </button>
          )}

          {hasTipData && messageWithData?.metadata && <TipCard tipData={messageWithData.metadata} />}
          {hasBetData && messageWithData?.metadata && <GameResultCard betData={messageWithData.metadata as BetData} />}

          {isPendingBet && (
            <div className="flex justify-center items-center py-2 w-full min-h-[60px]">
              <Loader variant="spinner" size="sm" />
            </div>
          )}

          {!hasBetData && !hasTipData && !isPendingBet && (
            <div className="text-white relative mt-5 ml-1 text-xs break-words whitespace-pre-wrap overflow-x-hidden min-w-0">
              <ChatMessageText text={messageWithData.message} />
            </div>
          )}
          {canModerate && (
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => onDelete?.(message)}
                className="text-white70 hover:text-white transition-colors"
                aria-label="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onTimeout?.(message)}
                className="text-white70 hover:text-white transition-colors"
                aria-label="Timeout user"
              >
                <Timer className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onMute?.(message)}
                className="text-white70 hover:text-white transition-colors"
                aria-label="Mute user"
              >
                <VolumeX className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNotes?.(message)}
                className="text-white70 hover:text-white transition-colors"
                aria-label="User notes"
              >
                <StickyNote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onPin?.(message)}
                className="text-white70 hover:text-primary-500 transition-colors"
                aria-label="Pin message"
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatItemV2.displayName = 'ChatItemV2';

export default ChatItemV2;
