'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { MenuItem } from './MenuItem';
import { usePathname, useRouter } from '@/core/i18n/navigation';
import { cn } from '@/core/lib/utils';
import { closeMobileSidebar, closeSidebar } from '@/core/redux-toolkit/slices/uiSlice';
import { ISidebarItem } from '@/core/types/sidebar.types';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { AppIcon } from '@/shared/ui/AppIcon';
import Image from '@/shared/ui/Images/Image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordions/Accordion';

interface Props {
  menuItem: ISidebarItem;
  isShowedSidebar: boolean;
  mobileSidebarOpen: boolean;
  isActive: boolean;
}

const AccordionMenuItem: FC<Props> = ({ menuItem, isShowedSidebar, mobileSidebarOpen }) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const normalizePath = (p?: string) => {
    if (!p) return '';
    const withoutLocale = p.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '');
    const trimmed = withoutLocale.replace(/\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
  };
  const pathNormalized = normalizePath(pathname);
  const parentLinkNormalized = normalizePath(menuItem.link as string);
  const isParentActiveLocal =
    !!parentLinkNormalized &&
    (pathNormalized === parentLinkNormalized || pathNormalized.startsWith(parentLinkNormalized + '/'));

  const isAnyChildActive = (menuItem.children || []).some(child => {
    const childLinkNormalized = normalizePath(child.link as string);
    return (
      !!childLinkNormalized &&
      (pathNormalized === childLinkNormalized || pathNormalized.startsWith(childLinkNormalized + '/'))
    );
  });

  const isOpen = isParentActiveLocal || isAnyChildActive;
  const menuItemLabel = t(menuItem.label) || menuItem.label;
  const isImageSrc = (v: unknown): v is string =>
    typeof v === 'string' && (/^(https?:)?\/\//.test(v) || v.startsWith('/') || v.startsWith('data:'));

  return (
    <li key={menuItem.label}>
      <Accordion type="single" collapsible defaultValue={isOpen ? menuItem.label : ''}>
        <AccordionItem value={menuItem.label}>
          <AccordionTrigger
            unstyled
            collapseOpenEffect={false}
            aria-label={menuItemLabel}
            title={menuItemLabel}
            className={cn(
              'group flex items-center justify-between gap-0 w-full p-0.5 md:mb-0 mb-0 overflow-hidden data-[state=open]:rounded-b-none rounded-lg text-left bg-transparent text-white  ',
              !isShowedSidebar && !mobileSidebarOpen && 'p-0 py-[5px]  max-w-[40px] mb-0 justify-center gap-0',
              isShowedSidebar &&
                !mobileSidebarOpen &&
                'pl-1 pr-2.5 data-[state=open]:pt-1 data-[state=closed]:pt-1 data-[state=open]:pb-1 data-[state=closed]:pb-1 hover:bg-white10 relative after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px data-[state=open]:after:bg-white10 data-[state=closed]:after:bg-transparent',
              mobileSidebarOpen &&
                'relative bg-toshi_body data-[state=open]:bg-toshi_body data-[state=closed]:mb-1.5 py-2 px-2 data-[state=open]:before:content-[""] data-[state=open]:before:absolute data-[state=open]:before:inset-0  data-[state=open]:before:pointer-events-none data-[state=open]:before:rounded-lg'
            )}
          >
            <div
              className="flex items-center gap-2.5 cursor-pointer bg-transparent flex-1 text-left"
              onClick={() => {
                if (menuItem.link) {
                  router.push(menuItem.link);
                  if (mobileSidebarOpen) {
                    dispatch(closeMobileSidebar());
                  }
                  // Close desktop sidebar with overlay when width < 1200
                  if (isShowedSidebar && width && width < 1200) {
                    dispatch(closeSidebar());
                  }
                }
              }}
            >
              <div className={cn(!isShowedSidebar && !mobileSidebarOpen && ' rounded-md p-0')}>
                <div
                  className={cn(
                    'rounded-md flex items-center justify-center ',
                    !isShowedSidebar && !mobileSidebarOpen ? 'p-0' : 'p-0'
                  )}
                >
                  {typeof menuItem.icon === 'string' ? (
                    isImageSrc(menuItem.icon) ? (
                      <Image
                        src={menuItem.icon}
                        alt={menuItem.label}
                        width={20}
                        height={20}
                        className={cn(
                          'w-6 h-6 flex items-center justify-center',
                          !isShowedSidebar && !mobileSidebarOpen
                            ? 'text-white'
                            : 'text-sidebar-icon-color group-hover:text-white'
                        )}
                      />
                    ) : (
                      <AppIcon
                        name={menuItem.icon}
                        className={cn(
                          'w-7 h-7 flex items-center justify-center',
                          !isShowedSidebar && !mobileSidebarOpen
                            ? 'text-white'
                            : 'text-sidebar-icon-color group-hover:text-white'
                        )}
                      />
                    )
                  ) : (
                    <menuItem.icon
                      className={cn(
                        '',
                        !isShowedSidebar && !mobileSidebarOpen
                          ? 'text-white'
                          : 'text-sidebar-icon-color group-hover:text-white'
                      )}
                    />
                  )}
                </div>
              </div>
              <span
                className={cn(' font-semibold text-white text-base truncate ', {
                  'border-white': isOpen,
                  'border-transparent': !isOpen,
                  hidden: !isShowedSidebar && !mobileSidebarOpen
                })}
              >
                {menuItemLabel}
              </span>
            </div>
            {(isShowedSidebar || mobileSidebarOpen) && (
              <div className="pl-3 mr-0 m-0flex h-full items-center">
                <ChevronDownIcon className="w-5 h-5 ml-3 my-2 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </div>
            )}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              // Smooth animation for all breakpoints
              'overflow-hidden transition-all will-change-[height,opacity] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
              !mobileSidebarOpen && 'pt-2 ',
              !isShowedSidebar && !mobileSidebarOpen && 'hidden',
              mobileSidebarOpen && 'mb-1.5 rounded-b-lg'
            )}
          >
            <ul className=" pt-0 ">
              {menuItem.children?.map((child, index) => {
                const isLastItem = index === (menuItem.children?.length ?? 0) - 1;
                const childLinkNormalized = normalizePath(child.link as string);
                const isChildActive =
                  !!childLinkNormalized &&
                  (pathNormalized === childLinkNormalized || pathNormalized.startsWith(childLinkNormalized + '/'));
                return (
                  <MenuItem
                    key={child.label}
                    isShowedSidebar={isShowedSidebar}
                    mobileSidebarOpen={mobileSidebarOpen}
                    isActive={isChildActive}
                    item={child}
                    isAccordionItem={true}
                    isLastAccordionItem={isLastItem}
                  />
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </li>
  );
};

export default AccordionMenuItem;
