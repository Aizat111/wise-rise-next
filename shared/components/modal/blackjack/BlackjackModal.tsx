'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';

import { Modal, ModalContent } from '../Modal';

import { Link } from '@/shared/ui/LoadingLink';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlackjackModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const t = useTranslations();
  const description = t.rich('blackjack_autobet_description', {
    link: chunks => (
      <Link
        href="https://wizardofodds.com/games/blackjack/strategy/calculator/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center font-extrabold text-[14px] ml-1 text-[#E18314] hover:text-yellow-300 hover:underline"
      >
        {chunks}
      </Link>
    )
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="md"
      variant="default"
      header={t('blackjack_autobet')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        <div className="flex flex-col justify-center items-center gap-3 mb-7">
          {/* Info section container */}
          <div className="flex flex-col gap-4 w-full">
            <div
              className="flex items-start gap-3 rounded-md p-3"
              style={{ background: 'rgba(59,82,138,0.3)', lineHeight: '14px' }}
            >
              <p className="font-bold text-[14px] text-white">{description}</p>
            </div>

            {/* Content */}
            <div>
              <p className="font-bold text-[14px] text-white/80 leading-relaxed">
                {t('blackjack_autobet_description_2')}
              </p>
            </div>
          </div>
        </div>
        <div className="p-0 h-full">
          <Button appearance="glossy" intent="primary" className="w-full" onClick={onClose}>
            {t('got_it')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default BlackjackModal;
