import { Button } from '@investorcentretb/toshi-ui';
import { useSelector } from 'react-redux';

import Chats from './Chats';
import SendMessage from './SendMessage';
import ChatBanners from './partials/ChatBanners';
import { RootState } from '@/core/redux-toolkit/store';
import { useModalManager } from '@/shared/hooks/useModal';

const ChatSections = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { openModal } = useModalManager();
  return isAuthenticated ? (
    <div className="flex flex-col h-full min-h-0 gap-2 relative px-4">
      <ChatBanners />
      <div className="flex-1 min-h-0 overflow-hidden">
        <Chats />
      </div>
      <div className="shrink-0">
        <SendMessage />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2 h-full items-center justify-center relative">
      <Button
        intent="gray"
        appearance="solid"
        borderRadius="md"
        size="lg"
        className="w-fit text-base text-white70 py-2.5 px-4 mt-5"
        onClick={() => openModal('auth', 'login', { mode: 'login' })}
      >
        Login to chat
      </Button>
    </div>
  );
};

export default ChatSections;
