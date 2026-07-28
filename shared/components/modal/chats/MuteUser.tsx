import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import { Modal, ModalContent } from '../Modal';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';

type MuteUserModalProps = {
  open: boolean;
  onClose: () => void;
  username: string;
};

const MuteUserModal: FC<MuteUserModalProps> = ({ open, onClose, username }) => {
  const t = useTranslations();
  const actionMuteUser = useGraphWsFetcher<{ muteUser: { success: boolean } }>(
    GRAPHQL_TYPES.MUTE_USER_MUTATION
  ).action();
  const [muteReason, setMuteReason] = useState('');
  const onConfirmMute = async () => {
    if (!username.trim()) return;
    if (!muteReason.trim()) return;
    actionMuteUser
      .mutateAsync({
        username,
        timeout_reason: muteReason.trim()
      })
      .then(() => {
        setMuteReason('');
        onClose();
      });
  };
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      modalClassName="max-w-[420px] bg-toshi_body md:bg-[#060E20]"
      contentClassName="p-0"
    >
      <ModalContent className="p-4">
        <div className="text-white text-lg font-semibold">{t('mute_user.title')}</div>
        <div className="text-white70 text-sm mt-1">{username || 'User'}</div>

        <div className="mt-4 flex flex-col gap-3">
          <input
            type="text"
            value={muteReason}
            onChange={event => setMuteReason(event.target.value)}
            placeholder={t('mute_user.reason')}
            className="h-[44px] w-full rounded-lg border border-white10 bg-transparent px-3 text-white"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button intent="gray" appearance="solid" borderRadius="md" size="xs" onClick={onClose}>
            {t('mute_user.cancel')}
          </Button>
          <Button
            intent="red"
            appearance="claim"
            borderRadius="md"
            size="xs"
            isLoading={actionMuteUser.isPending}
            disabled={actionMuteUser.isPending || !muteReason.trim()}
            onClick={onConfirmMute}
          >
            {t('mute_user.confirm')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default MuteUserModal;
