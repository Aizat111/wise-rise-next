'use client';

import React, { useMemo } from 'react';

import { LootboxSlider } from './partials/LootboxSlider';
import { PrizeList } from './partials/PrizeList';
import { CaseChance, chances, links } from '@/core/constants/coupon-chances.constants';
import { Modal } from '@/shared/components/modal/Modal';

export interface CouponCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  props: {
    posiblePrizes: CaseChance[];
    code: string;
  };
}

export const CouponCaseModal: React.FC<CouponCaseModalProps> = ({ isOpen, onClose, props }) => {
  console.log('props', props);
  const availablePrizes = useMemo(() => {
    return props.posiblePrizes && props.posiblePrizes.length > 0 ? props.posiblePrizes : chances.easy;
  }, [props.posiblePrizes]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Open Lootbox"
      modalClassName="bg-[#181d2b] max-w-[900px] overflow-y-scroll w-full"
    >
      <div className="relative w-full flex flex-col gap-6 ">
        {/* Slider Container */}
        <div className="w-full">
          <LootboxSlider links={links} posiblePrizes={availablePrizes} code={props.code} />
        </div>
        {/* Available Prizes */}
        <div className="w-full ">
          <PrizeList availablePrizes={availablePrizes} links={links} />
        </div>
      </div>
    </Modal>
  );
};

export default CouponCaseModal;
