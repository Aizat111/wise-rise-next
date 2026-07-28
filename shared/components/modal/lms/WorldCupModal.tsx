'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';

import { Modal, ModalContent } from '../Modal';

import { lmsFormatCurrencyMinor } from '@/core/lib/lmsUtls';
import { useLmsNavigation } from '@/shared/hooks/useLmsNavigation';
import Image from '@/shared/ui/Images/Image';

interface WorldCupModalProps {
  isOpen: boolean;
  onClose: () => void;
  props: Record<string, any>;
}

const WorldCupModal = ({ isOpen, props, onClose }: WorldCupModalProps) => {
  const t = useTranslations('last_man_standing');
  const lmsNav = useLmsNavigation();
  const tournamentId = (props.tournamentId as string) || (props.props?.tournamentId as string);
  const roundNo = props.roundNo ?? props.props?.roundNo ?? 1;
  const isUnSeeded = props.isUnSeeded ?? props.props?.isUnSeeded ?? false;
  const prize = props.prize ?? props.props?.prize ?? 0;
  const prize_currency = props.prize_currency ?? props.props?.prize_currency ?? 'USD';

  const handleClose = () => {
    onClose();
    if (tournamentId && !isUnSeeded) {
      lmsNav.goToSelectGame(tournamentId, roundNo as string);
    } else {
      lmsNav.goToProfilePage(tournamentId as string);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="sm"
      variant="default"
      modalClassName="bg-toshi_body max-w-[350px]"
      contentClassName="!p-0 w-full h-full"
    >
      <ModalContent
        className="!p-0 w-full relative"
        style={{
          background: `url('/assets/lms/world_cup.png') no-repeat center / cover`,
          padding: 0,
          backgroundPosition: 'center 120px',
          backgroundSize: '120%'
        }}
      >
        <div
          style={{ background: 'linear-gradient(180deg, #14317D 0%, #14317D 50%, rgba(20, 49, 125, 0) 100%)' }}
          className="absolute top-0 left-0 w-full h-[296px] z-0"
        />
        <div>
          <Image
            src="/assets/lms/world_cup_icon.png"
            alt="World Cup Icon"
            width={37}
            height={58}
            className="absolute top-2 left-2 w-[37px] h-[58px]"
          />
        </div>
        <div className="p-4 flex flex-col justify-between min-h-[530px] w-full pb-5 relative z-10">
          <div className="flex flex-col items-center py-4 text-center mt-5 w-full mx-auto">
            <h2 className="text-5xl font-bold uppercase tracking-wide text-white m-0 p-0 font-tusker_grotesk">
              {lmsFormatCurrencyMinor(Number(prize), prize_currency)}
            </h2>
            <div className="text-3xl uppercase tracking-wider font-bold  text-[#FFF200] m-0 p-0 leading-[1.2] font-tusker_grotesk">
              {t('world_cup_modal_you_are_in')}
            </div>
            <p className="text-[15px]  tracking-wider font-extrabold text-white -mb-1">
              {t('world_cup_modal_opens_soon')}
            </p>
            <p className="text-[15px]  tracking-wider font-extrabold text-white">{t('world_cup_modal_reminder')}</p>
          </div>
          <div className="p-0 h-full">
            <Button
              appearance="glossy"
              intent="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                handleClose();
              }}
            >
              {t('ok')}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default WorldCupModal;
