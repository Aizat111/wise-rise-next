'use client';

import { useTranslations } from 'next-intl';

const FairnessPageHeader = () => {
  const t = useTranslations();
  return <h1 className="text-xl font-bold font-byrd uppercase text-white mb-3 lg:mb-0">{t('fairness')}</h1>;
};

export default FairnessPageHeader;
