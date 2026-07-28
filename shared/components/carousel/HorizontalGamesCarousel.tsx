'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';

import SectionHeader from '../../../screens/home/SectionHeader';
import GameCard from '../card/GameCard';
import GameCardSkeleton from '../card/GameCardSkeleton';
import SportCard from '../card/SportCard';

import HorizontalCarousel from './HorizontalCarousel';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { resolveRouteSlugFromLegacyVariables } from '@/core/constants/game-list.constants';
import type { IGame, IGamesResponse, ISport, ISportResponse } from '@/core/types/games.type';
import { useHybridGames } from '@/shared/hooks/useHybridGames';
import { useWindowSize } from '@/shared/hooks/useWindowSize';

interface HorizontalCarouselProps {
  title: string;
  path?: string;
  isSports?: boolean;
  variables?: {
    page?: number;
    isMobile?: boolean;
    provider?: string;
    excludedProvider?: string;
    type?: string;
    category?: string;
    perPage?: number;
    search?: string;
    sort?: string;
    order?: string;
    rtpRanges?: string;
  };
  isFavourites?: boolean;
  fetcher?: TYPES;
}

const getPerView = (width: number): number => {
  if (width < 600) return 3;
  if (width < 800) return 4;
  if (width < 900) return 5;
  if (width < 1000) return 6;
  return 7;
};

const HorizontalGamesCarousel: FC<HorizontalCarouselProps> = ({
  title,
  path,
  isSports = false,
  variables = { page: 1, perPage: 28 },
  fetcher = TYPES.GET_GAMES,
  isFavourites = false
}) => {
  const { width } = useWindowSize();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const expandRef = useRef<HTMLDivElement | null>(null);
  const perPage = variables.perPage ?? 28;
  const useHybridCatalog = fetcher === TYPES.GET_GAMES && !isSports && !isFavourites;
  const routeSlug = resolveRouteSlugFromLegacyVariables({
    category: variables.category,
    provider: variables.provider,
    order: variables.order
  });

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

  const { pageGames: hybridGames, isFetching: isHybridFetching } = useHybridGames({
    routeSlug,
    graphqlLimit: perPage,
    graphqlOffset: 0,
    legacyPage: variables.page ?? 1,
    legacyPerPage: perPage,
    legacyOrder: variables.order,
    isMobile: width < 768,
    isSports,
    enabled: isVisible && useHybridCatalog
  });

  const { data: games, isFetching: isLegacyFetching } = useFetcher<IGamesResponse | ISportResponse | { data: IGame[] }>(
    fetcher
  ).render(
    {
      ...variables,
      isMobile: width < 768
    },
    { enabled: isVisible && !useHybridCatalog }
  );

  const isFetching = useHybridCatalog ? isHybridFetching : isLegacyFetching;

  const perView = getPerView(width);
  const gap = width < 600 ? 8 : 12;

  const allItems: IGame[] | ISport[] = isFetching
    ? []
    : useHybridCatalog
      ? (hybridGames ?? [])
      : isSports
        ? ((games as ISportResponse)?.games ?? [])
        : isFavourites
          ? ((games as { data: IGame[] })?.data ?? [])
          : ((games as IGamesResponse)?.games ?? []);

  const carouselItems = isFetching ? null : allItems.slice(0, perView);
  const extraItems = isFetching ? null : allItems.slice(perView, perView * 3);
  const hasExtra = !isFetching && (extraItems?.length ?? 0) > 0;

  const handleToggle = () => {
    const el = expandRef.current;
    if (!el) return;

    if (!isExpanded) {
      el.style.maxHeight = `${el.scrollHeight}px`;
    } else {
      el.style.maxHeight = `${el.scrollHeight}px`;
      void el.offsetHeight;
      el.style.maxHeight = '0px';
    }
    setIsExpanded(prev => !prev);
  };

  const renderCarouselItems = () => {
    if (isFetching) {
      return Array.from({ length: width < 768 ? 6 : 20 }).map((_, idx) => <GameCardSkeleton key={idx} />);
    }
    if (isSports) {
      return (carouselItems as ISport[]).map((g: ISport) => (
        <SportCard key={g.id} id={g.id} title={g.name} image={g.image} />
      ));
    }
    return (carouselItems as IGame[]).map((g: IGame) => (
      <GameCard
        key={g.id}
        id={g.id}
        title={g.name || g.title || ''}
        image={g.image}
        provider={typeof g.provider === 'string' ? g.provider : g.provider?.displayName || g.provider?.name}
        slug={g.slug}
        href={g.launchUrl}
        entryKind={g.entryKind}
      />
    ));
  };

  const renderExtraItems = () => {
    if (isSports) {
      return (extraItems as ISport[]).map((g: ISport) => (
        <SportCard key={g.id} id={g.id} title={g.name} image={g.image} />
      ));
    }
    return (extraItems as IGame[]).map((g: IGame) => (
      <GameCard
        key={g.id}
        id={g.id}
        title={g.name || g.title || ''}
        image={g.image}
        provider={typeof g.provider === 'string' ? g.provider : g.provider?.displayName || g.provider?.name}
        slug={g.slug}
        href={g.launchUrl}
        entryKind={g.entryKind}
      />
    ));
  };

  return (
    <div ref={rootRef} className="mt-0 mb-5">
      {title && <SectionHeader title={title} path={path} sectionId={title} />}
      {!isVisible ? (
        <div style={{ height: width < 768 ? 220 : 420 }} />
      ) : (
        <>
          <HorizontalCarousel showScrollButtons={false} sectionId={title}>
            {renderCarouselItems()}
          </HorizontalCarousel>

          {hasExtra && (
            <div
              ref={expandRef}
              style={{
                maxHeight: 0,
                overflow: 'hidden',
                transition: 'max-height 0.4s ease'
              }}
            >
              <div
                className="pt-2"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${perView}, 1fr)`,
                  gap: `${gap}px`
                }}
              >
                {renderExtraItems()}
              </div>
            </div>
          )}

          {hasExtra && (
            <button
              onClick={handleToggle}
              className="flex items-center gap-3 w-full mt-3 cursor-pointer select-none group"
            >
              <span className="flex-1 h-px bg-white/10 group-hover:bg-white/20 transition-colors" />
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-400 group-hover:text-white transition-colors whitespace-nowrap">
                {isExpanded ? 'Show less' : 'Load more'}
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
              <span className="flex-1 h-px bg-white/10 group-hover:bg-white/20 transition-colors" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default HorizontalGamesCarousel;
