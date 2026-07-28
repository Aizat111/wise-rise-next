'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';

import { Modal, ModalContent } from '../Modal';

export interface ConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  props: {
    title?: string;
    content: string;
    buttons?: Array<{ text: string; onClick?: () => void }>;
  };
}

const ConnectorModal = ({ isOpen, onClose }: ConnectorModalProps) => {
  const t = useTranslations();

  const handleContactSupport = () => {
    window?.Intercom?.('show');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="sm"
      variant="default"
      header={t('connector_modal.title')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 pt-6 pb-2  w-full">
        <div className="flex flex-col gap-2">
          {/* {content && (
            <div className="text-white text-base font-medium whitespace-pre-line leading-relaxed">{content}</div>
          )} */}
          <div className="text-white text-base font-medium whitespace-pre-line leading-relaxed">
            {t('connector_modal.description')}
          </div>

          <div className="text-white70 text-base font-medium whitespace-pre-line leading-relaxed">
            {t('connector_modal.description2')}
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button appearance="glossy" intent="primary" className="w-full" onClick={() => window.location.reload()}>
              {t('refresh')}
            </Button>
            <Button appearance="solid" intent="gray" className="w-full" onClick={() => handleContactSupport()}>
              {t('contactsupport')}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ConnectorModal;
