'use client';

import type { FC } from 'react';

import GameCard from '../card/GameCard';
import GameCardSkeleton from '../card/GameCardSkeleton';

import type { IGame } from '@/core/types/games.type';
import Geoblock from '@/screens/games/geoblock/Geoblock';

type NewGridSectionProps = {
  games: IGame[];
  loading: boolean;
  title?: string;
  path?: string;
  isFavourite?: boolean;
  geoblockProviderName?: string;
};

const NewGridSection: FC<NewGridSectionProps> = ({ games, loading, isFavourite = false, geoblockProviderName }) => {
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
              title={game.name || game.title || ''}
              image={game.image}
              demoImage={
                game.image
                  ? game.image
                  : 'https://static.toshi.bet/games/house/keno-toshi-bet.jpg?fit=max&w=250&sat=15&auto=format&q=100'
              }
              provider={
                typeof game?.provider === 'string' ? game.provider : game?.provider?.displayName || game?.provider?.name
              }
              slug={game?.slug}
              href={game?.launchUrl}
              entryKind={game?.entryKind}
              isFavourite={isFavourite}
              pathname={game?.slug}
            />
          ))}
        </div>
      )}
      {games.length === 0 &&
        !loading &&
        (geoblockProviderName ? (
          <Geoblock providerName={geoblockProviderName} data={null} />
        ) : (
          <div className="text-center text-white text-sm">No games found</div>
        ))}
    </div>
  );
};

export default NewGridSection;
