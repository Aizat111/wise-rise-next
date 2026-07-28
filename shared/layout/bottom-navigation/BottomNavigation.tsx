'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PAGE } from '@/core/config/public-page.config';
import STORAGE_KEY from '@/core/constants/storage.constants';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/core/lib/utils';
import {
  closeChat,
  closeMobileSidebar,
  closeMobileSidebarSearch,
  openChat,
  openMobileSidebar
} from '@/core/redux-toolkit/slices/uiSlice';
import type { RootState } from '@/core/redux-toolkit/store';
import { getBottomNavigationData } from '@/data/navigation';
import { ModalName } from '@/shared/components/modal/ModalManager';
import { useModalManager } from '@/shared/hooks/useModal';
import { AppIcon } from '@/shared/ui/AppIcon';
import storage from '@/shared/utils/storage';

export default function BottomNavigation() {
  const pathname = usePathname();
  const t = useTranslations();
  const dispatch = useDispatch();
  const mobileOpen = useSelector((state: RootState) => state.ui.mobileSidebarOpen);
  const chatOpen = useSelector((state: RootState) => state.ui.chatOpen);
  const { openModal, allModals, closeModal } = useModalManager();
  const [depositCurrency, setDepositCurrency] = useState('SOL');
  const isChatActive = pathname?.includes(PAGE.CHATS) && chatOpen;
  const isProcessingChatRef = useRef(false);

  useEffect(() => {
    const saved = storage?.getItem(STORAGE_KEY.DEPOSIT_CURRENCY);
    if (saved) setDepositCurrency(saved);
  }, []);

  const bottomNavigationData = useMemo(() => getBottomNavigationData(depositCurrency), [depositCurrency]);

  return (
    <div className="md:hidden fixed flex flex-col justify-center bottom-0 left-0 right-0 z-[1300] bg-bg_content border-t border-linebreak">
      <div className="flex items-center h-full w-full">
        {bottomNavigationData.map(item => {
          const isActive = pathname?.includes(item.link || '');
          const isBrowser = item.label === 'browser' && !item.link;
          const isChat = item.link === PAGE.CHATS;
          if (isBrowser) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (mobileOpen) {
                    dispatch(closeMobileSidebar());
                    dispatch(closeMobileSidebarSearch());
                  } else {
                    dispatch(closeMobileSidebarSearch());
                    dispatch(openMobileSidebar());
                    dispatch(closeChat());
                  }
                }}
                className={cn(
                  'flex flex-col h-full items-center pt-2 pb-2 justify-center gap-1 flex-1 transition-all',
                  mobileOpen ? 'border-t border-primary-500 bg-white10' : 'text-white60 hover:text-white'
                )}
              >
                {typeof item.icon === 'string' ? <AppIcon name={item.icon} /> : <item.icon className="" />}
                <span className="text-xs text-white70 font-xs">{t(item.label)}</span>
              </button>
            );
          }
          if (item.action && item.action.modal) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  const modalState = allModals?.[item?.action?.modal as ModalName];
                  const isOpen = Array.isArray(modalState)
                    ? modalState.some(modal => modal.isOpen)
                    : modalState?.isOpen;

                  if (isOpen) {
                    closeModal(item?.action?.modal as ModalName);
                  } else {
                    openModal(item?.action?.modal as ModalName, item?.action?.type, item?.action?.modalProps);
                  }
                }}
                className={cn(
                  'flex flex-col h-full items-center  pt-2 pb-2  justify-center gap-1 flex-1 transition-all',
                  (() => {
                    const modalState = allModals?.[item?.action?.modal as ModalName];
                    const isOpen = Array.isArray(modalState)
                      ? modalState.some(modal => modal.isOpen)
                      : modalState?.isOpen;
                    return isOpen;
                  })()
                    ? 'border-t border-primary-500 bg-white10'
                    : 'text-white60 hover:text-white'
                )}
              >
                {typeof item.icon === 'string' ? <AppIcon name={item.icon} /> : <item.icon className="" />}
                <span className="text-xs text-white70 font-xs">{t(item.label)}</span>
              </button>
            );
          }

          if (isChat) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  // Prevent rapid clicks
                  if (isProcessingChatRef.current) return;
                  isProcessingChatRef.current = true;

                  // Always close browse menu first when opening/closing chat
                  if (mobileOpen) {
                    dispatch(closeMobileSidebar());
                    dispatch(closeMobileSidebarSearch());
                  }

                  // Simple toggle - no navigation
                  if (chatOpen) {
                    dispatch(closeChat());
                  } else {
                    dispatch(openChat());
                  }

                  // Release processing lock after a short delay
                  setTimeout(() => {
                    isProcessingChatRef.current = false;
                  }, 300);
                }}
                className={cn(
                  'flex flex-col h-full items-center pt-2 pb-2 justify-center gap-1 flex-1 transition-all',
                  isChatActive ? 'border-t border-primary-500 bg-white10' : 'text-white60 hover:text-white'
                )}
              >
                {typeof item.icon === 'string' ? <AppIcon name={item.icon} /> : <item.icon className="" />}
                <span className="text-xs text-white70 font-xs">{t(item.label)}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.link || ''}
              className={cn(
                'pt-2 pb-2 flex flex-col h-full items-center justify-center gap-1 flex-1 transition-all duration-200',
                isActive && !mobileOpen ? 'border-t border-primary-500 bg-white10' : 'text-white60 hover:text-white'
              )}
              onClick={() => {
                if (mobileOpen) {
                  dispatch(closeMobileSidebar());
                }
              }}
            >
              {typeof item.icon === 'string' ? <AppIcon name={item.icon} /> : <item.icon className="" />}
              <span className="text-xs text-white70 font-xs">{t(item.label)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
