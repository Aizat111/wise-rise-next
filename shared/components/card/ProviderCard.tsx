import { useTranslations } from 'next-intl';
import type { ElementType } from 'react';

import { PAGE } from '@/core/config/public-page.config';
import Image from '@/shared/ui/Images/Image';
import { Link } from '@/shared/ui/LoadingLink';

export interface Provider {
  name: string;
  image: ElementType | string;
  slug: string;
  filter: string;
  gameCount?: number | null;
}

interface ProviderCardProps {
  provider: Provider;
  /** Override link target (defaults to casino provider page). */
  href?: string;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, href }) => {
  const t = useTranslations();

  return (
    <div className="pt-0">
      <Link href={href ?? PAGE.CASINO_PROVIDER(provider.slug)} prefetch={false}>
        <div className="flex flex-col hover-card-animation w-full">
          <div className="bg-toshi_body rounded-t-xl w-full flex items-center justify-center p-4 overflow-hidden h-20 md:h-24">
            {typeof provider.image === 'string' ? (
              <Image
                src={provider.image}
                alt={provider.name}
                className="object-contain max-w-full max-h-full w-full h-full"
                width={169}
                height={67}
              />
            ) : (
              <provider.image className="h-full w-auto max-h-full" preserveAspectRatio="xMidYMid meet" />
            )}
          </div>
          <div className="flex items-center rounded-b-xl justify-center w-full bg-bg_menu p-1">
            <span className="text-base text-white font-semibold">
              {provider.gameCount != null ? `${provider.gameCount} ${t('games')}` : provider.name}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProviderCard;
