'use client';

import { Button } from '@investorcentretb/toshi-ui';
import type { FC } from 'react';

interface ClaimCardProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
}

export const ClaimCard: FC<ClaimCardProps> = ({ title, buttonText, onButtonClick }) => {
  return (
    <div className="flex flex-row items-center justify-between  gap-2  bg-bg_menu rounded-lg p-2">
      <p className="text-white font-semibold text-base"> {title}</p>
      <Button intent="primary" appearance="glossy" borderRadius="md" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </div>
  );
};

export default ClaimCard;
