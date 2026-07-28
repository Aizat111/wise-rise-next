import { memo, useMemo } from 'react';

import { MenuItem } from './MenuItem';
import { getProfileMenuData } from '@/core/constants/profile-menu.constants';
import Card from '@/shared/components/card/Card';
import LevelTrackingCard from '@/shared/components/card/LevelTrackingCard';

interface ProfileContentProps {
  onClose: () => void;
}

const ProfileContent = memo(({ onClose }: ProfileContentProps) => {
  const PROFILE_MENU_DATA = useMemo(() => getProfileMenuData(), []);

  return (
    <Card className="@[768px]:w-[344px] max-w-[300px] threed-empty rounded-2xl mt-2 min-w-0 md:p-4 p-2 md:gap-4 gap-2 max-md:w-[calc(100vw-2rem)]  touch-manipulation">
      <LevelTrackingCard onClose={onClose} />

      <ul className="flex flex-col gap-1">
        {PROFILE_MENU_DATA.map((item, index) => (
          <MenuItem
            item={item}
            key={`${item?.label}-${index}`}
            isActive={false}
            isShowedSidebar={false}
            mobileSidebarOpen={false}
            onClose={onClose}
          />
        ))}
      </ul>
    </Card>
  );
});

ProfileContent.displayName = 'ProfileContent';

export default ProfileContent;
