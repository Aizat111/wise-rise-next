import { useDispatch, useSelector } from 'react-redux';

import { closeAllModals, closeModal, openModal } from '@/core/redux-toolkit/slices/modalSlice';
import type { RootState } from '@/core/redux-toolkit/store';
import type { ModalName } from '@/shared/components/modal/ModalManager';

export const useModalManager = () => {
  const dispatch = useDispatch();
  const allModals = useSelector((state: RootState) => state.modals.modals);

  const openModalAction = (modalName: ModalName, type?: string, props?: Record<string, any>, id?: string) => {
    // Temporarily disable claimNotification modal until fixed
    if (modalName === 'claimNotification') {
      return;
    }
    dispatch(openModal({ modalName, type, props, id }));
  };

  const closeModalAction = (modalName: ModalName, id?: string) => {
    dispatch(closeModal({ modalName, id }));
  };

  const closeAllModal = () => {
    dispatch(closeAllModals());
  };

  const getOpenModals = () => {
    if (!allModals) return [];
    return Object.entries(allModals)?.filter(([_, modalState]) => {
      if (Array.isArray(modalState)) {
        return modalState.some(modal => modal.isOpen);
      }
      return modalState?.isOpen;
    });
  };

  const hasOpenModals = () => {
    if (!allModals) return false;
    return Object.values(allModals).some(modalState => {
      if (Array.isArray(modalState)) {
        return modalState.some(modal => modal.isOpen);
      }
      return modalState?.isOpen;
    });
  };

  return {
    allModals,
    openModal: openModalAction,
    closeModal: closeModalAction,
    closeAllModal,
    getOpenModals,
    hasOpenModals
  };
};
