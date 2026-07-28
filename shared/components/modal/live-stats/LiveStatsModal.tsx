import LiveStats from './LiveStats';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { RootState } from '@/core/redux-toolkit/store';

const LiveStatsModal = () => {
  const liveStats = useAppSelector((state: RootState) => state.modals.liveStats);
  if (!liveStats.isOpen) return null;
  return <LiveStats />;
};

export default LiveStatsModal;
