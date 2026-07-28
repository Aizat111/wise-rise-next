'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { CheckCircle, CircleOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Modal, ModalContent } from '../Modal';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  props: Record<string, any>;
}

const NotificationModal = ({ isOpen, onClose, props }: NotificationModalProps) => {
  const t = useTranslations('last_man_standing');

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="sm"
      variant="default"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        <div className="flex flex-col items-center gap-2 py-4 text-center mb-4 w-[275px] mx-auto">
          {props.type === 'success' ? (
            <>
              <CheckCircle className="w-20 h-20 text-[#03FF88]" />
              <span className="text-lg uppercase font-bold text-[#03FF88]">{t('done')}</span>
            </>
          ) : (
            <CircleOff className="w-20 h-20 text-red-500" />
          )}

          <p className="text-white/70 text-md">{props.message}</p>
        </div>
        <div className="p-0 h-full">
          <Button
            appearance="glossy"
            intent="primary"
            className="w-full"
            onClick={() => {
              handleClose();
            }}
          >
            {t('ok')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default NotificationModal;
