import { Button } from '@investorcentretb/toshi-ui';
import { Minimize, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { PAGE } from '@/core/config/public-page.config';
import { resolveGameImageUrl } from '@/core/lib/imgix';
import { cn } from '@/core/lib/utils';
import { setMultiplayGames, setRecentlyPlayedGames } from '@/core/redux-toolkit/slices/gameSlice';
import { ModalItem, openMiniGameModal } from '@/core/redux-toolkit/slices/miniGameModalSlice';
import { RootState } from '@/core/redux-toolkit/store';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import Image from '@/shared/ui/Images/Image';
import { Link } from '@/shared/ui/LoadingLink';
import { Loader } from '@/shared/ui/loaders/Loader';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';
import { getGamelinkName } from '@/shared/utils/gamesUtils';

interface GameCardProps {
  id: string;
  title: string;
  image: string;
  href?: string;
  badge?: string;
  provider?: string | { name?: string; displayName?: string; slug?: string };
  slug?: string;
  isFavourite?: boolean;
  demoImage?: string;
  pathname?: string;
  entryKind?: string;
}

const GameCard: FC<GameCardProps> = ({
  id,
  title,
  image,
  href,
  badge,
  provider,
  slug,
  isFavourite = false,
  demoImage,
  pathname,
  entryKind
}) => {
  const dispatch = useDispatch();
  const t = useTranslations();
  const { width } = useWindowSize();
  const miniGameModals = useSelector((state: RootState) => state.miniGameModal.modals);
  const addToFavorites = useFetcher(TYPES.ADD_TO_FAVORITES).action();

  const multiplay = useSelector((state: RootState) => state.game.multiplay);
  const providerName = typeof provider === 'string' ? provider : provider?.displayName || provider?.name;
  const externalHref = typeof href === 'string' && /^(https?:\/\/|\/)/i.test(href) ? href : null;
  const isExternalLink = entryKind === 'external_link' && Boolean(externalHref);
  const link = isExternalLink
    ? (externalHref as string)
    : slug
      ? PAGE.CASINO_GAME(slug)
      : href || PAGE.CASINO_GAME(getGamelinkName(title, providerName));
  const externalTarget = /^https?:\/\//i.test(link) ? '_blank' : '_self';

  if (multiplay) {
    return (
      <div className="game-card w-full aspect-[3/4] max-h-none">
        <div
          aria-hidden="true"
          onClick={() => {
            if (isExternalLink) return;
            dispatch(
              setRecentlyPlayedGames({ id, name: title, image: demoImage || image, provider: providerName, slug })
            );
            dispatch(setMultiplayGames({ id, name: title, image, provider: providerName }));
          }}
          className="relative w-full h-full aspect-[153/201] overflow-hidden"
          aria-label={`${title} image`}
        >
          {(() => {
            const imgixSrc = resolveGameImageUrl(image, { w: 153, h: 201, fit: 'crop', auto: 'format', q: 100 });
            return (
              <Image
                src={demoImage || imgixSrc}
                alt={`${title} image`}
                width={153}
                height={201}
                loading="lazy"
                className="w-full h-full object-cover"
                aria-label={`${title} image`}
              />
            );
          })()}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: '12px'
              // boxShadow: '1px 1px 1px 0 rgba(255, 255, 255, 0.50) inset, 5px 5px 20px 0 rgba(0, 0, 0, 0.20) inset'
            }}
          />
          {badge ? (
            <span className="absolute left-2 top-2 text-[10px] px-2 py-1 rounded bg-gray-800/80">{badge}</span>
          ) : null}
        </div>
      </div>
    );
  }

  const imageContent = (() => {
    const imgixSrc = resolveGameImageUrl(image, { w: 250, sat: 15, auto: 'format', q: 100 });
    return (
      <Image
        src={demoImage || imgixSrc}
        onClick={() => {
          if (isExternalLink) return;
          setTimeout(() => {
            dispatch(
              setRecentlyPlayedGames({ id, name: title, image: demoImage || image, provider: providerName, slug })
            );
          }, 1000);
        }}
        alt={`${title} image`}
        aria-label={`${title} image`}
        width={153}
        height={201}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    );
  })();

  return (
    <div className="game-card w-full aspect-[3/4] max-h-none">
      <div className="group relative w-full h-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
        {/* Avoid auto-prefetching heavy game routes (reduces unused JS on home/list pages) */}
        {isExternalLink ? (
          <a
            href={link}
            target={externalTarget}
            rel={externalTarget === '_blank' ? 'noopener noreferrer' : undefined}
            aria-label={`${title} image`}
          >
            {imageContent}
          </a>
        ) : (
          <Link href={link} prefetch={false} aria-label={`${title} image`}>
            {imageContent}
          </Link>
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '12px'
            // boxShadow: '1px 1px 1px 0 rgba(255, 255, 255, 0.50) inset, 5px 5px 20px 0 rgba(0, 0, 0, 0.20) inset'
          }}
        />
        {badge ? (
          <span className="absolute left-2 top-2 text-[10px] px-2 py-1 rounded bg-gray-800/80">{badge}</span>
        ) : null}
        {isFavourite ? (
          <div className="absolute top-2 right-2">
            <CustomTooltip label={t('favorites')} placement="top">
              <Button
                intent="gray"
                appearance="3d"
                iconOnly
                borderRadius="md"
                size="sm"
                aria-label="Add to favorites"
                icon={
                  addToFavorites.isPending ? (
                    <Loader size="sm" variant="spinner" aria-label="Add to favorites" />
                  ) : (
                    <Star
                      className="w-4 h-4"
                      style={{ fill: '#e5e7eb', stroke: '#e5e7eb' }}
                      aria-label="Add to favorites"
                    />
                  )
                }
                disabled={addToFavorites.isPending}
                onClick={() =>
                  addToFavorites.mutate({
                    image: image || '',
                    name: title || '',
                    pathname: pathname || ''
                  })
                }
              ></Button>
            </CustomTooltip>
          </div>
        ) : null}

        {width > 1200 && providerName !== "Toshi's Dojo" && !isExternalLink && slug && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute bottom-2 right-2 text-white text-sm font-semibold flex items-center bg-black/50 rounded-md p-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              miniGameModals?.some((modal: ModalItem) => modal.gameSlug === slug || modal.type === slug) &&
                'group-hover:opacity-50 cursor-not-allowed'
            )}
            onClick={e => {
              e.stopPropagation();
              dispatch(
                openMiniGameModal({
                  type: slug,
                  gameSlug: slug,
                  image,
                  provider: providerName
                })
              );
            }}
          >
            <Minimize className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
