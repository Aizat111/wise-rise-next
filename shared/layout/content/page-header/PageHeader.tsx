'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { useGraphWsFetcher } from '@/core/api/graphql';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import { PAGE } from '@/core/config/public-page.config';
import { usePathname } from '@/core/i18n/navigation';
import type { IRafflePrizesResponse } from '@/core/types/raffle.types';
import Image from '@/shared/ui/Images/Image';
import { type GameProducer, resolveProviderDisplay } from '@/shared/utils/producerUtils';

type ProducersQueryData = {
  slotegratorGameFilterOptions: {
    options?: {
      producers: GameProducer[];
    };
  };
};

export default function PageHeader() {
  const pathname = usePathname();
  const t = useTranslations();
  // Normalize path to strip locale prefixes like /en or /en-US
  const normalizedPath =
    typeof pathname === 'string' ? pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '') || '/' : '/';
  const pageTitle = PAGE.getPageTitleConfig(normalizedPath);
  const providerSlug = pathname.split('/')?.pop();
  const isProviderDetailPage = pathname.includes(PAGE.PROVIDERS) && providerSlug !== 'providers';

  const { data: producersData } = useGraphWsFetcher<ProducersQueryData>(GRAPHQL_TYPES.GET_GAME_PRODUCERS_QUERY).render(
    undefined,
    { enabled: isProviderDetailPage }
  );

  const providerDisplay = useMemo(() => {
    if (!isProviderDetailPage || !providerSlug) return null;

    const producers = producersData?.slotegratorGameFilterOptions?.options?.producers ?? [];
    return resolveProviderDisplay(providerSlug, producers);
  }, [isProviderDetailPage, providerSlug, producersData?.slotegratorGameFilterOptions?.options?.producers]);

  // Fetch raffle prizes if we're on the raffle page
  const rafflePrizes = useFetcher<IRafflePrizesResponse[]>(TYPES.GET_RAFFLE_PRIZES).render(undefined, {
    enabled: normalizedPath === PAGE.RAFFLE
  });

  // Calculate dynamic raffle title
  const raffleTitle = useMemo(() => {
    if (!rafflePrizes.data || !Array.isArray(rafflePrizes.data) || rafflePrizes.data.length === 0) {
      return null;
    }

    const total = rafflePrizes.data.reduce((sum, prize) => sum + (prize.prize_amount || 0), 0);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(total);

    return `${formatted} Weekly Raffle`;
  }, [rafflePrizes.data]);

  if (isProviderDetailPage && providerDisplay) {
    return (
      <div className="flex items-center justify-between w-full mb-0 before:absolute before:top-[95px] before:left-0 before:right-0 before:h-px before:bg-gray-500  before:w-[100vw]">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-widest text-white">{providerDisplay.name}</h1>
        </div>
        {typeof providerDisplay.image === 'string' ? (
          <Image
            src={providerDisplay.image}
            alt={providerDisplay.name}
            aria-label={providerDisplay.name}
            width={80}
            height={80}
            className="w-20 h-20 text-white/35 -mb-0.5"
          />
        ) : (
          <providerDisplay.image width={80} height={80} className="w-20 h-20 text-white/35 -mb-0.5" />
        )}
      </div>
    );
  }

  if (!pageTitle?.isVisible) {
    return null;
  }

  const IconComponent = pageTitle?.icon;

  // Determine the display title - translate when possible; raffle title overrides
  const translatedTitle =
    typeof pageTitle.title === 'string' ? t(pageTitle.title as string) || pageTitle.title : pageTitle.title;
  const displayTitle = pathname === PAGE.RAFFLE && raffleTitle ? raffleTitle : translatedTitle;

  return (
    <div className="flex items-center overflow-hidden -mt-5 @[768px]:-mt-1 justify-between max-h-[80px] w-full mb-0 before:absolute before:top-[80px] @[768px]:before:top-[100px]  before:left-0 before:right-0 before:h-px before:bg-gray-500  before:w-[100vw]">
      <div>
        <h1 className="@[768px]:text-xl mt-2 text-lg font-byrd font-extrabold uppercase tracking-widest text-white">
          {displayTitle}
        </h1>
        {pageTitle.description && (
          <p className="text-gray-300 mt-0">{t(pageTitle.description as string) || pageTitle.description}</p>
        )}
      </div>
      <div className="overflow-hidden">
        {IconComponent && <IconComponent className="mt-6" width={120} height={120} aria-label={displayTitle || ''} />}
      </div>
    </div>
  );
}
