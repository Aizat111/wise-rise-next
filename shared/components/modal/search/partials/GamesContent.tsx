'use client';

import GridSection from '@/shared/components/games-grid/GridSection';
import { useHybridGames } from '@/shared/hooks/useHybridGames';

type GamesContentProps = {
  search: string;
};

const GamesContent = ({ search }: GamesContentProps) => {
  const { pageGames, isFetching } = useHybridGames({
    routeSlug: 'search',
    searchTerm: search,
    graphqlLimit: 50,
    graphqlOffset: 0,
    legacyPage: 1,
    legacyPerPage: 50,
    enabled: search.trim().length > 0
  });

  return (
    <div className="min-h-[150px] md:pt-4">
      <GridSection games={pageGames ?? []} loading={isFetching} />
    </div>
  );
};

export default GamesContent;
