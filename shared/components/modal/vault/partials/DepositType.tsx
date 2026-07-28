'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { formatCurrency } from '@/core/lib/utils';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { VaultTransferResponse } from '@/core/types/vault.types';
import { useProfile } from '@/shared/hooks/useProfile';
import Image from '@/shared/ui/Images/Image';
import Input from '@/shared/ui/inputs/Input';

type DepositTypeProps = {};

const DepositType: FC<DepositTypeProps> = () => {
  const t = useTranslations();
  const userStore = useAppSelector(state => state.user);

  const [amount, setAmount] = useState<number>(0);

  // Fether
  const vaultTransfer = useFetcher<VaultTransferResponse>(TYPES.VAULT_TRANSFER).action();
  const profile = useProfile();

  const handleDeposit = async () => {
    await vaultTransfer.mutateAsync({ to: 'vault', amount: amount });
    profile.refetch();
  };

  return (
    <div className="flex flex-col justify-start  rounded-xl  items-start gap-4">
      <div className="flex flex-col w-full gap-1 justify-start items-start rounded-lg">
        <p className="text-sm font-medium text-white70"> {t('balance')} </p>

        <div className="rounded-lg bg-bg_menu flex flex-row items-center justify-start gap-3 w-full text-base py-2 px-4">
          <div className=" gap-2">
            <Image src="/assets/currencies/dollar.svg" alt="dollar" width={20} height={20} />
          </div>
          <div className="flex flex-col gap-0">
            <p className="text-sm font-medium text-white70"> USD </p>
            <p className="text-sm font-medium text-white"> {formatCurrency(Number(userStore.user?.balance))} </p>
          </div>
        </div>
      </div>

      <Input
        label={t('vault_modal.amount')}
        placeholder="0.00"
        size="lg"
        background="dark"
        type="number"
        step="1e-8"
        maxIcon={true}
        setMaxIconValue={() => setAmount(Number(userStore.user?.vault_balance))}
        value={amount.toString()}
        onChange={e => setAmount(Number(e.target.value))}
      />
      <Button
        intent="primary"
        appearance="glossy"
        borderRadius="md"
        className="w-full mt-1"
        onClick={handleDeposit}
        isLoading={vaultTransfer.isPending}
      >
        {t('vault_modal.deposit')}
      </Button>
    </div>
  );
};

export default DepositType;
