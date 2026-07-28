import type { FC } from 'react';

import { PAGE } from '@/core/config/public-page.config';
import { buildImgixUrl } from '@/core/lib/imgix';
import UserName from '@/screens/profile/UserName';
import { ImageWithFallback } from '@/shared/ui/Images/ImageWithFallback';
import { Link } from '@/shared/ui/LoadingLink';
import { getGamelinkName } from '@/shared/utils/gamesUtils';
import { formatWinAmount } from '@/shared/utils/numberUtils';

interface LiveWinCardProps {
  game_name: string;
  image: string;
  username: string;
  amount: number;
  isNew?: boolean;
  level: number;
  provider: string;
}

const LiveWinCard: FC<LiveWinCardProps> = ({ game_name, image, username, amount, level, provider }) => {
  const imgixSrc = (() => {
    if (!image || image.trim().length === 0) return '';
    const pathOnly = /^https?:\/\//i.test(image) ? new URL(image).pathname : image;
    // Use larger breakpoint size (120x90) to look crisp on @[768px]
    return buildImgixUrl(pathOnly, { w: 140, auto: 'format', q: 100 });
  })();

  return (
    <Link
      href={PAGE.CASINO_GAME(getGamelinkName(game_name, provider))}
      className={`w-[70px] @[768px]:w-[90px] h-full flex flex-col items-center justify-between gap-1 bg-toshi_body rounded-lg overflow-hidden`}
      aria-label={`${game_name} image`}
      prefetch={false}
    >
      <ImageWithFallback
        src={imgixSrc}
        alt={`${game_name} image`}
        aria-label={`${game_name} image`}
        width={90}
        height={60}
        className=" min-h-[60px] max-h-[60px] @[768px]:w-[120px] @[768px]:min-h-[90px] @[768px]:max-h-[90px]  object-cover"
      />
      <div className="flex flex-col items-center py-2 h-full">
        {/* <p className="text-[11px] text-slate-300 font-bold text-center line-clamp-1 max-w-[75px] pr-2">{username}</p> */}
        <UserName username={username} level={level} />
        <p className="text-[12px] text-success-500 text-center">${formatWinAmount(Number(amount))}</p>
      </div>
    </Link>
  );
};

export default LiveWinCard;
