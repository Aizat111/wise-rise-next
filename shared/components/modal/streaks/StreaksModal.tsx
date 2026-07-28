'use client';

import { useTranslations } from 'next-intl';
import { type FC } from 'react';

import { Modal } from '../Modal';

import StreaksSection from '@/screens/streaks/StreaksSection';

export interface StreaksModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props: Record<string, unknown>;
}

// Route-driven modal — opened by `usePathnameChange` when the user lands
// on `/streaks`, and closed back to `/` by `ModalManager.handleCloseModal`.
// Content is the existing `StreaksSection`; only the page-level container
// (padding + max-width) is stripped so it fits inside the modal shell.
const StreaksModal: FC<StreaksModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape
      closeOnOverlayClick
      size="2xl"
      variant="default"
      header={t('streaks.title')}
      headerClassName="uppercase font-byrd text-base font-semibold"
      // Cap the desktop modal at 500px. `max-w-[500px]` is intentionally
      // applied via modalClassName so it wins over the size="2xl" default
      // through tailwind-merge (later utilities override earlier ones in
      // the cn() chain inside the Modal primitive). Mobile stays w-full.
      //
      // `flex flex-col` turns the Modal primitive's outer container into
      // a flex column so the internal content wrapper's `flex-1` actually
      // works. Without it the content div ignores flex-1, grows to its
      // natural height, and the parent's `max-h-[90vh] overflow-hidden`
      // clips the tail — long streak content (hero + week + milestones +
      // info box) exceeds 90vh at 500px width and the bottom is hidden.
      // With flex-col the content wrapper fills remaining space under the
      // header and its existing `overflow-y-scroll no-scrollbar` scrolls
      // silently. Scoped to StreaksModal — the shared primitive is
      // untouched so other modals keep their current behaviour.
      modalClassName="bg-toshi_body max-w-[500px] flex flex-col"
      contentClassName="px-4 py-4 md:px-6 md:py-6 no-scrollbar"
    >
      <StreaksSection />
    </Modal>
  );
};

export default StreaksModal;
