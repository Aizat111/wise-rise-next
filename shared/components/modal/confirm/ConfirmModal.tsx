'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Modal, ModalContent } from '../Modal';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  props: {
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText: string;
    cancelText: string;
  };
}

const ConfirmModal = ({ isOpen, onClose, props }: ConfirmModalProps) => {
  const t = useTranslations();
  const { title, description, onConfirm, confirmText, cancelText } = props;
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="sm"
      variant="default"
      header={title}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        {description === 'string' ? (
          <p className="text-white text-center font-bold">{description}</p>
        ) : (
          props.description
        )}
        <div className="p-0 h-full flex gap-2">
          <Button
            appearance="solid"
            intent="gray"
            className="w-full"
            onClick={() => {
              onClose();
            }}
          >
            {cancelText || t('cancel')}
          </Button>
          {onConfirm && (
            <Button
              appearance="glossy"
              intent="primary"
              className="w-full"
              isLoading={isConfirmLoading}
              onClick={async () => {
                setIsConfirmLoading(true);
                await onConfirm?.();
                setIsConfirmLoading(false);
                onClose();
              }}
            >
              {confirmText || t('confirm')}
            </Button>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
