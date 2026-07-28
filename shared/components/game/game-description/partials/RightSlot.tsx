'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { IFavoriteGame } from '@/core/types/games.type';
import { Loader } from '@/shared/ui/loaders/Loader';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';

const RightSlot = () => {
  const pathname = usePathname();
  const t = useTranslations();
  const { game } = useAppSelector(state => state.game);
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
  const addToFavorites = useFetcher(TYPES.ADD_TO_FAVORITES).action();
  const { data: favorites } = useFetcher<{ data: IFavoriteGame[] }>(TYPES.GET_FAVORITE_GAMES).render();
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    if (favorites?.data) {
      setIsFavorite(favorites?.data?.some(fav => fav.pathname === (pathname?.split('/').pop() || '')) ? true : false);
    }
  }, [favorites?.data, pathname]);
  const rightSlot = isAuthenticated ? (
    <CustomTooltip label={t('favorites')} placement="top">
      <Button
        intent="gray"
        appearance="3d"
        iconOnly
        borderRadius="md"
        size="md"
        icon={
          addToFavorites.isPending ? (
            <Loader size="sm" variant="spinner" />
          ) : isFavorite ? (
            <Star style={{ fill: '#e5e7eb', stroke: '#e5e7eb' }} />
          ) : (
            <Star />
          )
        }
        disabled={addToFavorites.isPending}
        onClick={() =>
          addToFavorites
            .mutateAsync({
              image: game?.image || '',
              name: game?.name || '',
              pathname: pathname?.split('/').pop() || ''
            })
            .then(response => {
              if ((response as any).status) {
                setIsFavorite(!isFavorite);
              }
            })
        }
      ></Button>
    </CustomTooltip>
  ) : null;
  return rightSlot;
};

export default RightSlot;
