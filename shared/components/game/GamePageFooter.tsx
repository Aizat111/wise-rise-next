import { useTranslations } from 'next-intl';

import HorizontalGamesCarousel from '../carousel/HorizontalGamesCarousel';
import ProviderHorizontalCarousel from '../carousel/ProviderHorizontalCarousel';

import { PAGE } from '@/core/config/public-page.config';
import { PROVIDER_LINKS } from '@/core/constants/link.constants';

const GamePageFooter = () => {
  const t = useTranslations();
  return (
    <div className="max-w-[1200px] flex flex-col gap-4  mx-auto w-full">
      {/* <GameBetsTable /> */}
      <HorizontalGamesCarousel
        title={t('toshi_top_pick')}
        path={`${PAGE.CASINO}/toshi's-dojo`}
        variables={{ page: 1, perPage: 28, provider: PROVIDER_LINKS['toshis-dojo'] }}
      />
      <ProviderHorizontalCarousel title={t('providers')} path={`${PAGE.PROVIDERS}`} />
    </div>
  );
};

export default GamePageFooter;
