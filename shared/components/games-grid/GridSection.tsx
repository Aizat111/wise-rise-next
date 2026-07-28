'use client';

import type { FC } from 'react';

import GameCard from '../card/GameCard';
import GameCardSkeleton from '../card/GameCardSkeleton';

import type { IGame } from '@/core/types/games.type';

type GridSectionProps = {
  games: IGame[];
  loading: boolean;
  title?: string;
  path?: string;
  isFavourite?: boolean;
};

const GridSection: FC<GridSectionProps> = ({ games, loading, isFavourite = false }) => {
  return (
    <div className="mt-0 flex flex-col gap-6 @container">
      {loading ? (
        <div className="game-grid [--grid-per-view:3] @[600px]:[--grid-per-view:4] @[800px]:[--grid-per-view:5] @[900px]:[--grid-per-view:6] @[1000px]:[--grid-per-view:7]">
          {Array.from({ length: 20 }).map((_, idx) => (
            <GameCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="game-grid [--grid-per-view:3] @[600px]:[--grid-per-view:4] @[800px]:[--grid-per-view:5] @[900px]:[--grid-per-view:6] @[1000px]:[--grid-per-view:7]">
          {games.map((game: IGame, index: number) => (
            <GameCard
              key={`${game.id}-${index}`}
              id={game.id}
              title={game.name}
              image={game.image}
              provider={game?.provider}
              slug={game?.slug}
              isFavourite={isFavourite}
              pathname={game?.pathname}
            />
          ))}
        </div>
      )}
      {games.length === 0 && <div className="text-center text-white text-sm ">No games found</div>}
    </div>
  );
};

export default GridSection;
