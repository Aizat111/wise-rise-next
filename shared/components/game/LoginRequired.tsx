'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { useModalManager } from '@/shared/hooks/useModal';

type LoginRequiredProps = {
  bgImage?: string;
};

const LoginRequired: FC<LoginRequiredProps> = ({ bgImage }) => {
  const t = useTranslations();
  const { openModal } = useModalManager();
  return (
    <div className="gap-8 flex flex-col">
      <div
        className="w-full h-full flex flex-col items-center justify-center aspect-video gap-4"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h1 className="text-xl font-bold">{t('login_required')}</h1>
        <Button
          intent="primary"
          appearance="solid"
          borderRadius="md"
          onClick={() => openModal('auth', 'login', { mode: 'login' })}
        >
          {t('login')}
        </Button>
      </div>
    </div>
  );
};

export default LoginRequired;
