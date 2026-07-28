import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { useDebounce } from '@/shared/hooks/useDebounce';
import Input from '@/shared/ui/inputs/Input';

const SendMessage = () => {
  const t = useTranslations();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedMessage = useDebounce(message, 200);

  const sendMessage = useFetcher(TYPES.SEND_MESSAGE).action();

  return (
    <div className="border-t border-white30 no-scrollbar pt-3 pb-3  px-1">
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
        onChange={e => {
          setMessage(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey && message?.trim()?.length > 0) {
            e.preventDefault();
            sendMessage.mutate({ message: message?.trim() });
            setMessage('');
          }
        }}
        enterKeyHint="send"
        className="mb-2.5 py-2 px-4 text-white70 no-scrollbar"
      />
      <div className="flex justify-between">
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

        <div className="flex items-center gap-2">
          <div className="text-xs text-white space-x-0.5">
            <span>{message?.trim()?.length}</span> <span>/</span> <span>{200}</span>
          </div>
          <Button
            intent="green"
            isLoading={sendMessage.isPending}
            appearance="claim"
            className="text-[#000000] font-bold"
            disabled={message?.trim()?.length === 0}
            onClick={() => {
              sendMessage.mutate({ message: debouncedMessage?.trim() });
              setMessage('');
            }}
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

export default SendMessage;
