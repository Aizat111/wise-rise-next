'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';

import { useLmsNavigation } from '../../../hooks/useLmsNavigation';
import { Modal, ModalContent } from '../Modal';

import { PAGE } from '@/core/config/public-page.config';
import { useRouter } from '@/core/i18n/navigation';
import { lmsIsWorldCupTournament } from '@/core/lib/lmsUtls';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  props: Record<string, any>;
}

const PREMIER_LEAGUE_SPORTSBOOK_PATH = PAGE.SPORTS_GAME('soccer/england/premier-league-1669818860469096448');

const BetModal = ({ isOpen, onClose, props }: BetModalProps) => {
  const t = useTranslations('last_man_standing');
  const router = useRouter();
  const lmsNav = useLmsNavigation();

  const handlePlaceBet = () => {
    onClose();
    const sportsbookPath = lmsIsWorldCupTournament({ game_name: props.gameName })
      ? PAGE.WORLD_CUP_SPORTSBOOK
      : PREMIER_LEAGUE_SPORTSBOOK_PATH;
    router.push(sportsbookPath);
  };

  const handleClose = () => {
    onClose();
    lmsNav.goToPlaceABet(props.tournamentId as string);
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
        className="!p-0 w-full"
        style={{
          background: `url('/assets/images/place_a_bet.jpg') no-repeat center / cover`,
          padding: 0,
          backgroundSize: '150%'
        }}
      >
        <div className="p-4 flex flex-col justify-between min-h-[530px] w-full pb-10">
          <div className="flex flex-col items-center py-4 text-center mt-20 w-full mx-auto">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-yellow m-0 p-0 font-tusker_grotesk">
              {t('confident')}
            </h2>
            <div className="text-10xl uppercase tracking-wider font-bold text-white m-0 p-0 leading-[1.2] font-tusker_grotesk">
              {/* {props.score} */}
            </div>
            <div className="text-6xl uppercase tracking-wider font-extrabold text-white/70 font-tusker_grotesk">
              {t('bet_now')}
            </div>
          </div>
          <div className="p-0 h-full">
            <Button appearance="glossy" intent="primary" size="lg" className="w-full" onClick={handlePlaceBet}>
              {t('place_bet')}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default BetModal;
