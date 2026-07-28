'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphQLSubscription, useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import type {
  NewsCheckerSignal,
  NewsCheckerSignalAddedResponse,
  NewsCheckerSignalsResponse
} from '@/core/types/worldCupNews.types';

const REFETCH_INTERVAL_MS = 60_000;
const MAX_NEWS_ITEMS = 50;

const mergeSignals = (incoming: NewsCheckerSignal[], current: NewsCheckerSignal[]) =>
  [...incoming, ...current.filter(signal => !incoming.some(item => item.id === signal.id))].slice(0, MAX_NEWS_ITEMS);

/**
 * Loads the World Cup news feed from `newsCheckerSignals`, then prepends live
 * `newsCheckerSignalAdded` events as the news-checker sync writes new posts.
 */
export const useWorldCupNews = () => {
  const locale = useLocale();
  const query = useGraphWsFetcher<NewsCheckerSignalsResponse>(GRAPHQL_TYPES.NEWS_CHECKER_SIGNALS_QUERY).render(
    {
      limit: 50,
      offset: 0,
      category: '',
      activeOnly: true,
      language: locale
    },
    { refetchInterval: REFETCH_INTERVAL_MS, refetchOnWindowFocus: false }
  );

  const [liveSignals, setLiveSignals] = useState<NewsCheckerSignal[]>([]);

  useEffect(() => {
    if (query.data?.newsCheckerSignals) {
      setLiveSignals(prev => mergeSignals(query.data?.newsCheckerSignals ?? [], prev));
    }
  }, [query.data]);

  useGraphQLSubscription<NewsCheckerSignalAddedResponse>(
    GRAPHQL_TYPES.NEWS_CHECKER_SIGNAL_ADDED_SUBSCRIPTION,
    {
      category: '',
      activeOnly: true,
      language: locale
    },
    {
      next: data => {
        const incoming = data?.newsCheckerSignalAdded;
        if (!incoming?.id) return;
        setLiveSignals(prev => mergeSignals([incoming], prev));
      }
    },
    [locale]
  );

  return {
    signals: liveSignals,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isEmpty: !query.isLoading && !query.isError && liveSignals.length === 0
  };
};
