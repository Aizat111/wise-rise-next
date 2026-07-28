import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
// import RewardsContent from './RewardsContent';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import Image from '@/shared/ui/Images/Image';
import Dropdown from '@/shared/ui/dropdowns/Dropdown';

const RewardsContent = dynamic(() => import('./RewardsContent').then(mod => mod.default), {
  loading: () => <div />
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
          iconPosition="right"
          icon={<Image src="/assets/icons/present.png" alt="Present" width={40} height={40} className="-ml-1 mr-0" />}
          mobileIcon={
            <Image src="/assets/icons/present.png" alt="Present" width={40} height={40} className="size-30 size-30" />
          }
          hideTextInSize={1100}
          className="@[700px]:w-[130px] pl-0 pr-0 pt-[0.5px] font-bold mx-0 w-10 p-0 max-h-10 max-md:w-8 max-md:h-8"
        >
          {t('rewards.rewards')}
        </Button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      content={<RewardsContent onClose={closeDropdown} />}
    />
  );
};

export default Rewards;
