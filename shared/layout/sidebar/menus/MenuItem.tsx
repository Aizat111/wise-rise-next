import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';

import { cn } from '@/core/lib/utils';
import { closeMobileSidebar, closeSidebar } from '@/core/redux-toolkit/slices/uiSlice';
import type { IMenuItemProps } from '@/core/types/menu.types';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { AppIcon } from '@/shared/ui/AppIcon';
import Image from '@/shared/ui/Images/Image';
import { Link } from '@/shared/ui/LoadingLink';

export function MenuItem({
  item,
  isActive,
  isShowedSidebar,
  mobileSidebarOpen,
  isAccordionItem = false,
  isLastAccordionItem = false
}: IMenuItemProps) {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const handleClick = () => {
    if (mobileSidebarOpen) {
      dispatch(closeMobileSidebar());
    }
    // Close desktop sidebar with overlay when width < 1200
    if (isShowedSidebar && width && width < 1200) {
      dispatch(closeSidebar());
    }
  };

  const isImageSrc = (v: unknown): v is string =>
    typeof v === 'string' && (/^(https?:)?\/\//.test(v) || v.startsWith('/') || v.startsWith('data:'));

  if (item?.onClick) {
    return (
      <li>
        <div
          aria-hidden="true"
          role="button"
          onClick={() => {
            item.onClick?.();
            handleClick();
          }}
          className={cn(
            'group p-0.5 flex overflow-hidden items-center gap-2.5 border border-transparent',
            !isShowedSidebar && !mobileSidebarOpen && 'p-0 py-[5px] max-w-[40px] justify-center gap-0',
            isShowedSidebar && 'pl-1 pr-2.5 py-1 hover:bg-white10',
            mobileSidebarOpen &&
              `bg-toshi_body ${isAccordionItem ? (isLastAccordionItem ? '' : 'mb-0') : 'mb-1.5 rounded-lg'}`,
            isAccordionItem && 'py-1',
            isShowedSidebar && isActive && 'sidebar-item-active',
            mobileSidebarOpen && 'py-2 px-2'
          )}
          title={item.label}
        >
          <div className={cn(!isShowedSidebar && !mobileSidebarOpen && 'rounded-md p-0')}>
            <div
              className={cn(
                'rounded-md flex items-center justify-center ',
                !isShowedSidebar && !mobileSidebarOpen ? 'p-0' : 'p-0'
              )}
            >
              {typeof item.icon === 'string' ? (
                isImageSrc(item.icon) ? (
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                ) : (
                  <AppIcon
                    name={item.icon}
                    className={cn(
                      'flex items-center justify-center',
                      !isShowedSidebar && !mobileSidebarOpen
                        ? 'text-white'
                        : 'text-sidebar-icon-color group-hover:text-white'
                    )}
                  />
                )
              ) : (
                <item.icon
                  className={cn(
                    'flex items-center justify-center',
                    !isShowedSidebar && !mobileSidebarOpen
                      ? 'text-white'
                      : 'text-sidebar-icon-color group-hover:text-white'
                  )}
                />
              )}
            </div>
          </div>
          <span
            className={cn(' text-white text-base font-medium truncate', {
              'border-white': isActive,
              'border-transparent': !isActive,
              hidden: !isShowedSidebar && !mobileSidebarOpen
            })}
          >
            {t(item.label || '') || item.label}
          </span>
        </div>
      </li>
    );
  }
  return (
    <li>
      <Link
        href={item.link || ''}
        onClick={handleClick}
        className={cn(
          'group p-0.5 flex overflow-hidden items-center gap-2.5 border border-transparent',
          !isShowedSidebar && !mobileSidebarOpen && 'p-0 py-[5px]  justify-center gap-0',
          isShowedSidebar && 'pl-1 pr-2.5 py-1 hover:bg-white10',
          mobileSidebarOpen &&
            `bg-toshi_body ${isAccordionItem ? (isLastAccordionItem ? '' : 'mb-0') : 'mb-1.5 rounded-lg'}`,
          isAccordionItem && 'py-1',
          isShowedSidebar && isActive && 'sidebar-item-active ',
          mobileSidebarOpen && 'py-2 px-2'
        )}
        title={item.label}
        prefetch
      >
        <div className={cn(!isShowedSidebar && !mobileSidebarOpen && 'rounded-md p-0')}>
          <div
            className={cn(
              'rounded-md flex items-center justify-center ',
              !isShowedSidebar && !mobileSidebarOpen ? 'p-0' : 'p-0'
            )}
          >
            {typeof item.icon === 'string' ? (
              isImageSrc(item.icon) ? (
                <Image src={item.icon} alt={item.label} width={20} height={20} />
              ) : (
                <AppIcon
                  name={item.icon}
                  className={cn(
                    'flex items-center justify-center',
                    !isShowedSidebar && !mobileSidebarOpen
                      ? 'text-white'
                      : 'text-sidebar-icon-color group-hover:text-white'
                  )}
                />
              )
            ) : (
              <item.icon
                className={cn(
                  'flex items-center justify-center',
                  !isShowedSidebar && !mobileSidebarOpen
                    ? 'text-white'
                    : 'text-sidebar-icon-color group-hover:text-white'
                )}
              />
            )}
          </div>
        </div>
        <span
          className={cn(' text-white text-base font-medium truncate', {
            'border-white': isActive,
            'border-transparent': !isActive,
            hidden: !isShowedSidebar && !mobileSidebarOpen
          })}
        >
          {t(item.label || '') || item.label}
        </span>
      </Link>
    </li>
  );
}
