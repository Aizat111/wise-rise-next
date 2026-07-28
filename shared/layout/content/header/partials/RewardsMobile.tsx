import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
// import RewardsContent from './RewardsContent';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { AppIcon } from '@/shared/ui/AppIcon';
import Dropdown from '@/shared/ui/dropdowns/Dropdown';

const RewardsContent = dynamic(() => import('./RewardsContent').then(mod => mod.default), {
  loading: () => <div className="w-4 h-4" />
});

const Rewards = () => {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <Dropdown
      trigger={
        <Button
          intent="blue"
          appearance="glossy"
          iconOnly
          mobileIcon={<AppIcon name="asset/sidebar/Rewards" className="w-6 h-6" />}
          className="inline-flex @[768px]:hidden w-10 h-10 p-0"
        >
          {t('rewards')}
        </Button>
      }
      open={isOpen}
      content={<RewardsContent onClose={closeDropdown} />}
    />
  );
};

export default Rewards;
