import { ChevronDownIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import { PAGE } from '@/core/config/public-page.config';
import {
  closeMiniGameModal,
  selectCollapsedModals,
  toggleModalCollapsed
} from '@/core/redux-toolkit/slices/miniGameModalSlice';
import { Link } from '@/shared/ui/LoadingLink';
import CloseBtn from '@/shared/ui/buttons/CloseBtn';
import { formatHeader } from '@/shared/utils/gamesUtils';

const MiniGameCollapsed = () => {
  const dispatch = useDispatch();
  const modals = useSelector(selectCollapsedModals);
  return (
    <div className="fixed bottom-0 right-0 flex gap-2 z-[899] bg-bg_content">
      {modals?.map(item => {
        return (
          <div key={item.id} className="h-[35px] flex justify-between items-start py-2 px-3">
            <Link
              href={`${PAGE.CASINO_GAME(item.type.toLowerCase().replaceAll(' ', '-'))}`}
              id="modal-title"
              className="text-sm font-semibold text-white"
            >
              {formatHeader(item.type)}
            </Link>
            <div className="flex gap-0.5">
              <ChevronDownIcon
                className="text-white w-6 h-6 px-1 cursor-pointer rotate-180"
                onClick={() => dispatch(toggleModalCollapsed(Number(item.id)))}
              />
              <CloseBtn onClick={() => dispatch(closeMiniGameModal(Number(item.id)))} size="xs" className="!px-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MiniGameCollapsed;
