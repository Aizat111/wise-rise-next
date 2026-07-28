import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

import Image from '../Images/Image';

import { cn } from '@/core/lib/utils';

interface BetButtonProps {
  appearance?: 'glossy' | 'solid' | 'outline' | 'ghost' | 'link';
  intent?:
    | 'success'
    | 'lime'
    | 'none'
    | 'primary'
    | 'secondary'
    | 'warning'
    | 'danger'
    | 'info'
    | 'orange'
    | 'gray'
    | 'green'
    | 'blue'
    | 'red'
    | 'dark'
    | 'white'
    | 'black'
    | 'slate'
    | 'zinc'
    | 'neutral'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'rose';
  handleBetClick: () => void;
  isProcessing?: boolean;
  isLoading?: boolean;
  iconSrc?: string;
  disabled?: boolean;
  text?: string;
  className?: string;
}

const BetButton: FC<BetButtonProps> = ({
  appearance = 'glossy',
  intent = 'success',
  handleBetClick,
  isProcessing,
  isLoading,
  iconSrc,
  disabled,
  text,
  className
}) => {
  const t = useTranslations();
  return (
    <Button
      appearance={appearance}
      intent={intent}
      animateOnClick={false}
      className={cn('w-full h-[44px] text-[16px] disabled:opacity-50', className)}
      onClick={handleBetClick}
      disabled={isProcessing || isLoading || disabled}
    >
      {isLoading && iconSrc ? (
        <div className="animation-loader">
          <Image width={20} height={20} src={iconSrc} alt="limbo" loading="lazy" />
        </div>
      ) : (
        text || t('bet')
      )}
    </Button>
  );
};

export default BetButton;
