import { Button } from '@investorcentretb/toshi-ui';

import NotificationsContent from './NotificationsContent';
import NotificationsIcon from '@/shared/assets/header/Notifications';
import Dropdown from '@/shared/ui/dropdowns/Dropdown';

const Notifications = () => {
  return (
    <Dropdown
      trigger={
        <Button
          intent="gray"
          appearance="3d"
          className=" w-10 h-10"
          borderRadius="md"
          icon={<NotificationsIcon className="w-7 h-7" />}
        ></Button>
      }
      content={<NotificationsContent />}
    />
  );
};

export default Notifications;
