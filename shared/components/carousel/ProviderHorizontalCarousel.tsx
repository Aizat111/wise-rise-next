'use client';

import { type FC, useMemo } from 'react';

import ProviderCard from '../card/ProviderCard';

import HorizontalCarousel from './HorizontalCarousel';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { type Provider, providers } from '@/data/providers';
import SectionHeader from '@/screens/home/SectionHeader';
import { SkeletonLoader } from '@/shared/ui/SkeletonLoader';

interface ProviderHorizontalCarouselProps {
  title: string;
  path?: string;
  paddingTop?: string;
}

const ProviderHorizontalCarousel: FC<ProviderHorizontalCarouselProps> = ({ title, path, paddingTop = 'pt-2.5' }) => {
  const providersList = useFetcher<{ stats: { provider: string; count: number }[] }>(TYPES.GET_PROVIDERS).render();

  const statsMap = useMemo(() => {
    if (!providersList.data?.stats) return new Map<string, number>();
    return new Map(providersList.data.stats.map(s => [s.provider.toLowerCase(), s.count]));
  }, [providersList.data?.stats]);

  const filteredProviders = useMemo(() => {
    return providers
      .map(provider => {
        const count = statsMap.get(provider.filter.toLowerCase());
        return count ? { ...provider, gameCount: count } : null;
      })
      .filter(Boolean) as Provider[];
  }, [statsMap]);

  if (!filteredProviders.length) return null;

  return (
    <div className="mt-0 mb-5">
      {title && <SectionHeader title={title} path={path} sectionId={title} />}
      <HorizontalCarousel showScrollButtons={false} sectionId={title} paddingTop={paddingTop}>
        {providersList.isFetching ? (
          <SkeletonLoader className="h-20 md:h-24 w-full self-stretch card-loader" count={7} />
        ) : (
          filteredProviders.map(provider => <ProviderCard key={provider.slug} provider={provider} />)
        )}
      </HorizontalCarousel>
    </div>
  );
};

export default ProviderHorizontalCarousel;
