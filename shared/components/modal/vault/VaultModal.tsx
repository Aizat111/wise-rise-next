'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';

import { Modal } from '../Modal';

import DepositType from './partials/DepositType';
import WithdrawalType from './partials/WithdrawalType';
import { modalVaultTypeItems } from '@/core/constants/switch.constants';
import { useNavigationLoading } from '@/core/providers/NavigationLoadingProvider';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { Switch } from '@/shared/ui/switch';

export interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props: Record<string, unknown>;
}
const VaultModal: FC<VaultModalProps> = ({ isOpen, onClose, type }) => {
  const [selectedModalType, setSelectedModalType] = useState<string>(type);
  const depositCurrency = useAppSelector(state => state.modals.modals.depositCurrency);
  const { stopLoading } = useNavigationLoading();

  const t = useTranslations();

  const handleClose = () => {
    stopLoading();
    onClose();
  };
  useEffect(() => {
    const modalType = Array.isArray(depositCurrency) ? depositCurrency[0]?.type : depositCurrency?.type;

    if (modalType) {
      setSelectedModalType(modalType);
    }
  }, [depositCurrency]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      variant="default"
      header={t('vault')}
      headerClassName="uppercase font-byrd text-base font-semibold"
      modalClassName="bg-toshi_body flex flex-col  justify-between"
      contentClassName="h-auto no-scrollbar "
    >
      <div className="flex flex-col h-full w-auto gap-1 mb-2">
        <div className="w-full lg:w-2/3 mb-4 flex flex-col justify-between">
          <Switch
            items={modalVaultTypeItems}
            value={selectedModalType}
            className="bg-toshi_body border border-gray-500 "
            onChange={value => setSelectedModalType(value as string)}
            size="md"
          />
        </div>

        {selectedModalType === 'deposit' && <DepositType />}
        {selectedModalType === 'withdraw' && <WithdrawalType />}
      </div>
    </Modal>
  );
};

export default VaultModal;
