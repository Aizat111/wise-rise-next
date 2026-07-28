'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';

import { usePathname } from '@/core/i18n/navigation';
import { cn } from '@/core/lib/utils';
import { Link } from '@/shared/ui/LoadingLink';

interface MenuListProps {
  className?: string;
  isTranslated?: boolean;
  data: {
    label: string;
    link: string;
  }[];
}

const MenuList: FC<MenuListProps> = ({ className, data, isTranslated = true }) => {
  const t = useTranslations();
  const pathname = usePathname();
  return (
    <div
      className={cn('min-w-[230px] pt-0 pr-12 hidden lg:block', className)}
      style={{ borderRight: '1px solid #ffffff1a' }}
    >
      {data.map((item, index) => (
        <Link
          href={item.link}
          key={`${item.label}-${index}`}
          className={cn(
            'text-white50 py-2 px-4 block border-b border-white10 transition-colors hover:text-white',
            pathname?.split('/').pop() === item.link.split('/').pop() && 'text-white'
          )}
        >
          {isTranslated ? t(item.label) : item.label}
        </Link>
      ))}
    </div>
  );
};

export default MenuList;
