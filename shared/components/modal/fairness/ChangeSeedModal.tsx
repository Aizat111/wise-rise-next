'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Modal, ModalContent } from '../Modal';

import { PAGE } from '@/core/config/public-page.config';
import { notify } from '@/core/lib/notify';
import { RootState } from '@/core/redux-toolkit/store';
import { Link } from '@/shared/ui/LoadingLink';
import { uuidv4 } from '@/shared/utils/numberUtils';

export interface ChangeSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeSeedModal = ({ isOpen, onClose }: ChangeSeedModalProps) => {
  const t = useTranslations();
  const connector = useSelector((state: RootState) => state.game.connectorInstance);
  const [isLoadingConnector, setIsLoadingConnector] = useState<boolean>(false);

  const [activeGameNames, setActiveGameNames] = useState<string[] | null>(null);

  const reloadSeeds = async () => {
    try {
      setActiveGameNames(null);
      if (!connector) {
        return;
      }
      // Only fetch current RNG state to list unfinished games; do NOT update seed here.
      const activeRngSeeds = await connector.activeRngSeeds();
      if (activeRngSeeds?.unfinishedGames && activeRngSeeds.unfinishedGames.length > 0) {
        const gameNames = activeRngSeeds.unfinishedGames.map((game: any) => game.game_name || game);
        setActiveGameNames(gameNames);
      } else {
        setActiveGameNames(null);
      }
    } catch {
      // Swallow errors here; modal can still be used for explicit confirm flow
      setActiveGameNames(null);
    }
  };

  const handleRefreshSeeds = async () => {
    try {
      setIsLoadingConnector(true);
      if (!connector) {
        throw new Error('Connector is not ready');
      }
      await connector.updateClientSeed(`${uuidv4().slice(0, 8)}`);
      onClose();
    } catch (error: any) {
      // Handle unfinished games error
      if (error?.unfinishedGames && error.unfinishedGames.length > 0) {
        const gameNames = error.unfinishedGames.map((game: any) => game.game_name || game);
        setActiveGameNames(gameNames);
        notify('error', 'errors.error_changing_seed', 'errors.error_changing_seed_description');
        return;
      }
    } finally {
      setIsLoadingConnector(false);
    }
  };

  useEffect(() => {
    reloadSeeds();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="sm"
      variant="default"
      header={t('change_seed.title')}
      headerClassName="uppercase font-byrd text-base font-semibold"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        <p className="text-white/70 text-sm mb-2">{t('change_seed.description')}</p>
        {activeGameNames && activeGameNames.length > 0 && (
          <p className="text-white/70 text-sm mb-4 flex flex-wrap gap-2">
            You must finish your active bets in{' '}
            {activeGameNames?.map((gameName: string) => (
              <span key={gameName} className="mx-0.5">
                <Link
                  href={PAGE.CASINO_GAME(gameName.toLowerCase()?.replaceAll(' ', '-')?.replaceAll("'", ''))}
                  className="text-white underline hover:text-gray-300"
                >
                  {gameName}
                </Link>
              </span>
            ))}
            to change your seed.
          </p>
        )}

        <div className="p-0 h-full flex gap-2">
          <Button
            appearance="solid"
            intent="gray"
            className="w-full"
            onClick={() => {
              onClose();
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            isLoading={isLoadingConnector}
            appearance="glossy"
            intent="primary"
            className="w-full"
            onClick={handleRefreshSeeds}
          >
            {t('confirm')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ChangeSeedModal;
