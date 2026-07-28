'use client';

import { FC, useEffect, useState } from 'react';

import Input from './Input';
import { useDebounce } from '@/shared/hooks/useDebounce';

type NumberOfBetsProps = {
  numberOfBets: number;
  isProcessing: boolean;
  isLoading: boolean;
  setNumberOfBets: (_numberOfBets: number) => void;
};

const NumberOfBets: FC<NumberOfBetsProps> = ({ numberOfBets, isProcessing, isLoading, setNumberOfBets }) => {
  const [localNumberOfBets, setNumberOfBetsState] = useState(numberOfBets);

  const debouncedNumberOfBets = useDebounce(localNumberOfBets, 100);

  useEffect(() => {
    setNumberOfBets(debouncedNumberOfBets);
  }, [debouncedNumberOfBets]);

  useEffect(() => {
    setNumberOfBetsState(numberOfBets);
  }, [numberOfBets]);

  return (
    <Input
      type="number"
      label="number_of_bets"
      isTranslated
      className="bg-bg_content"
      fontSize="base"
      min={0}
      max={1000000}
      disabled={isProcessing || isLoading}
      containerClassName="order-4 xl:order-3"
      labelClassName="text-sm"
      value={localNumberOfBets}
      onChange={e => setNumberOfBetsState(e.target.value as unknown as number)}
    />
  );
};

export default NumberOfBets;
