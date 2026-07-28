'use client';

import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import { Modal, ModalContent } from '../Modal';

import type { UserPromotion } from '@/core/types/promotions.types';
import { useMyPromotions } from '@/shared/hooks/usePromotions';
import { SkeletonLoader } from '@/shared/ui/SkeletonLoader';

interface PromoHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  props?: Record<string, unknown>;
}

const safeFormat = (value: string | null | undefined, fmt: string): string => {
  if (!value) return '—';
  try {
    return format(new Date(value), fmt);
  } catch {
    return '—';
  }
};

const Row = ({ p }: { p: UserPromotion }) => {
  const wagered = Number(p.progress_amount || 0).toFixed(2);
  const notWagered = Math.max(0, Number(p.total_amount || 0) - Number(p.progress_amount || 0)).toFixed(2);
  return (
    <tr className="border-t border-white/5">
      <td className="py-3 px-4 align-top">
        <p className="text-white font-semibold capitalize">{p.promotion.type.replace('_', ' ')}</p>
      </td>
      <td className="py-3 px-4 align-top">
        <p className="text-white font-semibold">{p.promotion.name}</p>
      </td>
      <td className="py-3 px-4 align-top">
        <p className="text-white">
          <span className="inline-block w-3 h-3 bg-toshi_button_primary rounded-full mr-1 align-middle" aria-hidden />
          {wagered}
        </p>
        <p className="text-white/70">
          <span className="inline-block w-3 h-3 bg-toshi_button_primary rounded-full mr-1 align-middle" aria-hidden />
          {notWagered}
        </p>
      </td>
      <td className="py-3 px-4 align-top">
        <p className="text-white">{safeFormat(p.claimed_at, 'dd.MM.yyyy')}</p>
        <p className="text-white/60 text-xs">{safeFormat(p.claimed_at, 'HH:mm')}</p>
      </td>
      <td className="py-3 px-4 align-top">
        <p className="text-white">{safeFormat(p.claimed_at, 'dd.MM.yyyy')}</p>
        <p className="text-white/60 text-xs">{safeFormat(p.claimed_at, 'HH:mm')}</p>
      </td>
      <td className="py-3 px-4 align-top">
        <p className="text-white">{safeFormat(p.expires_at, 'dd.MM.yyyy')}</p>
        <p className="text-white/60 text-xs">{safeFormat(p.expires_at, 'HH:mm')}</p>
      </td>
    </tr>
  );
};

const PromoHistoryModal = ({ isOpen, onClose }: PromoHistoryModalProps) => {
  const t = useTranslations('promotions');
  const { promotions, isLoading } = useMyPromotions('all');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      closeOnOverlayClick={false}
      size="md"
      variant="default"
      header={t('history')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body w-full"
    >
      <ModalContent className="p-4 max-h-[80vh] overflow-y-auto">
        {isLoading ? (
          <SkeletonLoader className="w-full h-40" />
        ) : promotions.length === 0 ? (
          <p className="text-white/70 text-sm py-8 text-center">{t('no_promotions')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-white/60 text-xs font-normal">{t('table_bonus_type')}</th>
                  <th className="py-3 px-4 text-white/60 text-xs font-normal">{t('table_name')}</th>
                  <th className="py-3 px-4 text-white/60 text-xs font-normal">{t('table_wagered')}</th>
                  <th className="py-3 px-4 text-white/60 text-xs font-normal">{t('table_accrual')}</th>
                  <th className="py-3 px-4 text-white/60 text-xs font-normal">{t('table_activation')}</th>
                  <th className="py-3 px-4 text-white/60 text-xs font-normal">{t('table_expiration')}</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map(p => (
                  <Row key={p.id} p={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PromoHistoryModal;
