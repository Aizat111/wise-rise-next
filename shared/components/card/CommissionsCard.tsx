import { useTranslations } from 'next-intl';
import type { FC } from 'react';

import { Dollar } from '@/shared/assets/currencies';
import Card from '@/shared/components/card/Card';

interface CommissionsCardProps {}

const CommissionsCard: FC<CommissionsCardProps> = () => {
  const t = useTranslations();
  return (
    <Card className="p-6 @[768px]:p-10 gap-10 items-end @[768px]:flex @[768px]:flex-row flex flex-col">
      <div className="flex flex-col gap-7 w-full">
        <Dollar width={58} height={58} className="w-[58px] h-[58px]" />

        <div className="flex @[768px]:flex-row flex-col w-full gap-10">
          <div className="flex flex-col gap-6 w-full">
            <div className="@[768px]:gap-5 gap-3 flex flex-col">
              <h2 className="@[768px]:text-base text-lg text-white font-semibold">
                {t('affiliate.commissions.title_1')}
              </h2>
              <p className="text-base text-grey font-semibold">{t('affiliate.commissions.desc_1')}</p>
            </div>

            <div className="@[768px]:gap-0 gap-3 flex flex-col">
              <h2 className="@[768px]:text-base text-lg text-white font-semibold">
                {t('affiliate.commissions.title_2')}
              </h2>
              <p className="text-base text-grey font-semibold">{t('affiliate.commissions.desc_2')}</p>
            </div>
          </div>

          <div className="gap-10 p-6 bg-bg_menu h-full rounded-xl justify-center flex flex-col w-full">
            <div className="gap-1 flex flex-col">
              <h2 className="text-sm font-white font-semibold">{t('affiliate.commissions.dojo_title')}</h2>
              <div className="bg-toshi_body rounded-md p-3 justify-start">
                <p className="text-sm text-grey font-semibold">{t('affiliate.commissions.dojo_formula')}</p>
              </div>
            </div>

            <div className="gap-1 flex flex-col">
              <h2 className="text-sm font-white font-semibold">{t('affiliate.commissions.slots_title')}</h2>
              <div className="bg-toshi_body rounded-md p-3 justify-start">
                <p className="text-sm text-grey font-semibold">{t('affiliate.commissions.slots_formula')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommissionsCard;
