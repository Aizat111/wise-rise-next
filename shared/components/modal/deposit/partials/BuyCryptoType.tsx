import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { PAGE } from '@/core/config/public-page.config';
import { currenciesDep } from '@/core/constants/currencies.constants';
import type { CurrencyDep, DepositAddressResponse } from '@/core/types/deposit.types';
import { Loader } from '@/shared/ui/loaders/Loader';
import CurrencyDepSelect from '@/shared/ui/selects/CurrencyDepSelect';
import { getDepositAssetName } from '@/shared/utils/getDepositAssetName';

type BuyCryptoTypeProps = {};

const BuyCryptoType: FC<BuyCryptoTypeProps> = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const currency = searchParams?.get('currency');
  const router = useRouter();

  // Fetch Data
  const getDepositAddress = useFetcher<DepositAddressResponse>(TYPES.GET_DEPOSIT_ADDRESS).action();

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDep | undefined>(undefined);
  const [depositAddress, setDepositAddress] = useState<DepositAddressResponse | undefined>(undefined);
  const [selectedNetwork, setSelectedNetwork] = useState<string | undefined>(undefined);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (currency) {
      const selectCurrency = currenciesDep.find(coin => coin.name === currency);
      setSelectedCurrency(selectCurrency || undefined);
      setSelectedNetwork(selectCurrency?.defaultNetwork || selectCurrency?.networks?.[0] || undefined);
    }
  }, [currency]);

  useEffect(() => {
    const assetName = getDepositAssetName(selectedCurrency, selectedNetwork);
    if (assetName) {
      getDepositAddress.mutateAsync({ currency: assetName, forceNewAddress: false } as unknown as void).then(res => {
        setDepositAddress(res);
      });
    }
  }, [selectedCurrency, selectedNetwork]);

  useEffect(() => {
    if (depositAddress) {
      const toCode = (selectedCurrency?.name || '').toLowerCase();
      const iframeUrl = `https://widget.changelly.com/?from=*&to=${toCode}&amount=100&address=${depositAddress?.wallet}&fromDefault=&toDefault=${toCode}&merchant_id=r5Q1Kkzq78Regd_Q&payment_id=&v=3&type=no-rev-share&color=34C342&headerId=1&logo=hide&buyButtonTextId=2&readOnlyDestinationAddress=true`;
      setUrl(iframeUrl);
    }
  }, [depositAddress]);

  return (
    <div className="flex flex-col bg-bg_menu p-4 rounded-xl gap-4">
      <div className="flex">
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
              router.push(`${PAGE.DEPOSIT}?currency=${opt.name}`);
            }
          }}
        />
      </div>
      <div>
        {getDepositAddress.isPending ? (
          <Loader variant="spinner" size="sm" />
        ) : (
          <iframe src={url} width="100%" height="400px" style={{ borderRadius: '10px', zIndex: '1' }} />
        )}
      </div>
    </div>
  );
};

export default BuyCryptoType;
