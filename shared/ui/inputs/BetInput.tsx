'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Image from '../Images/Image';

import Input from './Input';
import { notify } from '@/core/lib/notify';
import { cn } from '@/core/lib/utils';
import { RootState } from '@/core/redux-toolkit/store';
import { useDebounce } from '@/shared/hooks/useDebounce';

type BetInputProps = {
  form: any;
  autoPlay: string;
  setBetAmount: (_amount: number) => void;
  disabled?: boolean;
  containerClassName?: string;
};

const BetInput: FC<BetInputProps> = ({ form, autoPlay, setBetAmount, disabled, containerClassName }) => {
  const [betAmount, setBetAmountState] = useState(form.bet);
  const { balance } = useSelector((state: RootState) => state.balance);

  const debouncedBetAmount = useDebounce(betAmount, 100);

  useEffect(() => {
    setBetAmount(debouncedBetAmount);
  }, [debouncedBetAmount]);

  useEffect(() => {
    setBetAmountState(form.bet);
  }, [form.bet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (Number(value) > balance) {
      notify('error', 'errors.insufficientfunds', 'errors.insufficientfundsdesc');
      return;
    }
    // Sadece rakam ve isteğe bağlı tek bir nokta izin ver
    if (!/^\d*\.?\d*$/.test(value)) return;

    // Boş olabilir
    if (value === '' || value === '0' || value === '0.') {
      setBetAmountState(value);
      return;
    }

    // Çoklu leading zero engelle
    if (/^0+[0-9]/.test(value)) {
      value = value.replace(/^0+/, '') || '0';
    }

    setBetAmountState(value);
  };

  const handleBlur = () => {
    if (betAmount === '') {
      setBetAmountState('0');
      return;
    }
  };

  return (
    <Input
      label="bet_amount"
      isTranslated
      value={betAmount}
      onChange={handleChange}
      onBlur={handleBlur}
      className="bg-bg_content"
      type="number"
      step="1e-8"
      fontSize="base"
      min={0}
      max={1000000}
      disabled={disabled}
      labelClassName="text-sm"
      containerClassName={cn(autoPlay === 'auto' ? 'order-2 xl:order-1' : 'order-1', containerClassName)}
      rightIcon={
        <div className="flex gap-1.5 -mr-1.5">
          <Image src="/assets/currencies/dollar.svg" alt="bet_amount" width={18} height={18} />
          <Button
            onClick={() => {
              const newValue = betAmount < 0.1 ? 0 : Number(betAmount) / 2;
              const roundedValue = parseFloat(newValue.toFixed(2));
              if (roundedValue > balance) {
                notify('error', 'errors.insufficientfunds', 'errors.insufficientfundsdesc');
                return;
              }
              setBetAmountState(roundedValue.toString());
            }}
            appearance="3d"
            intent="gray"
            size="xs"
            disabled={disabled}
            className="!px-1.5"
          >
            1/2
          </Button>
          <Button
            onClick={() => {
              let newValue = Number(betAmount) * 2;
              if (Number.isNaN(newValue)) newValue = 0;
              if (newValue > balance) newValue = balance;
              const roundedValue = parseFloat(newValue.toFixed(2));
              setBetAmountState(roundedValue.toString());
            }}
            appearance="3d"
            intent="gray"
            size="xs"
            disabled={disabled}
            className="!px-1.5"
          >
            2x
          </Button>
        </div>
      }
    />
  );
};

export default BetInput;
