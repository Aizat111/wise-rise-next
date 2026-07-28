import { Button } from '@investorcentretb/toshi-ui';
import { CopyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Baccarat from './games/Baccarat';
import Hilo from './games/Hilo';
import RouletteTable from './games/RouletteTable';
import Tower from './games/Tower';
import VideoPoker from './games/VideoPoker';
import Wheel from './games/Wheel';
import Blackjack from './games/blackjack';
import Dice from './games/dice';
import DojoDodge from './games/dojododge';
import Keno from './games/keno';
import Limbo from './games/limbo';
import Mines from './games/mines';
import Plinko from './games/plinko';
import { GAME_DESCRIPTIONS, PLINKO_ROWS } from '@/core/constants/game.constants';
import { DragonsTowerDifficulty } from '@/core/constants/games/dragonsTower.constants';
import { BET_INITIAL_STATE } from '@/core/constants/games/roulette.constants';
import { WHEEL_RISKS, WHEEL_SECTIONS } from '@/core/constants/games/wheel.constants';
// import { calculateHMAC, generateRandomFloats } from '@/shared/utils/gamesUtils';

import { notify } from '@/core/lib/notify';
import { RootState } from '@/core/redux-toolkit/store';
import { WheelRisk } from '@/core/types/wheel.types';
import Card from '@/shared/components/card/Card';
import useClipboard from '@/shared/hooks/useClipboard';
import { useModalManager } from '@/shared/hooks/useModal';
import Input from '@/shared/ui/inputs/Input';
import Select from '@/shared/ui/selects/Select';

type VerifyProps = {
  current_game?: string | null;
  prefillServerSeed?: string;
  prefillClientSeed?: string;
  prefillNonce?: string;
  prefillGame?: string;
  prefillServerSeedHashed?: string;
  currentHashedServerSeed?: string;
};

const Verify = ({
  prefillGame,
  prefillClientSeed,
  prefillServerSeed,
  prefillNonce,
  prefillServerSeedHashed,
  currentHashedServerSeed
}: VerifyProps) => {
  const { game } = useSelector((state: RootState) => state.game);
  const t = useTranslations();
  const { copy } = useClipboard();
  const { openModal } = useModalManager();

  const [selectedGame, setSelectedGame] = useState<string>(game?.name || '');
  const [isLoadingConnector, setIsLoadingConnector] = useState<boolean>(false);
  const connector = useSelector((state: RootState) => state.game.connectorInstance);
  const [hmacResult, setHmacResult] = useState<any>(null);
  const games = Object.values(GAME_DESCRIPTIONS);

  const [clientSeed, setClientSeed] = useState<string>('');
  const [serverSeed, setServerSeed] = useState<string>('');
  const [nonce, setNonce] = useState<string>('0');
  const [floatResult, setFloatResult] = useState<any>(null);
  const [mines, setMines] = useState<number>(1);
  const [risk, setRisk] = useState<string>('easy');
  const [rowsCount, setRowsCount] = useState<number>(8);
  const [plinkoRisk, setPlinkoRisk] = useState<string>('low');
  const [dojododgeRisk, setDojododgeRisk] = useState<string>('medium');
  const [serverHash, setServerHash] = useState<string>('');
  const [info, setInfo] = useState<any>(null);
  const [solvedServerSeed, setSolvedServerSeed] = useState<string>('');
  const [isSeedActive, setIsSeedActive] = useState(false);
  const [numberOfSections, setNumberOfSections] = useState<number>(10);
  const [wheelRisk, setWheelRisk] = useState<string>('low');

  const handleSolveServerHash = async () => {
    if (isSeedActive) {
      notify('warning', 'errors.cannot_unhash_active_seed', 'errors.cannot_unhash_active_seed_description');
      return;
    }
    setIsLoadingConnector(true);
    try {
      if (!connector) {
        throw new Error('Connector is not ready');
      }
      const serverSeedResponse = await connector.unhashServerSeed(serverHash);
      if (serverSeedResponse) {
        setSolvedServerSeed(serverSeedResponse);
      }
    } catch {
      notify('error', 'errors.error_getting_server_seed', 'errors.error_getting_server_seed_description');
      openModal('changeSeed', 'changeSeed');
      return;
    } finally {
      setIsLoadingConnector(false);
    }
  };

  // Helper to get game config from localStorage
  const getGameConfig = () => {
    try {
      const config = localStorage.getItem('toshi_game_config');
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error('Error reading gameConfig from localStorage:', error);
      return null;
    }
  };

  const proveFairness = async (input: { serverSeed: string; clientSeed: string; nonce: string }, params?: any) => {
    const info = await connector.info();
    setInfo(info);
    const fairnessProof = await connector.proveFairness(input, params);
    // console.log('fairnessProof', fairnessProof);
    // const hashes = fairnessProof?.hashes;
    setHmacResult(fairnessProof);
    setFloatResult(fairnessProof);
    return fairnessProof;
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const info = await connector.info();
      if (info) {
        setInfo(info);
      } else {
        notify('error', 'Error getting info', 'Error getting info');
      }
    };
    fetchInfo();
  }, []);

  // Pre-fill values when component mounts
  useEffect(() => {
    if (prefillGame) {
      setSelectedGame(prefillGame);
    }
    if (prefillClientSeed) {
      setClientSeed(prefillClientSeed);
    }
    if (prefillServerSeed) {
      setServerSeed(prefillServerSeed);
      setSolvedServerSeed(prefillServerSeed);
    }
    if (prefillServerSeedHashed) {
      setServerHash(prefillServerSeedHashed);
    }
    if (prefillNonce) {
      setNonce(prefillNonce);
    }
  }, [prefillGame, prefillClientSeed, prefillServerSeed, prefillNonce, prefillServerSeedHashed]);

  // Load game config from localStorage and pre-fill values
  useEffect(() => {
    const gameConfig = getGameConfig();

    if (selectedGame === 'Toshi Towers') {
      if (gameConfig) {
        if (gameConfig.towers) {
          setRisk(gameConfig.towers.towerRisk || 'easy');
        } else {
          setRisk('easy');
        }
      } else {
        setRisk('easy');
      }
    }

    if (selectedGame === 'Plinko') {
      if (gameConfig) {
        if (gameConfig.plinko) {
          setRowsCount(gameConfig.plinko.rows || 8);
          setPlinkoRisk(gameConfig.plinko.risk || 'Low');
        } else {
          setRowsCount(8);
          setPlinkoRisk('Low');
        }
      } else {
        setRowsCount(8);
        setPlinkoRisk('Low');
      }
    }

    if (selectedGame === 'Dojo Dash') {
      if (gameConfig) {
        if (gameConfig.dojoDash) {
          setDojododgeRisk(gameConfig.dojoDash.risk || 'low');
        } else {
          setDojododgeRisk('low');
        }
      } else {
        setDojododgeRisk('low');
      }
    }
  }, [solvedServerSeed, mines]);

  useEffect(() => {
    if (solvedServerSeed) {
      setServerSeed(solvedServerSeed);
    }
  }, [solvedServerSeed]);

  // Check if the current serverHash is the active one
  useEffect(() => {
    // Compare serverHash input with current active seed from backend
    if (serverHash && currentHashedServerSeed && serverHash === currentHashedServerSeed) {
      setIsSeedActive(true);
    } else {
      setIsSeedActive(false);
    }
  }, [serverHash, currentHashedServerSeed]);

  useEffect(() => {
    if (selectedGame === 'Mines') {
      proveFairness({ serverSeed, clientSeed, nonce }, { numberOfMines: mines });
    }
    if (selectedGame === 'Dice') {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Limbo') {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Keno') {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Blackjack') {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Dojo Dash') {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Toshi Towers') {
      proveFairness({ serverSeed, clientSeed, nonce }, { risk: risk });
    }
    if (selectedGame === 'Plinko') {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Hilo') {
      proveFairness({ serverSeed, clientSeed, nonce });
    }

    if (selectedGame === 'Video Poker' && serverSeed && clientSeed && nonce) {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Wheel' && serverSeed && clientSeed && nonce) {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Roulette' && serverSeed && clientSeed && nonce) {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    if (selectedGame === 'Baccarat' && serverSeed && clientSeed && nonce) {
      proveFairness({ serverSeed, clientSeed, nonce });
    }
    // else {
    //   proveFairness({ serverSeed, clientSeed, nonce }, { rtp: 0.97, maxMultiplier: 10000 });
    // }
  }, [serverSeed, clientSeed, nonce, selectedGame, mines]);

  return (
    <div className="flex flex-col gap-4 no-scrollbar h-full py-4 px-1">
      <Card className="flex flex-col gap-4 min-h-[340px] h-full bg-bg_color no-scrollbar">
        {hmacResult && (
          <div className="gap-4 flex flex-col items-center  no-scrollbar h-fit justify-center p-0 w-full ">
            <div className="text-lg font-bold text-white">{t('proven_result')}:</div>
            <div className="flex flex-col gap-4 w-full">
              {/* {selectedGame === 'Dice' && <Dice modal hmacResult={hmacResult} game={selectedGame} />} */}
              {selectedGame === 'Dice' && <Dice modal hmacResult={hmacResult} />}

              {selectedGame === 'Limbo' && <Limbo modal hmacResult={hmacResult} />}

              {selectedGame === 'Mines' && (
                // <Mines modal hmacResult={hmacResult} game={selectedGame} floatResult={floatResult} mineCount={mines} />
                <Mines modal provablyResult={hmacResult} mineCount={mines} />
              )}
              {selectedGame === 'Toshi Towers' && (
                <Tower
                  modal
                  hmacResult={hmacResult}
                  game={selectedGame}
                  floatResult={floatResult}
                  risk={risk as DragonsTowerDifficulty}
                />
              )}
              {selectedGame === 'Keno' && <Keno modal game="Keno" floatResult={hmacResult} minesCount={10} />}
              {selectedGame === 'Plinko' && (
                <Plinko modal floatResult={floatResult} risk={plinkoRisk as 'low' | 'medium' | 'high'} info={info} />
              )}
              {selectedGame === 'Blackjack' && <Blackjack modal floatResult={hmacResult} />}
              {selectedGame === 'Dojo Dash' && (
                <DojoDodge
                  modal
                  hmacResult={hmacResult}
                  risk={dojododgeRisk as 'low' | 'medium' | 'hard' | 'hardcore'}
                  data={info}
                  connector={connector}
                />
              )}
              {selectedGame === 'Hilo' && <Hilo modal floatResult={hmacResult} />}
              {selectedGame === 'Video Poker' && <VideoPoker modal floatResult={hmacResult} />}
              {selectedGame === 'Wheel' && (
                <Wheel
                  floatResult={hmacResult}
                  risk={wheelRisk as WheelRisk}
                  numberOfSections={numberOfSections}
                  game={selectedGame}
                />
              )}
              {selectedGame === 'Roulette' && (
                <RouletteTable bets={BET_INITIAL_STATE} randomNumber={hmacResult?.randomizations?.[0]?.randomNumber} />
              )}
              {selectedGame === 'Baccarat' && <Baccarat modal floatResult={hmacResult} />}
            </div>
          </div>
        )}
      </Card>
      <Select
        label={t('game')}
        options={games.map((game: any) => ({ label: game.name, value: game.name }))}
        className="w-full"
        disabled
        searchable={false}
        value={selectedGame}
        onChange={value => {
          if (Array.isArray(value)) {
            setSelectedGame(value[0].value);
          } else {
            setSelectedGame(value?.value || '');
          }
        }}
        triggerClassName="w-full bg-bg_content"
      />
      <Input
        label="client_seed"
        isTranslated
        value={clientSeed}
        background="dark"
        rightIcon={<CopyIcon className="size-4 cursor-pointer" onClick={() => copy(clientSeed)} />}
      />
      <Input
        label="hashed_server_seed"
        isTranslated
        background="dark"
        value={serverHash}
        onChange={e => setServerHash(e.target.value)}
        className="pr-[100px]"
        rightIcon={
          <Button
            intent="success"
            onClick={handleSolveServerHash}
            appearance="solid"
            size="sm"
            isLoading={isLoadingConnector}
            borderRadius="md"
            className="cursor-pointer"
          >
            {t('unhash')}
          </Button>
        }
      />
      {isSeedActive && (
        <p className="text-white70 text-sm">
          This seed is currently active, to unhash it you must{' '}
          <span
            aria-hidden="true"
            className="font-bold text-white text-sm cursor-pointer underline"
            onClick={() => openModal('changeSeed', 'changeSeed')}
          >
            change the seed first
          </span>
          .
        </p>
      )}

      <Input
        label="unhashed_server_seed"
        isTranslated
        background="dark"
        value={solvedServerSeed}
        onChange={e => setSolvedServerSeed(e.target.value)}
      />

      <Input
        label="nonce"
        isTranslated
        background="dark"
        size="lg"
        value={nonce}
        onChange={e => setNonce(e.target.value)}
      />

      {selectedGame === 'Mines' && (
        <Select
          label={t('mines.mines_amount')}
          options={Array.from({ length: 24 }, (_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }))}
          className="w-full"
          searchable={false}
          value={mines.toString()}
          onChange={value => {
            if (Array.isArray(value)) {
              setMines(Number(value[0].value));
            } else {
              setMines(Number(value?.value || '1'));
            }
          }}
          triggerClassName="w-full bg-bg_content"
        />
      )}

      {selectedGame === 'Toshi Towers' && (
        <Select
          label={t('risks')}
          searchable={false}
          options={
            [
              { label: t('easy'), value: 'easy' },
              { label: t('medium'), value: 'medium' },
              { label: t('hard'), value: 'hard' },
              { label: t('expert'), value: 'expert' },
              { label: t('master'), value: 'master' }
            ] as { label: string; value: DragonsTowerDifficulty }[]
          }
          className="w-full"
          value={risk.toString()}
          onChange={value => {
            if (Array.isArray(value)) {
              setRisk(value[0].value as DragonsTowerDifficulty);
            } else {
              setRisk((value?.value as DragonsTowerDifficulty) || 'easy');
            }
          }}
          triggerClassName="w-full bg-bg_content"
        />
      )}

      {selectedGame === 'Plinko' && (
        <div className="flex gap-2">
          <Select
            label={t('number_of_rows')}
            options={PLINKO_ROWS}
            searchable={false}
            className="w-full"
            value={rowsCount.toString()}
            onChange={value => {
              if (Array.isArray(value)) {
                setRowsCount(Number(value[0].value));
              } else {
                setRowsCount(Number(value?.value || '8'));
              }
            }}
            triggerClassName="w-full bg-bg_content"
          />

          <Select
            label={t('risks')}
            searchable={false}
            options={[
              { label: t('low'), value: 'low' },
              { label: t('medium'), value: 'medium' },
              { label: t('high'), value: 'high' }
            ]}
            className="w-full"
            value={plinkoRisk.toString()}
            onChange={value => {
              if (Array.isArray(value)) {
                setPlinkoRisk(value[0].value);
              } else {
                setPlinkoRisk(value?.value || 'low');
              }
            }}
            triggerClassName="w-full bg-bg_content"
          />
        </div>
      )}
      {selectedGame === 'Dojo Dash' && (
        <Select
          label={t('risks')}
          searchable={false}
          options={[
            { label: t('easy'), value: 'easy' },
            { label: t('medium'), value: 'medium' },
            { label: t('hard'), value: 'hard' },
            { label: t('expert'), value: 'expert' }
          ]}
          className="w-full"
          value={dojododgeRisk.toString()}
          onChange={value => {
            if (Array.isArray(value)) {
              setDojododgeRisk(value[0].value);
            } else {
              setDojododgeRisk(value?.value || 'easy');
            }
          }}
          triggerClassName="w-full bg-bg_content"
        />
      )}

      {selectedGame === 'Wheel' && (
        <>
          <Select
            options={WHEEL_RISKS.map(risk => ({
              value: risk,
              label: `${risk.charAt(0).toUpperCase()}${risk.slice(1)}`
            }))}
            label={t('risks')}
            placeholder="select_risk"
            triggerClassName="bg-bg_content w-full"
            labelClassName="text-white70 text-sm"
            searchable={false}
            value={wheelRisk.toString()}
            onChange={value => {
              const v = (value as { value?: string } | undefined)?.value;
              if (v) {
                setWheelRisk(v);
              }
            }}
          />
          <Select
            options={WHEEL_SECTIONS.map(section => ({ value: section.toString(), label: section.toString() }))}
            label={t('number_of_sections')}
            placeholder="select_sections"
            triggerClassName="bg-bg_content w-full"
            labelClassName="text-white70 text-sm"
            searchable={false}
            value={numberOfSections.toString()}
            onChange={value => {
              const v = (value as { value?: string } | undefined)?.value;
              if (v) {
                setNumberOfSections(Number(v));
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default Verify;
