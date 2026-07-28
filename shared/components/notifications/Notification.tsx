'use client';

import { useRouter } from 'next/navigation';
import type { FC } from 'react';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { useAppDispatch } from '@/core/redux-toolkit/hooks';
import { markAsRead } from '@/core/redux-toolkit/slices/notificationSlice';
import { INotification } from '@/core/types/user.types';

interface NotificationProps {
  notification: INotification;
}

export const Notification: FC<NotificationProps> = ({ notification }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { action: markAsReadAction } = useFetcher(TYPES.MARK_NOTIFICATION_READ);
  const { mutate: markAsReadMutate } = markAsReadAction();

  const handleClick = () => {
    if (!notification.is_read) {
      dispatch(markAsRead(notification.id));
      markAsReadMutate([{}, [notification.id]], {
        onSuccess: () => {},
        onError: () => {}
      });
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  return (
    <button
      className="flex flex-col gap-1 bg-bg_menu rounded-xl p-2.5 pl-3 cursor-pointer hover:bg-gray_lightest transition-colors text-left w-full border-0"
      onClick={handleClick}
      style={{
        borderLeft: notification.is_read ? 'none' : '3px solid #E18314'
      }}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="text-white font-semibold text-sm flex-1">{notification.title}</p>
        {!notification.is_read && (
          <span className="bg-primary text-xs px-2 py-0.5 rounded-full text-white70 font-semibold">New</span>
        )}
      </div>
      <p className="text-white70 font-semibold text-sm">{notification.message}</p>
      <p className="text-white50 text-xs">{getTimeAgo(notification.created_at)}</p>
    </button>
  );
};

export default Notification;
