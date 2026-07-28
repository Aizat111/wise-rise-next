import { useTranslations } from 'next-intl';
import React from 'react';

import { cn } from '@/core/lib/utils';
import type { IMenuItemProps } from '@/core/types/menu.types';
import { useModalManager } from '@/shared/hooks/useModal';
import { Link as NextLink } from '@/shared/ui/LoadingLink';

export function MenuItem({ item, isActive, onClose }: IMenuItemProps) {
  const t = useTranslations();
  const { openModal } = useModalManager();
  const handleClick: React.MouseEventHandler<HTMLAnchorElement | HTMLDivElement> = e => {
    e.stopPropagation();
    if (item?.onClick) {
      e.preventDefault();
      item.onClick();
    }
    if (item?.action?.type === 'open_modal') {
      e.preventDefault();
      openModal(item.action.modal as any, item.action.modalType ?? 'default', item.action.modalProps ?? {});
    }
    onClose?.();
  };

  const Link = item.link ? NextLink : 'div';

  return (
    <li>
      <Link
        href={item.link ?? ''}
        onClick={handleClick}
        className={cn(
          'group flex min-w-[240px] cursor-pointer items-center gap-2.5 transition-colors p-0 h-[40px] px-2.5 rounded-md bg-bg_color'
        )}
        title={item.label}
      >
        <div>
          <item.icon
            className={cn('min-w-4', {
              'group-hover:text-primary-500 text-white transition ': !isActive,
              'text-red-400': isActive
            })}
          />
        </div>

        <span
          className={cn('border-b text-white text-base font-semibold', {
            'border-white': isActive,
            'border-transparent': !isActive
          })}
        >
          {t(item.label)}
        </span>
      </Link>
    </li>
  );
}
