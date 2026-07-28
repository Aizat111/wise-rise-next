import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

import GameResultCard from './partials/chat-item/partials/GameResultCard';
import TipCard from './partials/chat-item/partials/TipCard';
import { getVipLevelBorderColor } from '@/core/constants/vip-levels.constants';
import { getVipBackgroundByLevel } from '@/core/lib/utils';
import type { BetData, Message } from '@/core/types/chat.types';
import Shuriken from '@/icons/Shuriken';
import { useModalManager } from '@/shared/hooks/useModal';
import Avatar from '@/shared/ui/avatars/Avatar';
import { Loader } from '@/shared/ui/loaders/Loader';
import { truncateText } from '@/shared/utils/stringUtils';
import { getLevelSource, getProfileImageForLevel } from '@/shared/utils/userUtils';

interface ChatItemProps {
  message: Message;
}

const ChatItem: React.FC<ChatItemProps> = React.memo(({ message }) => {
  const _t = useTranslations();
  const { openModal } = useModalManager();
  const levelName = getLevelSource(message.level);
  const profileImage = getProfileImageForLevel(message.level);
  const vipBackground = getVipBackgroundByLevel(Number(message.level ?? 0));
  const vipBorderColor = getVipLevelBorderColor(Number(message.level ?? 0));

  const processedMessage = useMemo(() => {
    if (!message) return message;

    const processedMsg = { ...message };
    let hasBetData = false;
    let hasTipData = false;
    let isPendingBet = false;

    // Tip: parse metadata if string
    if (processedMsg.message_type === 'tip') {
      let meta = processedMsg.metadata;

      // 1. Try parsing metadata if it exists
      if (meta) {
        try {
          meta = typeof meta === 'string' ? JSON.parse(meta) : meta;
          processedMsg.metadata = meta;
          hasTipData = true;
        } catch (error) {
          console.error('Error parsing tip metadata:', error);
        }
      }

      if (!hasTipData && processedMsg.message?.startsWith('tipped')) {
        const parts = processedMsg.message.trim().split(/\s+/);
        if (parts.length >= 4) {
          const amountStr = parts[1].replace('$', '');
          const amount = parseFloat(amountStr);
          const toUsername = parts[3];
          if (toUsername && !isNaN(amount)) {
            processedMsg.metadata = { toUsername, amount } as any;
            hasTipData = true;
          }
        }
      }
    }
    // Bet share (or legacy 'bet'): parse and normalize to BetData
    else if (
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
    }
    // Generic: if metadata exists, ensure it's an object
    else if (processedMsg.metadata) {
      try {
        processedMsg.metadata =
          typeof processedMsg.metadata === 'string' ? JSON.parse(processedMsg.metadata) : processedMsg.metadata;
        hasBetData = true;
      } catch (error) {
        console.error('Error parsing generic metadata:', error);
        // metadata may not be JSON; ignore
        hasBetData = false;
      }
    }
    // Fallback: /betid text
    else if (processedMsg.message?.startsWith('/betid')) {
      hasBetData = false;
      isPendingBet = true;
    }
    // SECURITY: Removed /tip text parsing fallback - tips must have message_type='tip' with server-validated metadata
    // This prevents users from faking tip amounts by sending "/tip user 999999" messages

    return { message: processedMsg, hasBetData, hasTipData, isPendingBet };
  }, [message]);

  const hasBetData = processedMessage?.hasBetData || false;
  const hasTipData = processedMessage?.hasTipData || false;
  const isPendingBet = processedMessage?.isPendingBet || false;
  const messageWithData = processedMessage?.message || message;

  return (
    <div className="flex gap-3 relative justify-end w-full">
      {/* Avatar */}
      <div className="absolute left-0 -top-0 mt-2">
        <div className="w-10 h-10 p-[1px] rounded-md" style={{ background: vipBorderColor }}>
          <div className="w-full h-full p-1 bg-bg_menu rounded-md">
            <Avatar src={profileImage} alt={message.username} size="sm" />
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="py-3 px-2 w-full min-w-0 ml-2 bg-toshi_body rounded-md">
        {/* User Info */}
        <div className="flex  flex-row pb-1 justify-between gap-1">
          <div className="flex items-center gap-1 pl-6 ml-2">
            <span
              aria-hidden="true"
              className="font-bold text-white70 text-xs truncate cursor-pointer hover:text-primary-500 transition-colors"
              onClick={() => openModal('userDetails', 'default', { userId: message.user })}
            >
              {truncateText(message.username, 10)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xxs pr-0.5 whitespace-nowrap uppercase text-white50">{levelName}</span>
            <Shuriken className="shrink-0 w-3 h-3" fill={vipBackground} aria-hidden="true" />
          </div>
        </div>
        <div className="h-px w-full mb-2.5" style={{ background: vipBorderColor }} />

        {/* Message */}

        {hasTipData && messageWithData?.metadata && <TipCard tipData={messageWithData.metadata} />}

        {/* Game Result Card */}
        {hasBetData && messageWithData?.metadata && <GameResultCard betData={messageWithData.metadata as BetData} />}

        {isPendingBet && (
          <div className="flex justify-center items-center py-2 w-full min-h-[60px]">
            <Loader variant="spinner" size="sm" />
          </div>
        )}

        {!hasBetData && !hasTipData && !isPendingBet && (
          <div className="text-white relative mt-5 ml-1 text-xs break-words  whitespace-pre-wrap overflow-x-hidden min-w-0">
            {messageWithData.message}
            {/* {messageWithData.message.length > 80 && (
              <span
                className="text-primary-500 text-xs cursor-pointer block mt-1"
                aria-hidden="true"
                onClick={() => setMore(!more)}
              >
                {more ? t('see_less') : t('see_more')}
              </span>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
});

ChatItem.displayName = 'ChatItem';

export default ChatItem;
