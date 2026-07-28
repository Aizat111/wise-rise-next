'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { CopyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { betTypeItems } from '@/core/constants/switch.constants';
import { RootState } from '@/core/redux-toolkit/store';
import { IBetHistory } from '@/core/types/user.types';
import Card from '@/shared/components/card/Card';
import { Modal, ModalContent } from '@/shared/components/modal/Modal';
import useClipboard from '@/shared/hooks/useClipboard';
import Image from '@/shared/ui/Images/Image';
import { ImageWithFallback } from '@/shared/ui/Images/ImageWithFallback';
import { Link } from '@/shared/ui/LoadingLink';
import { Switch } from '@/shared/ui/switch';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';
import { getFormattedDate } from '@/shared/utils/dateTimeUtils';
import { multiplier, worth } from '@/shared/utils/numberUtils';

interface BetlModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: IBetHistory;
}

const BetlModal = ({ isOpen, onClose, data }: BetlModalProps) => {
  const t = useTranslations();
  const { copy } = useClipboard();

  const [betType, setBetType] = useState<string>('bet');
  const { user } = useSelector((state: RootState) => state.user);
  const hasFairnessData = Boolean(data?.server_seed);

  useEffect(() => {
    if (!hasFairnessData && betType === 'fairness') {
      setBetType('bet');
    }
  }, [hasFairnessData, betType]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="md"
      variant="default"
      header={t('bet')}
      headerClassName="uppercase font-byrd"
      modalClassName="bg-toshi_body max-w-[420px]"
    >
      <ModalContent className="p-0 w-full  no-scrollbar max-h-[700px] flex flex-col items-center">
        {hasFairnessData && (
          <Switch
            items={betTypeItems}
            value={betType}
            onChange={value => setBetType(value as string)}
            className="w-[300px] mb-6"
          />
        )}
        {betType === 'bet' && (
          <div className="relative w-full mt-2">
            <div className="relative z-[50] flex flex-col justify-center items-center">
              <Image src={`/assets/svgs/bet-logo.svg`} alt="bet" width={191} height={120} />
            </div>

            <Card className="relative z-[0] border-2 border-bg_menu bg-transparent -mt-4 gap-6 mb-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-white text-center text-lg mb-2">{user?.username}</h4>
                  <ImageWithFallback
                    src={data?.gameImage}
                    alt={data?.game_name}
                    width={100}
                    height={100}
                    className="rounded-lg aspect-square object-cover"
                  />

                  <hr className="w-full border-white/10 my-4" />
                  <div className="flex flex-col gap-1 items-center mb-2">
                    <span className="text-white/70 text-xs">
                      {getFormattedDate(data?.created_at, 'hh:mm a MM/dd/yyyy')}
                    </span>
                    <span className="text-white/70 text-xs flex items-center gap-1">
                      ID:{' '}
                      <span className="text-xs flex items-center gap-1">
                        <span className="text-white/70">{data?.id}</span>
                        <CustomTooltip label={t('copy')} triggerClassName="cursor-pointer">
                          <CopyIcon onClick={() => copy(data?.id)} className="w-4 h-4 cursor-pointer" />
                        </CustomTooltip>
                      </span>
                    </span>
                  </div>
                </div>
                {data?.credits_spent && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70 text-sm">{t('bet')}</span>
                    <span className="flex items-center gap-1">
                      {Number(data?.credits_spent)?.toFixed(0)}
                      <Image src={'/assets/currencies/dollar.svg'} alt="Marlin Masters" width={15} height={15} />
                    </span>
                  </div>
                )}
                {data?.multiplier && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70 text-sm">{t('multiplier')}</span>
                    <span className="flex items-center gap-1">{multiplier(data?.multiplier)}x</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`text-white/70  text-sm`}>{t('payout')}</span>
                  <span className={`flex align-center gap-1`}>
                    {worth(data)}
                    <Image src={'/assets/currencies/dollar.svg'} alt="Marlin Masters" width={15} height={15} />
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
        {hasFairnessData && betType === 'fairness' && (
          <div className="w-full flex flex-col gap-4 min-h-[220px]">
            <div className="flex flex-col w-full items-left justify-between border-b border-white/10 pb-2">
              <span className="text-white/70 text-sm">{t('hashed_server_seed')}</span>
              <span className="text-white text-sm break-all ">{data?.server_seed || '-'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-white/70 text-sm">{t('client_seed')}</span>
              <span className="text-white text-sm break-all text-right max-w-[230px]">{data?.client_seed || '-'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-white/70 text-sm">{t('nonce')}</span>
              <span className="text-white text-sm break-all text-right max-w-[230px]">{data?.nonce || '-'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-white mb-2 text-sm">
                {' '}
                To verify the results, you need to unhash the server seed in the fairness modal, accessible in our Toshi
                Dojo games.
              </span>
            </div>
            {/* <Button
              appearance="solid"
              intent="primary"
              className="w-full"
              onClick={() => {
                openModal('fairness', 'verify', {
                  prefillServerSeed: data?.server_seed,
                  prefillClientSeed: data?.client_seed,
                  prefillNonce: data?.nonce,
                  prefillGame: data?.game_name
                });
              }}
            >
              Verify results
            </Button>
            <p className="text-white/50 text-xs text-center">{t('fairness_description')}</p> */}
          </div>
        )}
        <div className="p-0 w-full">
          <Link href={data?.gameUrl}>
            <Button appearance="glossy" intent="primary" className="w-full">
              {t('play_now')}
            </Button>
          </Link>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default BetlModal;
