'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import GameCard from '../card/GameCard';

import HorizontalCarousel from './HorizontalCarousel';
import { PAGE } from '@/core/config/public-page.config';
import type { RootState } from '@/core/redux-toolkit/store';
import type { IGame } from '@/core/types/games.type';
import SectionHeader from '@/screens/home/SectionHeader';

const RecentlyPlayedGames = () => {
  const t = useTranslations();
  const { recentlyPlayedGames } = useSelector((state: RootState) => state.game);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || recentlyPlayedGames.length === 0) {
    return null;
  }

  return (
    <div className="mt-0 mb-5">
      <SectionHeader
        title={t('home.recently_played')}
        path={`${PAGE.CASINO_TAB('recently-played')}`}
        sectionId="recently-played"
      />
      <HorizontalCarousel showScrollButtons={false} sectionId="recently-played">
        {recentlyPlayedGames?.map((g: IGame) => (
          <GameCard key={g.id} id={g.id} title={g.name} image={g.image} provider={g.provider} slug={g?.slug} />
        ))}
      </HorizontalCarousel>
    </div>
  );
};

export default RecentlyPlayedGames;
