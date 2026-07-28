'use client';

import { useTranslations } from 'next-intl';

import Card from '@/shared/components/card/Card';

const Level0Placeholder = () => {
  const t = useTranslations();
  return (
    <Card className="bg-bg_content p-2">
      <p className="text-[14px] font-bold text-white max-w-[300px] min-w-[240px] mt-6 mb-6">
        {t('rewards.level0Placeholder')}
      </p>
    </Card>
  );
};
export default Level0Placeholder;
