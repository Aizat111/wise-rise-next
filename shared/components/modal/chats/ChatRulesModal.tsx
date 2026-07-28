'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { BookOpen } from 'lucide-react';
import { type FC } from 'react';

import { Modal, ModalContent } from '../Modal';

export interface ChatRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props: Record<string, unknown>;
}

const ChatRulesModal: FC<ChatRulesModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="max-w-[360px] bg-toshi_body md:bg-[#060E20]"
      contentClassName="p-0"
    >
      <ModalContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-white70 shrink-0" />
          <h2 className="text-white text-base font-semibold">Chat Rules</h2>
        </div>
        <ol className="flex flex-col gap-3 text-sm text-white70">
          {[
            'No begging',
            'No promoting other casinos',
            'No crying in the casino',
            'Do not spam or use excessive capital letters',
            'Do not engage in suspicious behaviour or potential scams',
            'Do not advertise, trade, sell, buy, or offer services'
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-white50 font-bold shrink-0 w-5 text-right">{i + 1}.</span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex justify-end">
          <Button intent="gray" appearance="solid" borderRadius="md" size="xs" onClick={onClose}>
            Got it
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ChatRulesModal;
