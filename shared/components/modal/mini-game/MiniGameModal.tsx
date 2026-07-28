import { FC, Suspense, lazy } from 'react';

import GameFooter from '../../game/GameFooter';
import LoginRequired from '../../game/LoginRequired';

import { useAppSelector } from '@/core/redux-toolkit/hooks';

const KenoSection = lazy(() => import('../../../../screens/games/keno/KenoSection'));
const MinesSection = lazy(() => import('../../../../screens/games/mines/MinesSection'));
const DiceSection = lazy(() => import('../../../../screens/games/dice/Dice'));
const LimboSection = lazy(() => import('../../../../screens/games/limbo/Limbo'));
const ToshiTowersSection = lazy(() => import('../../../../screens/games/toshi-towers/ToshiTowers'));
const PlinkoSection = lazy(() => import('../../../../screens/games/plinko/PlinkoSection'));
const DojoDodgeSection = lazy(() => import('../../../../screens/games/dojo-dodge/DojoDodgeSection'));
const DojoDodgeSectionV2 = lazy(() => import('@/components/partials/games/deport-dodge/DojoDodgeSectionV2'));
const OtherGameSection = lazy(() => import('@/app/[locale]/casino/game/[slug]/GamePage'));
const NewGamePage = lazy(() => import('@/app/[locale]/casino/game/[slug]/NewGamePage'));
const BlackjackSection = lazy(() => import('../../../../screens/games/blackjack/BlackjackSection'));
const RouletteSection = lazy(() => import('../../../../screens/games/roulette/RouletteSection'));

export type GameType =
  | 'keno'
  | 'mines'
  | 'dice'
  | 'limbo'
  | 'toshi-towers'
  | 'plinko'
  | 'dojo-dodge'
  | 'deport-dash'
  | 'blackjack'
  | 'roulette';

interface MiniGameModalProps {
  type: string; // Accept string to handle game titles from GameCard
  isViewVertical?: boolean;
  image: string;
  gameSlug?: string;
}

// Game title to type mapping
const gameTitleToType: Record<string, GameType> = {
  Keno: 'keno',
  Mines: 'mines',
  Dice: 'dice',
  Limbo: 'limbo',
  'Toshi Towers': 'toshi-towers',
  Plinko: 'plinko',
  'Dojo Dash': 'dojo-dodge',
  'Deport Dash': 'deport-dash',
  Blackjack: 'blackjack',
  Roulette: 'roulette'
} as const;

// Game component mapping
const gameComponents = {
  keno: KenoSection,
  mines: MinesSection,
  dice: DiceSection,
  limbo: LimboSection,
  'toshi-towers': ToshiTowersSection,
  plinko: PlinkoSection,
  'dojo-dash': DojoDodgeSection,
  'deport-dash': DojoDodgeSectionV2,
  blackjack: BlackjackSection,
  roulette: RouletteSection
} as const;

const HOUSE_GAME_SLUGS = new Set(Object.keys(gameComponents));

// Loading component for lazy loading
const GameLoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-toshi-primary border-t-transparent" />
  </div>
);

const MiniGameModal: FC<MiniGameModalProps> = ({ type, image, gameSlug, isViewVertical }) => {
  const { isAuthenticated } = useAppSelector(state => state.user);
  const gameType = gameTitleToType[type] || type?.toLowerCase()?.replace(/\s+/g, '-');
  const resolvedGameSlug = gameSlug || (type.includes('-') ? type : undefined);
  const isGraphqlGame = Boolean(resolvedGameSlug && !HOUSE_GAME_SLUGS.has(resolvedGameSlug));

  if (isGraphqlGame && resolvedGameSlug) {
    return (
      <Suspense fallback={<GameLoadingSpinner />}>
        <div className="h-full w-full min-h-[260px] overflow-y-scroll max-h-[90vh] no-scrollbar">
          <NewGamePage gameSlug={resolvedGameSlug} initialInitData={null} isModal />
        </div>
      </Suspense>
    );
  }

  const GameComponent =
    (gameComponents[gameType as keyof typeof gameComponents] as FC<{
      gameName: string;
      isModal?: boolean;
      isViewVertical?: boolean;
    }>) || OtherGameSection;

  return (
    <Suspense fallback={<GameLoadingSpinner />}>
      <div className="h-full w-full overflow-y-scroll max-h-[90vh] no-scrollbar">
        {!isAuthenticated && gameType === 'plinko' ? (
          <LoginRequired bgImage={'/assets/images/laonad.webp'} />
        ) : (
          <GameComponent
            gameName={gameType?.toLowerCase()?.replaceAll('-', ' ') || ''}
            isModal={true}
            isViewVertical={isViewVertical}
          />
        )}
        {gameTitleToType[type as keyof typeof gameTitleToType] && (
          <GameFooter
            game={gameType || ''}
            image={image}
            pathname={`/casino/game/${gameType}`}
            edge={10}
            fullscreen={() => {}}
            setFilter={() => {}}
            filter={{}}
            isNew={false}
            isProvablyFair={true}
            isModal={true}
          />
        )}
      </div>
    </Suspense>
  );
};

export default MiniGameModal;
