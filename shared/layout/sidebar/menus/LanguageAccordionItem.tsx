'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';

import { usePathname, useRouter } from '@/core/i18n/navigation';
import { cn } from '@/core/lib/utils';
import { closeMobileSidebar, closeSidebar, openSidebar } from '@/core/redux-toolkit/slices/uiSlice';
import type { IMenuItemProps } from '@/core/types/menu.types';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { AppIcon } from '@/shared/ui/AppIcon';
import Image from '@/shared/ui/Images/Image';
import { AccordionTrigger as UIAccordionTrigger } from '@/shared/ui/accordions/Accordion';

export default function LanguageAccordionItem({ item, isActive, isShowedSidebar, mobileSidebarOpen }: IMenuItemProps) {
  const { width } = useWindowSize();
  const language = useLocale();
  const dispatch = useDispatch();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const languageItemLabel = t(item.label) || item.label;

  const switchLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
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

  return (
    <li>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value={item.language || 'en'}>
          <UIAccordionTrigger
            unstyled
            collapseOpenEffect={false}
            aria-label={languageItemLabel}
            title={languageItemLabel}
            className={cn(
              'group flex items-center justify-between gap-2 w-full p-0.5 rounded-b-none rounded-t-lg text-left bg-transparent text-white  ',
              !isShowedSidebar && !mobileSidebarOpen && 'p-0 py-[5px] ',
              isShowedSidebar &&
                !mobileSidebarOpen &&
                'pl-1 pr-2.5 pt-1 data-[state=open]:pt-1 data-[state=closed]:pt-1 pb-1 hover:bg-white10 relative after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px data-[state=open]:after:bg-white10 data-[state=closed]:after:bg-transparent',
              mobileSidebarOpen && 'bg-toshi_body data-[state=closed]:mb-1.5 py-2 px-2'
            )}
            onClick={() => {
              if (width > 768) {
                dispatch(openSidebar());
              }
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className={cn(!isShowedSidebar && !mobileSidebarOpen && 'rounded-md p-0')}>
                <div
                  className={cn(
                    'rounded-md flex items-center justify-center',
                    !isShowedSidebar && !mobileSidebarOpen ? 'p-0' : 'p-0',
                    ' data-[state=open]:bg-[rgba(255,97,0,0.23)]'
                  )}
                >
                  {typeof item.icon === 'string' ? (
                    isImageSrc(item.icon) ? (
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={cn(
                          ' flex items-center justify-center',
                          !isShowedSidebar && !mobileSidebarOpen
                            ? 'text-white'
                            : 'text-sidebar-icon-color group-hover:text-white'
                        )}
                      />
                    ) : (
                      <AppIcon
                        name={item.icon}
                        className={cn(
                          ' flex items-center justify-center',
                          !isShowedSidebar && !mobileSidebarOpen
                            ? 'text-white'
                            : 'text-sidebar-icon-color group-hover:text-white'
                        )}
                      />
                    )
                  ) : (
                    <item.icon
                      className={cn(
                        'transition',
                        !isShowedSidebar && !mobileSidebarOpen
                          ? 'text-white'
                          : 'text-sidebar-icon-color group-hover:text-white'
                      )}
                    />
                  )}
                </div>
              </div>
              <span
                className={cn('border-b text-white text-base font-semibold truncate', {
                  'border-white': isActive,
                  'border-transparent': !isActive,
                  hidden: !isShowedSidebar && !mobileSidebarOpen
                })}
              >
                {languageItemLabel}
              </span>
            </div>
            {(isShowedSidebar || mobileSidebarOpen) && (
              <ChevronDownIcon className="w-5 h-5 my-2 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            )}
          </UIAccordionTrigger>
          <Accordion.Content
            className={cn(
              // smooth open/close using height and subtle opacity
              'pt-2 overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up transition-all will-change-[height,opacity] data-[state=open]:rounded-b-lg',
              !isShowedSidebar && !mobileSidebarOpen && 'hidden',
              mobileSidebarOpen && 'pt-0 bg-gray-500 mb-1.5'
            )}
          >
            <div
              className={cn(
                'flex flex-col gap-1 p-0 rounded-b-lg',
                isShowedSidebar && !mobileSidebarOpen && '',
                mobileSidebarOpen && 'bg-toshi_body pt-2 pr-3'
              )}
            >
              <ul className="   ">
                {item?.children?.map((child: any) => {
                  return (
                    <li
                      className="pl-[40px]  pr-3 py-1  hover:bg-white10 flex items-center justify-between gap-2"
                      key={child.language}
                    >
                      <div className="flex items-center gap-2 cursor-pointer">
                        <span
                          className={cn('  pl-1 text-base min-h-[28px] truncate', {
                            'border-white': isActive,
                            'border-transparent': !isActive
                          })}
                        >
                          {child.label}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`language-${item.language}`}
                          value={child.language}
                          checked={child.language === language}
                          aria-label={child.label}
                          className="peer appearance-none h-4 w-4 rounded-full border border-gray-400 bg-transparent transition-all duration-200"
                          onClick={e => e.stopPropagation()}
                          onChange={e => {
                            e.stopPropagation();
                            switchLocale(child.language || '');
                          }}
                        />
                        <span
                          className="
                                  absolute left-0 top-0 h-4 w-4 rounded-full
                                  peer-checked:bg-green-500
                                  peer-checked:border-2
                                  peer-checked:border-gray-500
                                  peer-checked:outline
                                  peer-checked:outline-[1px]
                                  peer-checked:outline-green-500
                                  transition-all duration-200"
                        />
                      </label>
                    </li>
                  );
                })}
                <li className="pt-2 pb-1 px-2" aria-hidden="true">
                  <hr className="border-white10 " />
                </li>
              </ul>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </li>
  );
}
