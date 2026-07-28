'use client';

import { FC, useEffect, useState } from 'react';

import Input from './Input';
import { useDebounce } from '@/shared/hooks/useDebounce';

type NumberOfBallsProps = {
  numberOfBalls: number;
  isProcessing: boolean;
  isLoading: boolean;
  setNumberOfBalls: (_numberOfBets: number) => void;
};

const NumberOfBalls: FC<NumberOfBallsProps> = ({ numberOfBalls, isProcessing, isLoading, setNumberOfBalls }) => {
  const [localNumberOfBalls, setNumberOfBallsState] = useState(numberOfBalls);

  const debouncedNumberOfBalls = useDebounce(localNumberOfBalls, 100);

  useEffect(() => {
    setNumberOfBalls(debouncedNumberOfBalls);
  }, [debouncedNumberOfBalls]);

  useEffect(() => {
    setNumberOfBallsState(numberOfBalls);
  }, [numberOfBalls]);

  return (
    <Input
      type="number"
      label="number_of_balls"
      isTranslated
      className="bg-bg_content"
      fontSize="base"
      min={0}
      max={1000000}
      disabled={isProcessing || isLoading}
      containerClassName="order-4 xl:order-3"
      labelClassName="text-sm"
      value={localNumberOfBalls}
      onChange={e => setNumberOfBallsState(e.target.value as unknown as number)}
    />
  );
};

export default NumberOfBalls;
