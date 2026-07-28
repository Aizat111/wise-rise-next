'use client';

import type { FC } from 'react';

import ProviderCard from '../card/ProviderCard';

import { type Provider } from '@/data/providers';
import { SkeletonLoader } from '@/shared/ui/SkeletonLoader';

type ProviderGridSectionProps = {
  providers: Provider[];
  loading: boolean;
};

const ProviderGridSection: FC<ProviderGridSectionProps> = ({ providers, loading }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
      {loading ? (
        <SkeletonLoader
          count={20}
          containerClassName="flex-wrap"
          className="min-w-[153px] max-h-[215px] aspect-[153/201] card-loader"
        />
      ) : (
        providers.map((provider: Provider, index: number) => (
          <ProviderCard key={`${provider.slug}-${index}`} provider={provider} />
        ))
      )}
    </div>
  );
};

export default ProviderGridSection;
