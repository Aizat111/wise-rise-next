'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Card from '../../card/Card';
import { Modal, ModalContent } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { PAGE } from '@/core/config/public-page.config';
import { notify } from '@/core/lib/notify';
import { useNavigationLoading } from '@/core/providers/NavigationLoadingProvider';
// @ts-expect-error: rewards.types module is missing. This is a temporary workaround.
import type { ILockedBalanceResponse } from '@/core/types/rewards.types';
import ShowTextInput from '@/shared/ui/inputs/ShowTextInput';

interface DepositBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositBonusModal = ({ isOpen, onClose }: DepositBonusModalProps) => {
  const lockedBalance = useFetcher<ILockedBalanceResponse>(TYPES.GET_LOCKED_BALANCE).render({ type: 'deposit-bonus' });
  const claimLockedBalance = useFetcher(TYPES.CLAIM_LOCKED_BALANCE).action();
  const t = useTranslations();
  const { stopLoading } = useNavigationLoading();
  const [lockedDB, setLockedDB] = useState(0);
  const [unlockedDB, setUnlockedDB] = useState(0);
  const [lockedBalanceId, setLockedBalanceId] = useState<string | null>(null);

  const handleClose = () => {
    stopLoading();
    onClose();
  };

  const handleClaim = async () => {
    if (lockedBalanceId) {
      claimLockedBalance.mutateAsync({ lockedBalanceId }).then((response: any) => {
        if (response.data) {
          setUnlockedDB(0);
          notify('success', response.data.message, response.data.message);
          onClose();
        } else if (response.error) {
          notify('error', 'errors.error', { key: 'errors.minimum_claim_is_description', params: { amount: 5 } });
        }
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      stopLoading();
    }
  }, [isOpen]);

  useEffect(() => {
    if (lockedBalance.data?.lockedBalances && lockedBalance.data.lockedBalances.length > 0) {
      setLockedDB(Number(lockedBalance.data.lockedBalances[0].locked));
      setUnlockedDB(Number(lockedBalance.data.lockedBalances[0].unlocked));
      setLockedBalanceId(lockedBalance.data.lockedBalances[0].id);
    }
  }, [lockedBalance.data?.lockedBalances]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="lg"
      variant="default"
      header={t('rewards.depositbonus')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        <div
          className="mb-[-16px] rounded-[4px] w-full flex flex-col items-center justify-center min-h-[220px] gap-4"
          style={{
            backgroundImage: "url('/assets/shared/water.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="flex flex-col justify-center items-center mt-[-16px] gap-0 mb-[4px]">
            {/* <span className="text-[14px] font-extrabold">Keep clicking.</span> */}
            {/* <img src="/assets/shared/toshisat.png" alt="" className="w-[80px] h-[80px] mb-[-12px]" /> */}
          </div>
          <div className="flex flex-col items-center bg-bg_color/50 border border-linebreak p-4 rounded-xl py-8 px-8 gap-4">
            <span className="font-bold text-[16px] px-2 pt-[2px]">Locked: ${Number(lockedDB).toFixed(2)}</span>
            <Button appearance="claim" intent="green" onClick={handleClaim}>
              Claim ${Number(unlockedDB).toFixed(2)}
            </Button>
          </div>
          {/* second section */}
        </div>

        <Card className="flex flex-col gap-4 p-0 rounded-[4px] m-1 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-white">Why is it locked?</span>
            <span className="text-white70">
              Your Deposit Bonus will unlock as you continue to wager in our games. The more you wager, the more is
              unlocked.
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-white">When does it expire?</span>
            <span className="text-white70">Your deposit bonuses do not expire.</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white">How much do I need to wager?</span>
            <ShowTextInput
              label="The formula that decides how much is unlocked is:"
              labelClassName="text-white70 text-base"
              value="Unlocked amount = Wager * 1% * 20%"
            />
            <span className="text-base text-white70">Minimum claim is $5</span>
          </div>
          <div className="h-px bg-[#606985] w-full mt-1 mb-1" />
        </Card>
        <div className="flex gap-3 mt-4 p-0 h-full">
          <Link href={PAGE.SLOTS} className="w-full">
            <Button appearance="glossy" intent="success" className="w-full">
              {t('slots')}
            </Button>
          </Link>

          <Link href={PAGE.TOSHI_DOJO} className="w-full">
            <Button appearance="glossy" intent="primary" className="w-full">
              {t('toshi_dojo')}
            </Button>
          </Link>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DepositBonusModal;
