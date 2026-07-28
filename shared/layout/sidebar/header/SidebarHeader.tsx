'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/core/lib/utils';
import { toggleSidebar } from '@/core/redux-toolkit/slices/uiSlice';
import type { RootState } from '@/core/redux-toolkit/store';
import ArrowLeftIcon from '@/shared/assets/sidebar/ArrowLeft';

export function SidebarHeader() {
  // const t = useTranslations();
  const dispatch = useDispatch();
  const isShowedSidebar = useSelector((state: RootState) => state.ui.sidebarOpen);
  // const pathname = usePathname();
  // const router = useRouter();
  // const isCasino = pathname.includes('casino');
  // const isSports = pathname.includes('sports');
  return (
    <div className="flex items-center gap-2 h-[52px] mb-4 w-full p-0 ">
      <Button
        intent="gray"
        onClick={() => dispatch(toggleSidebar())}
        appearance="3d"
        iconOnly
        id="sidebar-header-button"
        key="sidebar-header-button"
        icon={<ArrowLeftIcon width={20} height={20} className={cn(!isShowedSidebar && 'rotate-180')} />}
        className="w-10 h-10 justify-center transition-transform duration-300 px-1"
        borderRadius="md"
      />
      {/* {isShowedSidebar && (
        <>
          <Button
            id="sidebar-header-button-casino"
            intent="gray"
            appearance="solid"
            className="w-[95px] !px-1"
            isActive={isCasino}
            activeAppearance="outline"
            activeIntent="primary"
            onClick={() => router.push(PAGE.CASINO)}
          >
            {t('casino')}
          </Button>
          <Button
            id="sidebar-header-button-sports"
            intent="gray"
            appearance="solid"
            className="w-[95px] px-1"
            onClick={() => router.push(PAGE.SPORTS)}
            isActive={isSports}
          >
            {t('sports')}
          </Button>
        </>
      )} */}
    </div>
  );
}
