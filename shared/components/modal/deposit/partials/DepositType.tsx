'use client';

import { CircleQuestionMark, CopyIcon, RefreshCcwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { type FC, useEffect, useState } from 'react';

import CalculateCoinToDollar from './CalculateCoinToDollar';
import DepositTypeFooter from './DepositTypeFooter';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { currenciesDep } from '@/core/constants/currencies.constants';
import STORAGE_KEY from '@/core/constants/storage.constants';
import { CurrencyDep, DepositAddressResponse } from '@/core/types/deposit.types';
import useClipboard from '@/shared/hooks/useClipboard';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import ShowTextInput from '@/shared/ui/inputs/ShowTextInput';
import { Loader } from '@/shared/ui/loaders/Loader';
import CurrencyDepSelect from '@/shared/ui/selects/CurrencyDepSelect';
import SearchableSelect from '@/shared/ui/selects/Select';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';
import { getDepositAssetName } from '@/shared/utils/getDepositAssetName';
import storage from '@/shared/utils/storage';

type DepositeTypeProps = {};

const DepositeType: FC<DepositeTypeProps> = () => {
  const t = useTranslations();
  const { copy } = useClipboard();
  const { width } = useWindowSize();
  const searchParams = useSearchParams();
  const currency = searchParams?.get('currency');
  const router = useRouter();
  const pathname = usePathname();

  // Fetch Data
  const getDepositAddress = useFetcher<DepositAddressResponse>(TYPES.GET_DEPOSIT_ADDRESS).action();

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDep | undefined>(undefined);
  const [selectedNetwork, setSelectedNetwork] = useState<string | undefined>(
    selectedCurrency?.defaultNetwork || undefined
  );
  const [depositAddress, setDepositAddress] = useState<DepositAddressResponse | undefined>(undefined);

  useEffect(() => {
    if (currency) {
      const selectCurrency = currenciesDep.find(coin => coin.name === currency);
      setSelectedCurrency(selectCurrency || undefined);
      setSelectedNetwork(selectCurrency?.defaultNetwork || undefined);
      storage?.setItem(STORAGE_KEY.DEPOSIT_CURRENCY, selectCurrency?.name || '');
    }
  }, [currency]);

  useEffect(() => {
    if (selectedCurrency?.networks?.length && !selectedNetwork) {
      setSelectedNetwork(selectedCurrency?.defaultNetwork || undefined);
    }
    const assetName = getDepositAssetName(selectedCurrency, selectedNetwork);
    if (assetName) {
      getDepositAddress.mutateAsync({ currency: assetName, forceNewAddress: false } as unknown as void).then(res => {
        setDepositAddress(res);
      });
    }
  }, [selectedCurrency, selectedNetwork]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row bg-bg_menu p-4 rounded-xl gap-2 lg:gap-4">
        <CurrencyDepSelect
          label={t('currency')}
          options={currenciesDep}
          triggerClassName="bg-toshi_body border border-white10 "
          contentClassName="bg-toshi_body border border-white10 "
          value={selectedCurrency?.name}
          labelClassName="text-grey"
          onChange={opt => {
            setSelectedCurrency(opt);
            setSelectedNetwork(opt?.defaultNetwork || opt?.networks?.[0] || undefined);
            if (opt) {
              const params = new URLSearchParams(searchParams || '');
              params.set('currency', opt.name);
              router.push(`${pathname}?${params.toString()}`);
            }
          }}
        />
        {selectedCurrency && (
          <SearchableSelect
            label={t('network')}
            options={
              selectedCurrency?.networks?.map(network => ({
                value: network,
                label: network
              })) || []
            }
            triggerClassName="bg-toshi_body border border-white10 "
            contentClassName="bg-toshi_body border border-white10 "
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
      <div className="bg-bg_menu p-4 flex flex-col gap-6 rounded-xl">
        <div className="flex flex-col gap-2">
          <ShowTextInput
            label={t('deposit_address')}
            value={
              getDepositAddress.isPending ? (
                <Loader variant="spinner" size="sm" className="!justify-start" />
              ) : (
                depositAddress?.wallet || ''
              )
            }
            inputClassName="pr-20 py-2"
            rightIcon={
              <div className="flex items-center gap-3">
                <RefreshCcwIcon
                  className="size-4 cursor-pointer"
                  onClick={() => {
                    if (getDepositAddress.isPending) return;
                    const assetName = getDepositAssetName(selectedCurrency, selectedNetwork);
                    if (!assetName) return;
                    getDepositAddress
                      .mutateAsync({ currency: assetName, forceNewAddress: true } as unknown as void)
                      .then(res => {
                        setDepositAddress(res);
                      });
                  }}
                />

                <CopyIcon className="size-4 cursor-pointer" onClick={() => copy(depositAddress?.wallet || '')} />
              </div>
            }
            background="outline"
          />
          {depositAddress?.memo && (
            <ShowTextInput
              label={t('tag')}
              value={depositAddress?.memo || ''}
              rightIcon={
                <div className="flex items-center gap-3">
                  <CopyIcon className="size-4 cursor-pointer" onClick={() => copy(depositAddress?.memo || '')} />
                </div>
              }
              background="outline"
            />
          )}
        </div>
        <div className="flex gap-4 bg-bg_menu p-0 rounded-md lg:gap-4">
          <div className="w-[90px] h-[90px] lg:w-[110px] ml-0.5 lg:h-[90px] p-2 bg-white rounded-md">
            <QRCodeCanvas value={depositAddress?.wallet || ''} size={width < 1020 ? 75 : 75} className="rounded-md" />
          </div>

          <div className="flex flex-col  gap-1 w-full">
            <div className="h-8 border-b border-white10">
              <h4 className="text-sm lg:text-base font-medium">{t('there_is_no_minimum_deposit')}</h4>
            </div>

            <div className="flex items-center w-full justify-between">
              <p className="text-sm lg:text-bassme text-grey">{t('depositbonus')}</p>
              <CustomTooltip
                label={
                  <div className="flex flex-col gap-2 w-full max-w-[387px]">
                    <span className="text-sm text-toshi_blue7 font-medium">{t('deposit_bonus')}</span>
                    <p className="text-sm  text-line-height-20 text-toshi_blue7">
                      {t('you_will_automatically_receive_your_deposit_bonus')}
                    </p>
                  </div>
                }
              >
                <div className="cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center">
                  <CircleQuestionMark className="p-1" size={30} />
                </div>
              </CustomTooltip>
            </div>
          </div>
        </div>

        <CalculateCoinToDollar selectedCurrency={selectedCurrency as CurrencyDep} />
        <DepositTypeFooter selectedCurrency={selectedCurrency as CurrencyDep} />
      </div>
    </div>
  );
};

export default DepositeType;
