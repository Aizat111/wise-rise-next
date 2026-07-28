'use client';

// import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';

import { SidebarMobileHeader } from './header/SidebarMobileHeader';
import { SidebarMenu } from './menus/SidebarMenu';
import { cn } from '@/core/lib/utils';
import { closeMobileSidebarSearch, setMobileSidebarSearchToggle } from '@/core/redux-toolkit/slices/uiSlice';
import type { RootState } from '@/core/redux-toolkit/store';
import { MOBILE_SIDEBAR_DATA } from '@/data/navigation';
import MobileSearchOverlay from '@/shared/components/modal/search/MobileSearchOverlay';
import Input from '@/shared/ui/inputs/Input';

export function MobileSidebar() {
  const dispatch = useDispatch();
  const t = useTranslations();
  const isOpen = useSelector((state: RootState) => state.ui.mobileSidebarOpen);
  const mobileSidebarSearchOpen = useSelector((state: RootState) => state.ui.mobileSidebarSearchOpen);

  return (
    <div
      className={cn(
        'md:hidden fixed inset-0 z-[900] p-3 transition-transform duration-300',
        isOpen ? 'translate-y-14' : 'translate-y-full'
      )}
      aria-hidden={false}
    >
      <div className="absolute bottom-0  no-scrollbar left-0 right-0 top-0 bg-bg_content rounded-t-2xl p-6 overflow-y-auto">
        <div className="max-w-[660px] gap-4 flex flex-col mx-auto pt-2">
          <Input
            placeholder={t('search_games')}
            className="w-full"
            size="lg"
            onClick={() => dispatch(setMobileSidebarSearchToggle())}
            inputClassName="mb-1.25 cursor-text max-w-none text-sm @[768px]:text-base text-white   bg-lightgrey border-white/10  1px solid rgba(255, 255, 255, 0.1)"
          />
          <SidebarMobileHeader />
          <SidebarMenu menu={MOBILE_SIDEBAR_DATA} />
        </div>

        <div className="h-[100px]" />
      </div>
      <MobileSearchOverlay open={mobileSidebarSearchOpen} onClose={() => dispatch(closeMobileSidebarSearch())} />
    </div>
  );
}

export default MobileSidebar;
