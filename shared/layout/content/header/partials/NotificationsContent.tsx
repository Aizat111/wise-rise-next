import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import { useAppDispatch, useAppSelector } from '@/core/redux-toolkit/hooks';
import { markAllAsRead } from '@/core/redux-toolkit/slices/notificationSlice';
import Card from '@/shared/components/card/Card';
import Notification from '@/shared/components/notifications/Notification';

const NotificationsContent = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading, error } = useAppSelector(state => state.notifications);

  const { action: markAllAsReadAction } = useFetcher(TYPES.MARK_ALL_NOTIFICATIONS_READ);
  const { mutate: markAllAsReadMutate } = markAllAsReadAction();

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
    markAllAsReadMutate(
      {},
      {
        onSuccess: () => {},
        onError: () => {}
      }
    );
  };

  return (
    <Card className="w-[344px] max-sm:w-[280px] min-w-0 p-4 shadow-[1px_1px_1px_0px_#FFFFFF1F_inset]">
      <div className="flex flex-row gap-2 justify-between mb-2">
        <p className="text-white">Notifications</p>
        {unreadCount > 0 && (
          <button
            className="text-white70 text-sm cursor-pointer hover:text-white transition-colors bg-transparent border-0 p-0"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-white70">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-8 gap-2">
            <p className="text-white70">No notifications yet</p>
            <p className="text-white50 text-xs">We'll notify you when something important happens!</p>
          </div>
        ) : (
          notifications.map(notification => <Notification key={notification.id} notification={notification} />)
        )}
      </div>
    </Card>
  );
};

export default NotificationsContent;
