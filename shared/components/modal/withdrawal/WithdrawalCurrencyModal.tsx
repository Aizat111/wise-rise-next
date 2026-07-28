'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Modal } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { currenciesWdr } from '@/core/constants/currencies.constants';
import STORAGE_KEY from '@/core/constants/storage.constants';
import { useNavigationLoading } from '@/core/providers/NavigationLoadingProvider';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { RootState } from '@/core/redux-toolkit/store';
import { CurrencyDep, SubmitWithdrawalResponse, WithdrawEstimationResponse } from '@/core/types/deposit.types';
import Input from '@/shared/ui/inputs/Input';
import { Loader } from '@/shared/ui/loaders/Loader';
import CurrencyDepSelect from '@/shared/ui/selects/CurrencyDepSelect';
import SearchableSelect from '@/shared/ui/selects/Select';
import { safeParsePositiveAmount } from '@/shared/utils/numberUtils';
import storage from '@/shared/utils/storage';
import { authSchemas } from '@/shared/utils/validationSchemas';

export interface WithdrawalCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props?: Record<string, unknown>;
}

const WithdrawalCurrencyModal: FC<WithdrawalCurrencyModalProps> = ({ isOpen, onClose, props }) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const currency = searchParams?.get('currency');
  const { stopLoading } = useNavigationLoading();
  const withdrawalModalState = useAppSelector(state => state.modals.modals.withdrawalCurrency);

  const handleClose = () => {
    stopLoading();
    onClose();
  };

  // Fetch Data
  const getWithdrawEstimation = useFetcher<WithdrawEstimationResponse>(TYPES.GET_ESTIMATION).action();

  const submitWithdrawalRequest = useFetcher<SubmitWithdrawalResponse>(TYPES.SUBMIT_WITHDRAWAL_REQUEST).action();

  const userStore = useAppSelector(state => state.user);

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDep | undefined>(undefined);
  const [selectedNetwork, setSelectedNetwork] = useState<string | undefined>(
    selectedCurrency?.defaultNetwork || undefined
  );
  const [cryptoBalance, setCryptoBalance] = useState<string>('0.00'); // New state for crypto balance
  const [selectedCryptoPriceInUSD, setSelectedCryptoPriceInUSD] = useState<number | undefined>(0);

  // Form validation schema
  const schema = useMemo(() => authSchemas.withdrawal(t, cryptoBalance), [t, cryptoBalance]);
  type FormData = z.infer<ReturnType<typeof authSchemas.withdrawal>>;
  const { balance } = useAppSelector((state: RootState) => state.balance);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      walletAddress: '',
      amount: '0.00',
      tag: '',
      twoFactorCode: ''
    }
  });

  // Watch form values
  const amount = watch('amount');
  const parsedAmount = safeParsePositiveAmount(amount);
  const isAmountValid = parsedAmount !== null;
  const onSubmit = (data: FormData) => {
    // Defence in depth: schema already rejects non-finite / <=0 amounts, but
    // re-parse here so an `assetAmount: NaN` can never reach the API.
    const safeAssetAmount = safeParsePositiveAmount(data.amount);
    if (safeAssetAmount === null) return;
    const coin_name = selectedCurrency?.depositName;
    submitWithdrawalRequest
      .mutateAsync({
        asset: String(coin_name).toLowerCase(),
        network: selectedNetwork,
        address: data.walletAddress,
        assetAmount: safeAssetAmount,
        twoFactorCode: data.twoFactorCode,
        tag: data.tag || undefined,
        fiatAmount: 0
      })
      .then(() => {
        reset();
        handleClose();
      });
  };

  const currencyFromProps =
    ((props as Record<string, any>)?.currency as string) ||
    ((withdrawalModalState as any)?.props?.currency as string) ||
    currency ||
    storage?.getItem(STORAGE_KEY.WITHDRAW_CURRENCY) ||
    'SOL';

  useEffect(() => {
    if (currencyFromProps) {
      const selectCurrency = currenciesWdr.find(coin => coin.name === currencyFromProps);
      setSelectedCurrency(selectCurrency || undefined);
      setSelectedNetwork(selectCurrency?.defaultNetwork || undefined);
      storage?.setItem(STORAGE_KEY.WITHDRAW_CURRENCY, selectCurrency?.name || '');
    }
  }, [currencyFromProps]);

  useEffect(() => {
    if (selectedCurrency?.networks?.length) {
      setSelectedNetwork(selectedCurrency?.defaultNetwork || undefined);
    }
    if (selectedCurrency?.name) {
      const coin_name = selectedCurrency.depositName;

      getWithdrawEstimation.mutateAsync({ amount: '1', coin: String(coin_name).toLowerCase() }).then(res => {
        const cryptoPriceInUSD = res?.usdAmount;
        setSelectedCryptoPriceInUSD(cryptoPriceInUSD);
        if (!cryptoPriceInUSD) return;
        const numericBalance = Number(balance);
        if (!Number.isFinite(numericBalance) || numericBalance <= 0) {
          setCryptoBalance('0.00000000');
          return;
        }
        const convertedBalance = numericBalance / cryptoPriceInUSD;
        const reducedBalance = Math.floor(convertedBalance * 0.998 * 100000000) / 100000000;
        if (!Number.isFinite(reducedBalance) || reducedBalance <= 0) {
          setCryptoBalance('0.00000000');
          return;
        }
        setCryptoBalance(reducedBalance.toFixed(8));
      });
    }
  }, [selectedCurrency]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      variant="default"
      modalClassName="max-w-[500px]"
      contentClassName="h-auto no-scrollbar pt-4 pb-0 px-0"
      header={t('withdraw')}
      headerClassName="uppercase font-byrd text-base font-semibold"
    >
      <div className="w-full px-6">
        <div className="flex justify-between w-full gap-4 ">
          <div className="w-full">
            <CurrencyDepSelect
              label={t('currency')}
              options={currenciesWdr}
              triggerClassName="bg-bg_content"
              value={selectedCurrency?.name}
              labelClassName="text-grey"
              onChange={currency => {
                setSelectedCurrency(currency);
                setSelectedNetwork(currency?.defaultNetwork || undefined);
                storage?.setItem(STORAGE_KEY.WITHDRAW_CURRENCY, currency?.name || '');
              }}
            />
          </div>
          <div className="w-full">
            {selectedCurrency && (
              <SearchableSelect
                label={t('network')}
                key="select-network"
                options={
                  selectedCurrency?.networks?.map(network => ({
                    value: network,
                    label: network
                  })) || []
                }
                triggerClassName="bg-bg_content w-full h-[40px]"
                contentClassName="bg-bg_content"
                value={selectedNetwork}
                labelClassName="text-grey"
                onChange={network => {
                  if (!Array.isArray(network)) {
                    setSelectedNetwork(network?.value || undefined);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full p-6 pt-3 flex flex-col gap-3 justify-between"
        noValidate
      >
        <div className="py-2">
          <Input
            label={t('withdrawal.wallet_address')}
            registration={register('walletAddress')}
            error={(errors as Record<string, any>)?.walletAddress?.message as string}
            placeholder={t('withdrawal.paste_wallet_address')}
            className="bg-bg_content"
            fontSize="base"
            labelClassName="text-sm"
          />
        </div>
        {(selectedCurrency?.name === 'XRP' || selectedCurrency?.name === 'TON') && (
          <div>
            <Input
              type="number"
              label={t('withdrawal.tag')}
              isTranslated
              className="bg-bg_content"
              fontSize="base"
              min={0}
              max={1000000}
              registration={register('tag')}
              error={(errors as Record<string, any>)?.tag?.message as string}
              labelClassName="text-sm"
            />
          </div>
        )}
        {userStore.user?.twoFactorEnabled && (
          <div>
            <Input
              type="number"
              label="2FA Code"
              isTranslated
              className="bg-bg_content"
              fontSize="base"
              registration={register('twoFactorCode')}
              error={(errors as Record<string, any>)?.twoFactorCode?.message as string}
              labelClassName="text-sm"
            />
          </div>
        )}
        <div>
          <Input
            type="number"
            label="amount"
            isTranslated
            className="bg-bg_content items-center justify-center"
            fontSize="base"
            min={0}
            max={1000000}
            labelClassName="text-sm"
            registration={register('amount')}
            error={(errors as Record<string, any>)?.amount?.message as string}
            rightIcon={
              <div className="flex gap-2 items-center  -mr-1.5 justify-center">
                <p className="text-sm text-white70">
                  ${((parsedAmount ?? 0) * (selectedCryptoPriceInUSD || 0)).toFixed(2)}
                </p>
                <div className="flex gap-1 items-center justify-center">
                  <Button
                    type="button"
                    intent="gray"
                    appearance="3d"
                    size="xs"
                    className="!px-1.5"
                    onClick={() => {
                      const next = (parsedAmount ?? 0) / 2;
                      setValue('amount', Number.isFinite(next) && next > 0 ? String(next) : '0', {
                        shouldValidate: true
                      });
                    }}
                  >
                    1/2
                  </Button>
                  <Button
                    type="button"
                    intent="gray"
                    appearance="3d"
                    size="xs"
                    className="!px-1.5"
                    onClick={() => {
                      const maxParsed = safeParsePositiveAmount(cryptoBalance);
                      setValue('amount', maxParsed !== null ? String(maxParsed) : '0', {
                        shouldValidate: true
                      });
                    }}
                  >
                    Max
                  </Button>
                </div>
              </div>
            }
          />
        </div>
        <div className="flex flex-row gap-1">
          <div className="text-sm text-white70">{t('withdrawal.available_balance')}:</div>
          <div className="text-sm text-white">
            {cryptoBalance} {selectedCurrency?.name}
          </div>
        </div>
        <div className="border-t border-white10 my-2"></div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="text-sm text-white70">{t('withdrawal.network_fee')}</div>
            <div className="text-sm text-white">
              {selectedCurrency?.details?.[0]?.fee?.find(fee => fee.network === selectedNetwork)?.fee || 0.001}{' '}
              {selectedCurrency?.name}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-white70">{t('withdrawal.total_received')}</div>
            <div className="text-sm text-white">
              {Math.max(
                0,
                (parsedAmount ?? 0) -
                  (selectedCurrency?.details?.[0]?.fee?.find(fee => fee.network === selectedNetwork)?.fee || 0.001)
              ).toFixed(selectedCurrency?.name === 'USDT' || selectedCurrency?.name === 'USDC' ? 2 : 8)}{' '}
              {selectedCurrency?.name}
            </div>
          </div>
        </div>
        <Button
          type="submit"
          intent="primary"
          appearance="glossy"
          className="w-full"
          disabled={submitWithdrawalRequest.isPending || !isAmountValid || !isValid}
        >
          {submitWithdrawalRequest.isPending ? <Loader variant="spinner" size="sm" /> : t('submit')}
        </Button>
      </form>
    </Modal>
  );
};

export default WithdrawalCurrencyModal;
