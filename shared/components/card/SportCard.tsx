import type { FC } from 'react';

import { PAGE } from '@/core/config/public-page.config';
import { buildImgixUrl } from '@/core/lib/imgix';
import Image from '@/shared/ui/Images/Image';
import { Link } from '@/shared/ui/LoadingLink';
import { getGamelinkName } from '@/shared/utils/gamesUtils';

interface SportCardProps {
  id: string;
  title: string;
  image: string;
  href?: string;
  badge?: string;
}

const SportCard: FC<SportCardProps> = ({ id: _id, title, image, href, badge }) => {
  const link = href || PAGE.SPORTS_GAME(getGamelinkName(title));
  return (
    <Link href={link} className="game-card" prefetch={false} title={`${title} game`}>
      <div className="relative w-full h-full aspect-[153/201]">
        {(() => {
          const pathOnly = /^https?:\/\//i.test(image) ? new URL(image).pathname : image;
          const imgixSrc = buildImgixUrl(pathOnly, { w: 250, sat: 15, auto: 'format', q: 100 });
          return (
            <Image
              src={imgixSrc}
              alt={`${title} game`}
              width={153}
              height={201}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          );
        })()}

        <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: '12px' }} />

        {badge ? (
          <span className="absolute left-2 top-2 text-[10px] px-2 py-1 rounded bg-gray-800/80">{badge}</span>
        ) : null}
      </div>
    </Link>
  );
};

export default SportCard;
