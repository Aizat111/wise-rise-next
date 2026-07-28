import { CopyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import type { CurrencyDep, DepositEstimationResponse } from '@/core/types/deposit.types';
import useClipboard from '@/shared/hooks/useClipboard';
import { useDebounce } from '@/shared/hooks/useDebounce';
import Input from '@/shared/ui/inputs/Input';
import ShowTextInput from '@/shared/ui/inputs/ShowTextInput';
import { Loader } from '@/shared/ui/loaders/Loader';

type CalculateCoinToDollarProps = {
  selectedCurrency: CurrencyDep;
};

const CalculateCoinToDollar = ({ selectedCurrency }: CalculateCoinToDollarProps) => {
  const t = useTranslations();
  const getEstimation = useFetcher<DepositEstimationResponse>(TYPES.GET_ESTIMATION).action();
  const [estimation, setEstimation] = useState<DepositEstimationResponse | undefined>(undefined);
  const { copy } = useClipboard();

  const [amount, setAmount] = useState('0.00');
  const debouncedAmount = useDebounce(amount, 500);

  useEffect(() => {
    if (debouncedAmount !== '0.00' && selectedCurrency?.depositName?.toLowerCase()) {
      getEstimation
        .mutateAsync({ coin: selectedCurrency?.depositName?.toLowerCase(), amount: debouncedAmount })
        .then(res => {
          setEstimation(res);
        });
    } else {
      setEstimation(undefined);
    }
  }, [debouncedAmount, selectedCurrency?.depositName?.toLowerCase()]);

  useEffect(() => {
    setEstimation(undefined);
  }, [selectedCurrency]);

  return (
    <div className="flex gap-4">
      <Input
        leftIcon={selectedCurrency?.icon}
        label={t('coint_to_usd', { coin: selectedCurrency?.name || '' })}
        background="outline"
        type="number"
        placeholder="0.00"
        onChange={e => setAmount(e.target.value)}
        rightIcon={<CopyIcon className="size-4 cursor-pointer" onClick={() => copy(debouncedAmount)} />}
      />
      <ShowTextInput
        leftIcon={getEstimation.isPending ? <Loader variant="spinner" size="sm" /> : '/assets/currencies/dollar.svg'}
        label={t('dollars', { coin: selectedCurrency?.name || '' })}
        value={estimation?.usdAmount || '0.00'}
        background="outline"
        rightIcon={
          <CopyIcon
            className="size-4 cursor-pointer"
            onClick={() => copy(estimation?.usdAmount?.toString() || '0.00')}
          />
        }
      />
    </div>
  );
};

export default CalculateCoinToDollar;
