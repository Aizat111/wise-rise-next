'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Modal } from '../Modal';

import Seeds from './partials/Seeds';
import Verify from './partials/Verify';
import { RootState } from '@/core/redux-toolkit/store';
import { Loader } from '@/shared/ui/loaders/Loader';
import { Switch } from '@/shared/ui/switch';
import { uuidv4 } from '@/shared/utils/numberUtils';

interface FairnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props?: {
    prefillServerSeed?: string;
    prefillClientSeed?: string;
    prefillNonce?: string;
    prefillGame?: string;
  };
}

const FairnessModal = ({ isOpen, onClose, type = 'seeds', props }: FairnessModalProps) => {
  const t = useTranslations();
  const { user } = useSelector((state: RootState) => state.user);
  const connector = useSelector((state: RootState) => state.game.connectorInstance);
  const changeSeedModal = useSelector((state: RootState) => state.modals.modals.changeSeed);
  const [selectedValue, setSelectedValue] = useState<'seeds' | 'verify'>(type as 'seeds' | 'verify');

  const [seeds, setSeeds] = useState<any>(null);
  const [previousHashedServerSeed, setPreviousHashedServerSeed] = useState<string>('');
  const [previousClientSeed, setPreviousClientSeed] = useState<string>('');
  const [prevChangeSeedModalOpen, setPrevChangeSeedModalOpen] = useState<boolean>(false);

  const [newClientSeed, setNewClientSeed] = useState<string>('');
  const [activeGameError, setActiveGameError] = useState<string[] | null>(null);
  const [isLoadingConnector, setIsLoadingConnector] = useState<boolean>(false);

  const reloadSeeds = async () => {
    setIsLoadingConnector(true);
    try {
      if (!connector) {
        throw new Error('Connector is not ready');
      }
      const activeRngSeeds = await connector.activeRngSeeds();
      if (activeRngSeeds) {
        // Map connector response to seeds structure
        const mappedSeeds = {
          client_seed: activeRngSeeds.clientSeed,
          hashed_server_seed: activeRngSeeds.serverSeedHash,
          next_server_seed: activeRngSeeds.nextServerSeedHash,
          nonce: activeRngSeeds.nonce?.toString() || '0',
          unfinishedGames: activeRngSeeds.unfinishedGames || []
        };
        handleSeedsUpdate(mappedSeeds);

        // Update activeGameError if there are unfinished games
        if (activeRngSeeds.unfinishedGames && activeRngSeeds.unfinishedGames.length > 0) {
          const gameNames = activeRngSeeds.unfinishedGames.map((game: any) => game.game_name || game);
          setActiveGameError(gameNames);
        } else {
          setActiveGameError(null);
        }
      }
    } catch {
      // Fallback to API if connector fails
      console.error('Error getting active seeds from connector');
    } finally {
      setIsLoadingConnector(false);
    }
  };

  const getNonceForVerification = () => {
    if (seeds?.nonce) {
      const nonceNum = parseInt(seeds?.nonce);
      return nonceNum > 0 ? (nonceNum - 1).toString() : '0';
    }
    return '0';
  };

  const handleSeedsUpdate = (newSeeds: any) => {
    if (seeds && seeds.hashed_server_seed && newSeeds && seeds.hashed_server_seed !== newSeeds.hashed_server_seed) {
      setPreviousHashedServerSeed(seeds.hashed_server_seed);
      setPreviousClientSeed(seeds.client_seed);
    }
    setSeeds(newSeeds);
  };

  useEffect(() => {
    setNewClientSeed(`${uuidv4().slice(0, 8)}`);
  }, []);

  useEffect(() => {
    if (selectedValue === 'seeds') {
      reloadSeeds();
    }
  }, [selectedValue]);

  useEffect(() => {
    const modalState = Array.isArray(changeSeedModal) ? changeSeedModal[0] : changeSeedModal;
    const currentlyOpen = modalState?.isOpen || false;

    if (prevChangeSeedModalOpen && !currentlyOpen && isOpen) {
      reloadSeeds();
    }
    setPrevChangeSeedModalOpen(currentlyOpen);
  }, [changeSeedModal]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="lg"
      showOverlay
      header={t('provably_fair')}
      headerClassName="uppercase font-byrd text-base font-semibold"
      modalClassName=""
      closeOnOverlayClick={true}
      contentClassName="h-full no-scrollbar py-4 px-4"
    >
      {isLoadingConnector ? (
        <div className="flex justify-center items-center h-full">
          <Loader variant="spinner" size="sm" />
        </div>
      ) : (
        <div className="flex flex-col h-full max-h-[700px]">
          <div className="lg:w-1/2 mb-4 flex flex-col justify-between">
            <Switch
              items={[
                { id: 'seeds', label: 'seeds', value: 'seeds' },
                { id: 'verify', label: 'verify', value: 'verify' }
              ]}
              value={selectedValue}
              className="bg-toshi_body border border-gray-500 "
              size="md"
              onChange={value => setSelectedValue(value as 'seeds' | 'verify')}
            />
          </div>

          {selectedValue === 'seeds' && (
            <Seeds
              seeds={seeds}
              newClientSeed={newClientSeed}
              activeGameError={activeGameError}
              userId={user?.id?.toString() || null}
              setSeeds={handleSeedsUpdate}
              setNewClientSeed={setNewClientSeed}
              setActiveGameError={setActiveGameError}
              isLoading={isLoadingConnector}
            />
          )}
          {selectedValue === 'verify' && (
            <Verify
              key={`calc-${props?.prefillGame || seeds?.game}-${props?.prefillServerSeed || seeds?.server_seed}-${props?.prefillClientSeed || seeds?.client_seed}-${props?.prefillNonce || seeds?.nonce}`}
              prefillGame={props?.prefillGame}
              prefillServerSeed={props?.prefillServerSeed}
              prefillServerSeedHashed={previousHashedServerSeed || seeds?.hashed_server_seed}
              prefillClientSeed={props?.prefillClientSeed || previousClientSeed || seeds?.client_seed}
              prefillNonce={props?.prefillNonce || getNonceForVerification()}
              currentHashedServerSeed={seeds?.hashed_server_seed}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default FairnessModal;
