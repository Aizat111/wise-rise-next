'use client';

import { type FC, useEffect, useRef, useState } from 'react';

import SectionHeader from '../../../screens/home/SectionHeader';
import GameCard from '../card/GameCard';
import GameCardSkeleton from '../card/GameCardSkeleton';
import SportCard from '../card/SportCard';

import HorizontalCarousel from './HorizontalCarousel';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import type { IGame } from '@/core/types/games.type';
import { useHybridGames } from '@/shared/hooks/useHybridGames';
import { useWindowSize } from '@/shared/hooks/useWindowSize';

interface HorizontalCarouselProps {
  title: string;
  path?: string;
  isSports?: boolean;
  variables?: {
    limit?: number;
    offset?: number;
    slug?: string;
    categorySlug?: string;
    enabledOnly?: boolean;
  };
  isFavourites?: boolean;
  fetcher?: GRAPHQL_TYPES;
}

const NewHorizontalGamesCarousel: FC<HorizontalCarouselProps> = ({
  title,
  path,
  variables = { limit: 20, offset: 0, slug: 'new-releases' },
  isSports = false
}) => {
  const { width } = useWindowSize();
  const [isVisible, setIsVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const routeSlug = variables.slug ?? 'new-releases';
  const limit = variables.limit ?? 20;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          io.unobserve(entries[0].target);
        }
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { pageGames, isFetching } = useHybridGames({
    routeSlug,
    graphqlLimit: limit,
    graphqlOffset: variables.offset ?? 0,
    legacyPage: 1,
    legacyPerPage: limit,
    isMobile: width < 768,
    isSports,
    enabled: isVisible
  });

  const gameList = pageGames ?? [];

  return (
    <div ref={rootRef} className="mt-0 mb-5">
      {title && <SectionHeader title={title} path={path} sectionId={title} />}
      {!isVisible ? (
        <div style={{ height: width < 768 ? 220 : 420 }} />
      ) : (
        <HorizontalCarousel showScrollButtons={false} sectionId={title}>
          {isFetching
            ? Array.from({ length: width < 768 ? 6 : 20 }).map((_, idx) => <GameCardSkeleton key={idx} />)
            : gameList.map((g: IGame) =>
                isSports ? (
                  <SportCard key={g.id} id={g.id} title={g.name || g.title || ''} image={g.image} href={g.launchUrl} />
                ) : (
                  <GameCard
                    key={g.id}
                    id={g.id}
                    title={g.name || g.title || ''}
                    image={g.image}
                    demoImage={
                      g.image
                        ? g.image
                        : 'https://static.toshi.bet/games/house/keno-toshi-bet.jpg?fit=max&w=250&sat=15&auto=format&q=100'
                    }
                    provider={typeof g.provider === 'string' ? g.provider : g.provider?.displayName || g.provider?.name}
                    slug={g.slug}
                    href={g.launchUrl}
                    entryKind={g.entryKind}
                  />
                )
              )}
        </HorizontalCarousel>
      )}
    </div>
  );
};

export default NewHorizontalGamesCarousel;
