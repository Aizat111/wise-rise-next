'use client';

import { useSelector } from 'react-redux';

import { Modal } from '../Modal';

import { RootState } from '@/core/redux-toolkit/store';
import { ToshiBetLogoBrandmark } from '@/shared/assets/branding';
import Image from '@/shared/ui/Images/Image';

const RestrictionModal = () => {
  const isOpen = useSelector((state: RootState) => state.ui.restrictionModalOpen);
  const countryCode = useSelector((state: RootState) => state.ui.countryCode);
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={() => {}} showCloseButton={false} size="lg">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ToshiBetLogoBrandmark width={140} className="-mb-24 -mt-4 z-50" height={140} />

        {/* UAE Restriction */}
        {typeof countryCode !== 'undefined' && countryCode === 'AE' && (
          <div className="flex flex-col items-center">
            <Image
              width={100}
              height={100}
              className="w-full z-0  mb-3 rounded-xl overflow-hidden"
              src="/assets/flags/uae.svg"
              alt="UAE Flag"
            />
            <div className="text-white text-center text-[16px] mb-1">Sorry, Toshi.bet is not available in the UAE.</div>
            <div className="text-[#c1c5d0] text-center text-[16px]">We cannot accept players from your country.</div>
          </div>
        )}

        {/* UK Restriction */}
        {typeof countryCode !== 'undefined' && countryCode === 'GB' && (
          <div className="flex flex-col items-center">
            <Image width={100} height={100} className="w-full mt-4 z-0 mb-3" src="/assets/flags/uk.svg" alt="UK Flag" />
            <div className="text-white text-center text-base mt-3 mb-1">
              Sorry, Toshi.bet is not available in the United Kingdom.
            </div>
            <div className="text-white70 text-center text-[16px] mt-1 mb-4 ">
              If you're using a VPN, please disable it and try again.
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RestrictionModal;
