'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { cn } from '@/core/lib/utils';
import type { RootState } from '@/core/redux-toolkit/store';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import Image from '@/shared/ui/Images/Image';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';

declare global {
  interface Window {
    intercomSettings?: any;
    Intercom?: any;
  }
}

const APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || '';

export function Intercom() {
  const isShowedSidebar = useSelector((state: RootState) => state.ui.sidebarOpen);
  const { modals } = useSelector((state: RootState) => state.miniGameModal);
  const user = useSelector((state: RootState) => state.user.user);
  const { width } = useWindowSize();

  const loadedRef = useRef(false);
  const pendingShowRef = useRef(false);

  // Intercom settings güncelle; zaten boot edildiyse çalışan instance'ı da bilgilendir
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.intercomSettings = {
      app_id: APP_ID,
      username: user?.username,
      email: user?.email,
      horizontal_padding: isShowedSidebar ? 20 : 236,
      hide_default_launcher: true
    };

    if (loadedRef.current && typeof window.Intercom === 'function') {
      window.Intercom('update', window.intercomSettings);
    }
  }, [isShowedSidebar, user]);

  const loadIntercom = useCallback(() => {
    if (loadedRef.current || typeof window === 'undefined' || !APP_ID) return;

    const w = window;
    const ic = w.Intercom;

    // Script zaten yüklenmiş ama reattach gerekiyor
    if (typeof ic === 'function' && ic.booted) {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
      loadedRef.current = true;

      if (pendingShowRef.current) {
        pendingShowRef.current = false;
        setTimeout(() => w.Intercom?.('show'), 300);
      }
      return;
    }

    // Intercom bootstrap stub — script henüz DOM'da yok
    if (typeof ic !== 'function') {
      const d = document;
      const i: any = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args: any) {
        i.q.push(args);
      };
      w.Intercom = i;

      const s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://widget.intercom.io/widget/${APP_ID}`;

      s.onload = () => {
        if (typeof w.Intercom === 'function') {
          // Önce boot, sonra show — sıra önemli
          w.Intercom('boot', w.intercomSettings);
          loadedRef.current = true;

          const shouldShow = pendingShowRef.current || window.location.pathname.includes('/livesupport');

          if (shouldShow) {
            pendingShowRef.current = false;
            setTimeout(() => w.Intercom?.('show'), 500);
          }
        }
      };

      s.onerror = () => {
        pendingShowRef.current = false;
      };

      const x = d.getElementsByTagName('script')[0];
      x?.parentNode?.insertBefore(s, x);
    }
  }, []);

  // Sayfa tamamen yüklendikten sonra arka planda scripti hazırla
  useEffect(() => {
    if (typeof window === 'undefined' || !APP_ID) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const onLoad = () => {
      timeoutId = setTimeout(() => {
        loadIntercom();
      }, 5000);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      window.removeEventListener('load', onLoad);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loadIntercom]);

  if (width < 768) return null;

  return (
    <CustomTooltip label="Live Support">
      <div
        aria-hidden="true"
        className={cn(
          'w-[50px] h-[50px] p-4 fixed bottom-5 right-5 z-7 bg-bg_menu rounded-md flex items-center justify-center cursor-pointer transition-transform duration-300 transform-translateY-[30px]',
          modals.some(modal => modal.isCollapsed) && 'bottom-10'
        )}
        onClick={() => {
          if (loadedRef.current) {
            window.Intercom?.('show');
          } else {
            pendingShowRef.current = true;
            loadIntercom();
          }
        }}
      >
        <Image src="/assets/svgs/intercom.svg" width={16} height={16} alt="Intercom icon" />
      </div>
    </CustomTooltip>
  );
}

export default Intercom;
