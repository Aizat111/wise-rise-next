import { useEffect } from 'react';

import { useUserSocket } from './sockets/useUserSocket';
import { useAppDispatch } from '@/core/redux-toolkit/hooks';
import { addNotification } from '@/core/redux-toolkit/slices/notificationSlice';
import type { INotification } from '@/core/types/user.types';

export const useNotificationSocket = () => {
  const dispatch = useAppDispatch();
  const { connected, on, off } = useUserSocket();

  useEffect(() => {
    if (!connected) return;

    const handleNewNotification = (data: INotification) => {
      dispatch(addNotification(data));
    };

    on('notification:new', handleNewNotification);

    return () => {
      off('notification:new', handleNewNotification);
    };
  }, [connected, on, off, dispatch]);
};
