import type { FC } from 'react';

import Image from '@/shared/ui/Images/Image';
import { Link } from '@/shared/ui/LoadingLink';

interface TileProps {
  title: string;
  image: string;
  href: string;
}

const TileCard: FC<TileProps> = ({ title, image, href }) => {
  return (
    <Link
      href={href}
      className="relative bg-toshi_body rounded-xl overflow-hidden hover-card-animation w-full @container aspect-[23/20] @[768px]:aspect-[8/5]"
    >
      <Image
        src={image}
        alt={title}
        width={460}
        height={400}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        priority={true}
        fetchPriority="high"
      />
      <div className="absolute left-1/2 top-[20%] font-byrd -translate-x-1/2 -translate-y-1/2 max-sm:text-2xl sm:text-3xl @[768px]:text-4xl lg:text-5xl text-5xl font-bold tracking-wide">
        {title}
      </div>
    </Link>
  );
};

export default TileCard;
