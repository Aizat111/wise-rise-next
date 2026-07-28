'use client';

import { useTranslations } from 'next-intl';

import { Modal, ModalContent } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { cn } from '@/core/lib/utils';
import { useNavigationLoading } from '@/core/providers/NavigationLoadingProvider';
import { STYLES } from '@/screens/raffle/partials/PrizeTiersItem';
import { Loader } from '@/shared/ui/loaders/Loader';
import { formatNumberWithDecimals } from '@/shared/utils/numberUtils';

type PrizeTier = {
  place: number;
  prize_amount: number;
  prize_description: string;
};

interface PrizesListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrizesListModal = ({ isOpen, onClose }: PrizesListModalProps) => {
  const t = useTranslations();
  const { stopLoading } = useNavigationLoading();
  const { data: prizes, isFetching } = useFetcher<{ data: PrizeTier[] }>(TYPES.GET_RAFFLE_PRIZES).render();

  const handleClose = () => {
    stopLoading();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="lg"
      variant="default"
      header={t('raffle_prizes')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 justify-between text-white/60 text-sm border-b border-white/10 pb-2">
            <span>{t('raffle.position')}</span>
            <span>{t('raffle.prize')}</span>
          </div>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto no-scrollbar bg-bg_content rounded-2xl p-4">
            {isFetching ? (
              <div className="flex items-center justify-center h-full">
                <Loader variant="spinner" size="sm" />
              </div>
            ) : (
              prizes?.data?.map((prize: PrizeTier) => (
                <div
                  key={prize.place}
                  className="flex flex-row gap-2 justify-between items-center h-[40px] border-b border-white/10"
                >
                  <span
                    className={cn(
                      'flex items-center justify-center text-sm font-semibold uppercase tracking-wide text-white',
                      'h-10 w-10 rounded-full',
                      STYLES?.[prize.place - 1] ? STYLES?.[prize.place - 1]?.tagBg : 'bg-white/10',
                      STYLES?.[prize.place - 1] ? STYLES?.[prize.place - 1]?.tagText : 'text-white'
                    )}
                    style={{
                      textShadow: '1px 1px 0px 0px rgba(39, 39, 39, 1)'
                    }}
                  >
                    {prize.place}
                  </span>
                  <span>${formatNumberWithDecimals(Number(prize.prize_amount))}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PrizesListModal;
