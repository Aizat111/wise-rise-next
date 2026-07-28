'use client';

import { useTranslations } from 'next-intl';

import { Modal, ModalContent } from '../Modal';

import LastManStandingFAQ from '@/screens/last-man-standing/partials/LastManStandingFAQ';

interface LmsFaqsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LmsFaqsModal = ({ isOpen, onClose }: LmsFaqsModalProps) => {
  const t = useTranslations('last_man_standing');

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="full"
      variant="default"
      closeButtonSize="md"
      headerClassName="text-left text-[17px] tracking-[0.08em] uppercase"
      header={t('faq_title')}
      mainClassName="!p-0"
      modalClassName="bg-toshi_body h-[85vh] w-full max-w-[450px] max-md:max-w-full"
    >
      <ModalContent className="p-0 overflow-y-scroll w-full h-[75vh] pb-10">
        <LastManStandingFAQ showTitle={false} className="w-full justify-start !pt-1" />
      </ModalContent>
    </Modal>
  );
};

export default LmsFaqsModal;
