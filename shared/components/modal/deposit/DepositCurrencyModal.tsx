'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';

import { Modal } from '../Modal';

import BuyCryptoType from './partials/BuyCryptoType';
import DepositeType from './partials/DepositType';
import { modalDepositTypeItems } from '@/core/constants/switch.constants';
import { useNavigationLoading } from '@/core/providers/NavigationLoadingProvider';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { useModalManager } from '@/shared/hooks/useModal';
import { Switch } from '@/shared/ui/switch';

export interface DepositCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props: Record<string, unknown>;
}
const DepositCurrencyModal: FC<DepositCurrencyModalProps> = ({ isOpen, onClose, type }) => {
  const t = useTranslations();
  const { openModal } = useModalManager();
  const [selectedModalType, setSelectedModalType] = useState<string>(type);
  const depositCurrency = useAppSelector(state => state.modals.modals.depositCurrency);
  const { stopLoading } = useNavigationLoading();

  useEffect(() => {
    const modalType = Array.isArray(depositCurrency) ? depositCurrency[0]?.type : depositCurrency?.type;

    if (modalType) {
      setSelectedModalType(modalType);
    }
    stopLoading();
  }, [depositCurrency]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      modalClassName=""
      header={t('deposit')}
      headerClassName="uppercase font-byrd text-base font-semibold"
      contentClassName="h-auto no-scrollbar py-4 px-4"
    >
      <div className="w-full lg:w-full mb-4 flex flex-row justify-between items-center gap-2">
        <Switch
          items={modalDepositTypeItems}
          value={selectedModalType}
          className="bg-toshi_body border border-gray-500 flex-1 max-w-[300px]"
          buttonClassName="whitespace-nowrap p-0 "
          onChange={value => setSelectedModalType(value as string)}
          size="md"
        />
        <div
          className="flex bg-bg_menu rounded-lg px-4 py-3 text-sm h-full cursor-pointer threed flex-row whitespace-nowrap"
          onClick={() => {
            onClose();
            setTimeout(() => {
              openModal('withdrawalCurrency', 'withdraw');
            }, 100);
          }}
        >
          Withdraw
        </div>
      </div>
      {selectedModalType === 'deposit' && <DepositeType />}
      {selectedModalType === 'buycrypto' && <BuyCryptoType />}
    </Modal>
  );
};

export default DepositCurrencyModal;
