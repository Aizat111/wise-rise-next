import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';

import { PAGE } from '@/core/config/public-page.config';
import { Link } from '@/shared/ui/LoadingLink';

export function SidebarMobileHeader() {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-4 mb-0 w-full p-0.5 z-[900]">
      <Link href={PAGE.CASINO} className="w-[50%]">
        <Button id="sidebar-header-button-casino" size="lg" intent="primary" appearance="glossy" className="w-full">
          {t('casino')}
        </Button>
      </Link>
      <Link href={PAGE.SPORTS} className="w-[50%]">
        <Button id="sidebar-header-button-sports" size="lg" intent="success" appearance="glossy" className="w-full">
          {t('sports')}
        </Button>
      </Link>
    </div>
  );
}
