'use client';

import Link from 'next/link';
import React from 'react';

import { Modal } from '@/shared/components/modal/Modal';

interface FreebetInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  freeSpinsAmount: number;
  freeSpinsValue: number;
}

export const FreebetInfoModal: React.FC<FreebetInfoModalProps> = ({
  isOpen,
  onClose,
  freeSpinsAmount,
  freeSpinsValue
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      modalClassName="bg-gradient-to-br from-[#1E2438] via-[#181D2B] to-[#2C3550] w-[420px] max-w-[900px] border border-[#34C342]/20 shadow-[0_0_20px_rgba(52,195,66,0.1)]"
      title=""
      showCloseButton={true}
    >
      <div className="flex flex-col items-center relative overflow-hidden pb-4 px-8 pt-0 gap-7">
        {/* Logo Box */}
        <div className="relative w-full flex justify-center items-center p-6 rounded-[20px] bg-gradient-to-br from-[#34C342]/10 to-[#2C3550]/30 border-2 border-[#34C342]/30 animate-in fade-in zoom-in duration-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#34C342] to-transparent opacity-50 -z-10 rounded-[19px]" />
          <img
            src="/assets/providers/hacksaw.svg"
            alt="Hacksaw Gaming"
            className="w-[160px] brightness-110 contrast-110 animate-pulse"
          />
        </div>

        {/* Reward Card */}
        <div className="w-full relative p-7 rounded-2xl bg-gradient-to-br from-[#2C3550] to-[#1E2438] border border-[#34C342]/20 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
          {/* Shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#34C342] to-transparent" />

          <div className="flex flex-col gap-5 items-center">
            <span className="font-bold text-lg text-white/90 tracking-wide">Your Reward</span>

            <div className="flex gap-4 items-center justify-center">
              <div className="bg-gradient-to-br from-[#34C342] to-[#2C3550] rounded-xl px-5 py-3 border border-white/10 shadow-lg">
                <span className="font-bold text-2xl text-white leading-none">{freeSpinsAmount}</span>
              </div>
              <div className="text-center">
                <p className="font-bold text-base text-white mb-0.5">Free Spin{freeSpinsAmount > 1 ? 's' : ''}</p>
                <p className="font-bold text-sm text-[#34C342]">
                  ${freeSpinsValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} each
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#34C342]/30 to-transparent my-2" />

            <p className="font-bold text-center text-sm text-white/70">Valid on all Hacksaw Gaming slots</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/casino/providers/hacksaw" passHref className="w-full">
          <button
            onClick={handleClose}
            className="w-full py-4 px-10 bg-[#34C342] hover:bg-[#2FB13C] text-white font-semibold text-base rounded-lg border border-white/10 shadow-[0_4px_16px_rgba(52,195,66,0.2)] transition-all duration-300 transform active:scale-95"
          >
            Browse Hacksaw Games
          </button>
        </Link>
      </div>
    </Modal>
  );
};
