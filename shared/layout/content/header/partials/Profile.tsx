import { Button } from '@investorcentretb/toshi-ui';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import ProfileContent from './ProfileContent';
import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import {
  setBonusStatus,
  setBonusUpdate,
  setCalendar,
  setDDBalance,
  setDDProgress,
  setDDTarget,
  setNewCalendarItem,
  setRewardInfo,
  setUserProgressInitial
} from '@/core/redux-toolkit/slices/userProgressSlice';
import { store } from '@/core/redux-toolkit/store';
import { BonusStatusResponse, ICalendarItem, RewardsDataResponse, UserBonusUpdate } from '@/core/types/rewards';
import { IUserDDProgressResponse, IUserLevelsXPResponse } from '@/core/types/user.types';
import { User as ProfileUser } from '@/shared/assets/profiledropdown';
import { useUserSocket } from '@/shared/hooks/sockets/useUserSocket';
import Dropdown from '@/shared/ui/dropdowns/Dropdown';

const Profile = () => {
  const dispatch = useDispatch();
  const { connected, on, off } = useUserSocket();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isSuccess } = useFetcher<IUserLevelsXPResponse>(TYPES.GET_USER_LEVELS_XP).render();
  const processingItemIds = new Set();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserProgressInitial(data));
    }
  }, [isSuccess, data]);
  useEffect(() => {
    if (connected) {
      on('user:bonuses', (response: BonusStatusResponse) => {
        dispatch(setBonusStatus(response));
      });
      on('user:bonusUpdate', (response: UserBonusUpdate) => {
        dispatch(setBonusUpdate(response));
      });
      on('user:rewardInfo', (response: RewardsDataResponse) => {
        dispatch(setRewardInfo(response));
      });
      on('user:ddProgress', (response: IUserDDProgressResponse) => {
        dispatch(setDDProgress(response.progress));
        dispatch(setDDTarget(response.target));
      });
      on('user:ddBalance', (response: { balance: number }) => {
        dispatch(setDDBalance(response.balance));
      });
      on('user:newCalendarItem', (response: Record<string, ICalendarItem>) => {
        const responseData = Object.values(response)[0];
        const rewardDate = Object.keys(response)[0];

        if (!processingItemIds.has(responseData.id)) {
          const rewardExists = store
            .getState()
            .userProgress.calendar[rewardDate]?.find(item => item.id === responseData.id);

          if (!rewardExists) {
            processingItemIds.add(responseData.id);

            dispatch(setNewCalendarItem(response));
          }
        }
      });
      on('user:calendar', (response: Record<string, ICalendarItem[]>) => {
        dispatch(setCalendar(response));
      });
    }
    return () => {
      off('user:bonuses');
      off('user:bonusUpdate');
      off('user:rewardInfo');
      off('user:ddProgress');
      off('user:newCalendarItem');
    };
  }, [connected, on, off]);

  return (
    <Dropdown
      trigger={
        <Button
          intent="gray"
          appearance="3d"
          className="max-md:w-8 max-md:h-8 w-10 h-10"
          borderRadius="md"
          icon={<ProfileUser className="w-7 h-7" />}
        ></Button>
      }
      content={<ProfileContent onClose={closeDropdown} />}
      open={isOpen}
      onOpenChange={handleOpenChange}
    />
  );
};

export default Profile;
