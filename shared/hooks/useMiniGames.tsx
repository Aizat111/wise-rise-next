'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useWindowSize } from './useWindowSize';
import { ModalItem, closeMiniGameModal } from '@/core/redux-toolkit/slices/miniGameModalSlice';
import { RootState } from '@/core/redux-toolkit/store';
import { DraggableMiniGameModal } from '@/shared/components/modal/DraggableMiniGameModal';
import MiniGameModal from '@/shared/components/modal/mini-game/MiniGameModal';

const useMiniGames = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { width } = useWindowSize();
  const modals = useSelector((state: RootState) => state.miniGameModal.modals);

  const openModals = modals?.filter((modal: ModalItem) => !modal.isCollapsed && width > 1200) || [];

  useEffect(() => {
    const currentSlug = pathname?.split('/').pop()?.toLowerCase().replaceAll(' ', '-');
    const modal = openModals.find((m: ModalItem) => m.type.toLowerCase().replaceAll(' ', '-') === currentSlug);
    if (modal) {
      dispatch(closeMiniGameModal(modal.id));
    }
  }, [pathname, dispatch]);

  return {
    modals: openModals,
    renderModals: () =>
      openModals.map((modal: ModalItem) => (
        <DraggableMiniGameModal key={modal.id} modal={modal}>
          <MiniGameModal
            type={modal.type}
            image={modal.image}
            gameSlug={modal.gameSlug}
            isViewVertical={modal.isViewVertical}
          />
        </DraggableMiniGameModal>
      ))
  };
};

export default useMiniGames;
