import { Button } from '@investorcentretb/toshi-ui';
import { CopyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { PAGE } from '@/core/config/public-page.config';
import { GAME_DESCRIPTIONS } from '@/core/constants/game.constants';
import { notify } from '@/core/lib/notify';
import { RootState } from '@/core/redux-toolkit/store';
import Card from '@/shared/components/card/Card';
import useClipboard from '@/shared/hooks/useClipboard';
import { Link } from '@/shared/ui/LoadingLink';
import ShowTextInput from '@/shared/ui/inputs/ShowTextInput';
import { uuidv4 } from '@/shared/utils/numberUtils';

type SeedsProps = {
  seeds: any;
  newClientSeed: string;
  activeGameError: string[] | null;
  userId?: string | null;
  setSeeds: (_seeds: any) => void;
  setNewClientSeed: (_newClientSeed: string) => void;
  setActiveGameError: (_activeGameError: string[] | null) => void;
  isLoading?: boolean;
};

const Seeds = ({
  seeds,
  newClientSeed,
  activeGameError,
  setSeeds,
  setNewClientSeed,
  setActiveGameError,
  isLoading = false
}: SeedsProps) => {
  const t = useTranslations();
  const { copy } = useClipboard();
  const [isLoadingConnector, setIsLoadingConnector] = useState<boolean>(false);
  const connector = useSelector((state: RootState) => state.game.connectorInstance);

  const handleRefreshSeeds = async () => {
    try {
      setIsLoadingConnector(true);
      if (!connector) {
        throw new Error('Connector is not ready');
      }
      const rngSeeds = await connector.updateClientSeed(newClientSeed);
      if (rngSeeds) {
        // Map connector response to seeds structure
        const mappedSeeds = {
          client_seed: rngSeeds.clientSeed,
          hashed_server_seed: rngSeeds.serverSeedHash,
          next_server_seed: rngSeeds.nextServerSeedHash,
          nonce: rngSeeds.nonce?.toString() || '0',
          unfinishedGames: rngSeeds.unfinishedGames || []
        };
        setSeeds(mappedSeeds);
        setNewClientSeed(`${uuidv4().slice(0, 8)}`);

        // Update activeGameError if there are unfinished games
        if (rngSeeds.unfinishedGames && rngSeeds.unfinishedGames.length > 0) {
          const gameNames = rngSeeds.unfinishedGames.map((game: any) => game.game_name || game);
          setActiveGameError(gameNames);
        } else {
          setActiveGameError(null);
        }
      }
    } catch (error: any) {
      // Handle unfinished games error
      if (error?.unfinishedGames && error.unfinishedGames.length > 0) {
        const gameNames = error.unfinishedGames.map((game: any) => game.game_name || game);
        setActiveGameError(gameNames);
        notify('error', 'errors.error_changing_seed', 'errors.error_changing_seed_description');
        return;
      }
    } finally {
      setIsLoadingConnector(false);
    }
  };

  return (
    <Card className="flex flex-col bg-bg_menu gap-4 p-4 h-full no-scrollbar relative">
      {isLoading && <div className="absolute top-2 right-2 text-white70 text-xs">Loading...</div>}
      <ShowTextInput
        label="active_client_seed"
        isTranslated
        value={seeds?.client_seed}
        singleLine
        singleLineWrapped
        background="outline"
        rightIcon={<CopyIcon className="size-4 cursor-pointer" onClick={() => copy(seeds?.client_seed)} />}
      />
      <ShowTextInput
        label="active_server_seed_hashed"
        isTranslated
        background="outline"
        inputClassName="py-2"
        value={seeds?.hashed_server_seed}
        singleLine
        singleLineWrapped
        rightIcon={<CopyIcon className="size-4 cursor-pointer" onClick={() => copy(seeds?.hashed_server_seed)} />}
      />

      <ShowTextInput
        label="next_nonce"
        isTranslated
        background="outline"
        value={seeds?.nonce}
        singleLine
        singleLineWrapped
        rightIcon={<CopyIcon className="size-4 cursor-pointer" onClick={() => copy(seeds?.nonce)} />}
      />

      <hr className="border-white10" />
      <h3 className="text-md font-bold mb-0">{t('rotate_seed_pair')}</h3>

      <ShowTextInput
        label="new_client_seed"
        isTranslated
        background="outline"
        size="lg"
        value={newClientSeed}
        singleLine
        singleLineWrapped
        inputClassName="py-0"
      />
      <ShowTextInput
        label="next_server_seed_hashed"
        isTranslated
        background="outline"
        inputClassName="py-2"
        size="lg"
        value={seeds?.next_server_seed}
        singleLine
        singleLineWrapped
        rightIcon={<CopyIcon className="size-4 cursor-pointer" onClick={() => copy(seeds?.next_server_seed)} />}
      />
      <div className="w-full">
        <Button
          type="submit"
          appearance="glossy"
          disabled={(activeGameError && activeGameError.length > 0) || isLoadingConnector ? true : false}
          intent="primary"
          onClick={handleRefreshSeeds}
          className="w-full"
        >
          {t('change')}
        </Button>
      </div>

      {activeGameError && (
        <p className="text-white/70 text-sm mb-4">
          You must finish your active bets in{' '}
          {activeGameError?.map((gameName, index) => (
            <span key={gameName} className="mx-0.5">
              <Link
                href={
                  GAME_DESCRIPTIONS[
                    gameName.toLowerCase()?.replaceAll(' ', '-')?.replaceAll("'", '') as keyof typeof GAME_DESCRIPTIONS
                  ]?.link || PAGE.CASINO_GAME(gameName.toLowerCase()?.replaceAll(' ', '-')?.replaceAll("'", ''))
                }
                className="text-white underline hover:text-gray-300"
              >
                {GAME_DESCRIPTIONS[gameName.toLowerCase() as keyof typeof GAME_DESCRIPTIONS]?.name || gameName}
              </Link>
              {index < activeGameError.length - 1 && <span>, </span>}
            </span>
          ))}
          to change your seed.
        </p>
      )}
    </Card>
  );
};

export default Seeds;
