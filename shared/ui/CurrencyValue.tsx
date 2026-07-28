import { FC, HTMLAttributes } from 'react';

import { cn } from '@/core/lib/utils';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { RootState } from '@/core/redux-toolkit/store';
import Image from '@/shared/ui/Images/Image';
import { getCurrencyIcon, getCurrencySymbol } from '@/shared/utils/currencyUtils';
import { formatNumber } from '@/shared/utils/numberUtils';

export interface CurrencyValueProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  currency?: string;
  customIcon?: string;
  iconSize?: number;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
  formatOptions?: Intl.NumberFormatOptions;
  showSymbol?: boolean;
  customSymbol?: string;
  symbolPosition?: 'left' | 'right';
  gap?: string;
}
const CurrencyValue: FC<CurrencyValueProps> = ({
  value,
  currency,
  customIcon,
  iconSize = 16,
  iconPosition = 'right',
  iconClassName = '',
  formatOptions,
  showSymbol = true,
  customSymbol,
  symbolPosition = 'left',
  gap = 'gap-1',
  className,
  ...props
}) => {
  const selectedCurrency = useAppSelector((state: RootState) => state.ui.selectedCurrency);

  const activeCurrency = currency || selectedCurrency || 'USD';

  const iconPath = customIcon || getCurrencyIcon(activeCurrency);

  const formattedValue = formatNumber(value, undefined, formatOptions);

  const symbol = customSymbol || (showSymbol ? getCurrencySymbol(activeCurrency) : '');

  return (
    <span className={cn('flex items-center', gap, className)} {...props}>
      {iconPosition === 'left' && (
        <Image
          src={iconPath}
          width={iconSize}
          height={iconSize}
          className={cn('flex-shrink-0', iconClassName)}
          alt={`${activeCurrency} icon`}
          style={{ width: iconSize, height: iconSize }}
        />
      )}
      {/* {symbol && symbolPosition === 'left' && <span>{symbol}</span>} */}
      <span>{formattedValue}</span>
      {symbol && symbolPosition === 'right' && <span>{symbol}</span>}
      {iconPosition === 'right' && (
        <Image
          src={iconPath}
          width={iconSize}
          height={iconSize}
          className={cn('flex-shrink-0', iconClassName)}
          alt={`${activeCurrency} icon`}
          style={{ width: iconSize, height: iconSize }}
        />
      )}
    </span>
  );
};

export default CurrencyValue;
