'use client';

import { useTranslations } from 'next-intl';

import { Modal, ModalContent } from '../Modal';

import type { UserPromotion } from '@/core/types/promotions.types';
import { getPromoRenderer } from '@/screens/promotions/types/promoTypeRegistry';

interface PromoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  props?: {
    userPromotion?: UserPromotion;
  };
}

const PromoDetailModal = ({ isOpen, onClose, props }: PromoDetailModalProps) => {
  const t = useTranslations('promotions');
  const userPromotion = props?.userPromotion;

  if (!userPromotion) return null;

  const renderer = getPromoRenderer(userPromotion.promotion.type);
  const Detail = renderer?.Detail;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      closeOnOverlayClick={false}
      size="md"
      variant="default"
      header={t('details')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body w-full"
    >
      <ModalContent className="p-0 max-h-[80vh] overflow-y-auto">
        {Detail ? (
          <Detail userPromotion={userPromotion} />
        ) : (
          <p className="text-white/70 text-sm">{t('unsupported_promo_type')}</p>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PromoDetailModal;
