import { Button } from '@investorcentretb/toshi-ui';
import { Expand, FullscreenIcon, Minimize, SquareArrowOutUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { type FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Card from '../card/Card';

import { cn } from '@/core/lib/utils';
import { openMiniGameModal } from '@/core/redux-toolkit/slices/miniGameModalSlice';
import { toggleLiveStats } from '@/core/redux-toolkit/slices/modalSlice';
import { setTheaterMode } from '@/core/redux-toolkit/slices/uiSlice';
import { RootState } from '@/core/redux-toolkit/store';
import Toshibet from '@/shared/assets/branding/Toshibet';
import Livestats from '@/shared/assets/games/Livestats';
import { useModalManager } from '@/shared/hooks/useModal';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { Badge } from '@/shared/ui/Badge';
import SwitchInput from '@/shared/ui/inputs/SwitchInput';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';
import { getGamelinkName } from '@/shared/utils/gamesUtils';

// Hardcoded edge values for games that don't provide edge data
const HARDCODED_EDGES: Record<string, number> = {
  mines: 1,
  dice: 1,
  keno: 1,
  blackjack: 0.57,
  limbo: 1,
  'dojo-dash': 1,
  'deport-dash': 1,
  'toshi-towers': 2,
  plinko: 1,
  hilo: 1,
  'video-poker': 1,
  wheel: 1,
  roulette: 2.7,
  baccarat: 1
};

/**
 * Get the edge value for a game, using hardcoded values if edge is not provided
 */
const getGameEdge = (edge: number, game: string, pathname: string): number => {
  // If edge is provided, use it
  if (edge) {
    return edge;
  }

  // Extract game name from pathname or use game prop
  const gameName = pathname?.split('/').pop()?.toLowerCase() || game?.toLowerCase() || '';

  // Check if we have a hardcoded edge for this game
  for (const [key, value] of Object.entries(HARDCODED_EDGES)) {
    if (gameName.includes(key) || game?.toLowerCase().includes(key)) {
      return value;
    }
  }

  return 0;
};

/**
 * Format edge value to show decimals only if they exist
 */
const formatEdge = (value: number): string => {
  // Check if the value is a whole number
  if (value % 1 === 0) {
    return value.toString();
  }
  // Otherwise, show up to 2 decimal places
  return value.toFixed(2);
};

type GameFooterProps = {
  game: string;
  image: string;
  pathname: string;
  edge: number;
  fullscreen: () => void;
  setFilter: (_filter: Record<string, string | boolean>) => void;
  filter: Record<string, string | boolean>;
  isNew: boolean;
  showFullscreenButton?: boolean;
  isProvablyFair?: boolean;
  isModal?: boolean;
  isHomeGame?: boolean;
  game_type?: string;
};

const GameFooter: FC<GameFooterProps> = props => {
  const {
    game,
    image,
    pathname,
    edge,
    fullscreen,
    isNew,
    showFullscreenButton = false,
    isProvablyFair = false,
    isModal = false,
    isHomeGame = false,
    filter,
    setFilter,
    game_type
  } = props;
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const close = false;

  // console.log('GameFooter props:', props);

  const theaterMode = useSelector((state: RootState) => state.ui.theaterMode);
  const alwaysUseTheaterMode = useSelector((state: RootState) => state.ui.alwaysUseTheaterMode);
  const { gameReady } = useSelector((state: RootState) => state.game);

  const t = useTranslations();

  const { openModal: openModalAction } = useModalManager();
  const router = useRouter();
  const openMiniGame = (game: string) => {
    dispatch(openMiniGameModal({ type: getGamelinkName(game), image }));
    router.back();
  };

  const toggleTheaterMode = () => {
    dispatch(setTheaterMode(!theaterMode));
  };

  const openLiveStats = () => {
    dispatch(toggleLiveStats());
  };

  useEffect(() => {
    if (alwaysUseTheaterMode) {
      dispatch(setTheaterMode(true));
    }
    return () => {
      dispatch(setTheaterMode(false));
    };
  }, [alwaysUseTheaterMode]);

  // useEffect(() => {
  //   if (favorites?.data) {
  //     setIsFavorite(
  //       favorites?.data?.find((favorite: IFavoriteGame) => favorite.pathname === pathname?.split('/').pop())
  //         ? true
  //         : false
  //     );
  //   }
  // }, [favorites?.data]);

  const gameEdge = getGameEdge(edge, game, pathname);

  return (
    <Card
      className={cn(
        '@mobg:p-6 p-4 rounded-lg max-h-fit',
        isModal && 'pt-2 pb-2',
        isHomeGame && 'max-w-[1200px] mx-auto w-full',
        theaterMode && 'mb-8'
      )}
    >
      <div className="flex items-center justify-between">
        {!isModal && (
          <div className="flex items-center gap-3 @[768px]:min-w-[232px]">
            {gameEdge ? (
              <Button
                intent="gray"
                appearance="3d"
                borderRadius="md"
                size={isModal ? 'xs' : 'md'}
                className={isModal ? 'text-xs' : ''}
              >
                {formatEdge(gameEdge)}% Edge
              </Button>
            ) : null}
            {!isHomeGame &&
            game_type !== 'Evolution Gaming' &&
            game_type !== 'Push Gaming' &&
            game_type !== 'Live88' ? (
              <SwitchInput
                labelPosition="left"
                isTranslated
                labelClassName="text-base text-white"
                label="demo"
                checked={filter?.demo ? true : false}
                value={filter?.demo ? 'true' : 'false'}
                onCheckedChange={value => {
                  setFilter({ ...filter, demo: value as boolean });
                }}
              />
            ) : null}
          </div>
        )}

        <div>
          <Toshibet className="@[768px]:w-40  w-28 opacity-30" />
        </div>

        <div className="flex items-center justify-end gap-3 @[768px]:min-w-[232px]">
          {!isModal && width > 768 && !close && isHomeGame !== true && (
            <CustomTooltip label={t('open_mini_player')} placement="top">
              <Button
                intent="gray"
                appearance="3d"
                iconOnly
                borderRadius="md"
                size={isModal ? 'sm' : 'md'}
                className={isModal ? 'text-xs' : ''}
                icon={<SquareArrowOutUpRight />}
                onClick={() => openMiniGame(game)}
              ></Button>
            </CustomTooltip>
          )}

          {isNew && <Badge variant="toshiWarning">New</Badge>}
          {width > 768 && (
            <CustomTooltip label={t('live_stats')} placement="top">
              <Button
                intent="gray"
                appearance="3d"
                iconOnly
                borderRadius="md"
                size={isModal ? 'sm' : 'md'}
                className={isModal ? 'text-xs' : ''}
                icon={<Livestats className="w-7 h-7" />}
                onClick={openLiveStats}
              ></Button>
            </CustomTooltip>
          )}
          {!isModal && !isHomeGame && (
            <CustomTooltip label={t('theater')} placement="top">
              <Button
                intent="gray"
                appearance="3d"
                iconOnly
                borderRadius="md"
                size={isModal ? 'sm' : 'md'}
                className={isModal ? 'text-xs' : ''}
                icon={theaterMode ? <Minimize /> : <FullscreenIcon />}
                onClick={toggleTheaterMode}
              ></Button>
            </CustomTooltip>
          )}

          {/* {isAuthenticated && (
            <CustomTooltip label={t('favorites')} placement="top">
              <Button
                intent="gray"
                appearance="3d"
                iconOnly
                borderRadius="md"
                size={isModal ? 'sm' : 'md'}
                className={isModal ? 'text-xs' : ''}
                icon={
                  addToFavorites.isPending ? (
                    <Loader size="sm" />
                  ) : isFavorite ? (
                    <Star style={{ fill: '#e5e7eb', stroke: '#e5e7eb' }} />
                  ) : (
                    <Star />
                  )
                }
                disabled={addToFavorites.isPending}
                onClick={() =>
                  addToFavorites
                    .mutateAsync({
                      image: image,
                      name: capitalizeGameName(game),
                      pathname: pathname?.split('/').pop() || ''
                    })
                    .then(response => {
                      if ((response as any).status) {
                        setIsFavorite(!isFavorite);
                      }
                    })
                }
              ></Button>
            </CustomTooltip>
          )} */}

          {showFullscreenButton && (
            <CustomTooltip label={t('fullscreen')} placement="top">
              <Button
                intent="gray"
                appearance="3d"
                iconOnly
                borderRadius="md"
                size={isModal ? 'sm' : 'md'}
                className={isModal ? 'text-xs' : ''}
                icon={<Expand />}
                onClick={fullscreen}
              ></Button>
            </CustomTooltip>
          )}
          {isProvablyFair && gameReady && (
            <CustomTooltip label={t('provably_fair')} placement="top">
              <Button
                intent="gray"
                appearance="3d"
                borderRadius="md"
                size={isModal ? 'sm' : 'md'}
                className={isModal ? 'text-xs' : ''}
                onClick={() => openModalAction('fairness', 'seeds')}
              >
                {t('fairness')}
              </Button>
            </CustomTooltip>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GameFooter;
