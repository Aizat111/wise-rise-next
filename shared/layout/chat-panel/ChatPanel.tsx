'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import ChatContent from './ChatContent';
import { PAGE } from '@/core/config/public-page.config';
import { cn } from '@/core/lib/utils';
import { closeChat } from '@/core/redux-toolkit/slices/uiSlice';
import { RootState } from '@/core/redux-toolkit/store';
import { useViewportHeight } from '@/shared/hooks/useViewportHeight';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import CloseBtn from '@/shared/ui/buttons/CloseBtn';

const ChatPanel = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowSize();
  useViewportHeight();
  const { chatOpen } = useSelector((state: RootState) => state.ui);
  const t = useTranslations();
  const dispatch = useDispatch();
  return (
    <div
      data-attribute="chatPanel"
      className={cn(
        'p-0 pt-0 h-[100dvh] bg-bg_content fixed right-0 top-0 transition-width duration-300 hidded-chat-panel',
        !chatOpen && 'hidden',
        width < 768 && chatOpen && 'left-0 top-0 z-[900] w-full max-h-[calc(100dvh-130px)] mt-[70px]'
      )}
    >
      <div className="max-sm:h-[50px] pl-6 pr-2 h-[70px] border-b border-linebreak flex items-center text-base font-byrd uppercase justify-between">
        <span>{t('chat')}</span>
        <CloseBtn
          onClick={() => {
            if (pathname?.includes(PAGE.CHATS)) {
              router.back();
            }
            dispatch(closeChat());
          }}
          size="sm"
        />
      </div>
      <div
        className={cn('h-full overflow-hidden flex flex-col')}
        style={{ height: `calc(var(--vh, 1dvh) * 100 - ${width < 768 ? 190 : 80}px)` }}
      >
        {chatOpen ? <ChatContent /> : null}
      </div>
    </div>
  );
};

export default ChatPanel;
