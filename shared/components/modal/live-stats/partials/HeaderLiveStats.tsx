import { ChartLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';

import { toggleLiveStats } from '@/core/redux-toolkit/slices/modalSlice';
import CloseBtn from '@/shared/ui/buttons/CloseBtn';

const HeaderLiveStats = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  return (
    <div className="h-[43px] bg-toshi_body flex justify-between items-center py-2 px-3 border-b-2  border-linebreak cursor-grab active:cursor-grabbing pointer-events-auto">
      <div className="flex items-center gap-2">
        <ChartLine className="h-5" />
        <h2 className="text-base uppercase font-byrd text-white">{t('live_stats')}</h2>
      </div>

      <CloseBtn
        size="xs"
        className="p-2 z-[1550]"
        onClick={() => {
          dispatch(toggleLiveStats());
        }}
      />
    </div>
  );
};

export default HeaderLiveStats;
