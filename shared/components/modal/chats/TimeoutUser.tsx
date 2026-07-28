import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import { Modal, ModalContent } from '../Modal';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';

type TimeoutUserProps = {
  username: string;
  open: boolean;
  onClose: () => void;
};

const TimeoutUserModal: FC<TimeoutUserProps> = ({ username, open, onClose }) => {
  const t = useTranslations();
  const timeoutUserMutation = useGraphWsFetcher<{ timeoutUser: { success: boolean } }>(
    GRAPHQL_TYPES.TIMEOUT_USER_MUTATION
  ).action();
  const [timeoutSeconds, setTimeoutSeconds] = useState(60);
  const [timeoutReason, setTimeoutReason] = useState('');
  const onConfirmTimeout = async () => {
    const seconds = Math.max(1, Math.round(Number(timeoutSeconds)));
    if (!seconds || Number.isNaN(seconds)) return;
    if (!timeoutReason.trim()) return;
    timeoutUserMutation
      .mutateAsync({
        username,
        timeout_seconds: seconds,
        timeout_reason: timeoutReason.trim()
      })
      .then(() => {
        setTimeoutReason('');
        setTimeoutSeconds(60);
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
        <div className="text-white text-lg font-semibold">{t('timeout_user.title')}</div>
        <div className="text-white70 text-sm mt-1">{username || 'User'}</div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-2">
            {[
              { label: '1 hour', seconds: 3600 },
              { label: '1 week', seconds: 604800 },
              { label: '1 month', seconds: 2592000 }
            ].map(({ label, seconds }) => (
              <button
                key={seconds}
                type="button"
                onClick={() => setTimeoutSeconds(seconds)}
                className={`flex-1 h-[36px] rounded-lg border text-sm font-medium transition-colors ${
                  timeoutSeconds === seconds
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-white10 bg-transparent text-white70 hover:border-white30 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            value={timeoutSeconds}
            onChange={event => setTimeoutSeconds(event.target.valueAsNumber)}
            placeholder={t('timeout_user.duration')}
            className="h-[44px] w-full rounded-lg border border-white10 bg-transparent px-3 text-white"
          />
          <input
            type="text"
            value={timeoutReason}
            onChange={event => setTimeoutReason(event.target.value)}
            placeholder={t('timeout_user.reason')}
            className="h-[44px] w-full rounded-lg border border-white10 bg-transparent px-3 text-white"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button intent="gray" appearance="solid" borderRadius="md" size="xs" onClick={onClose}>
            {t('timeout_user.cancel')}
          </Button>
          <Button
            intent="green"
            appearance="claim"
            borderRadius="md"
            size="xs"
            isLoading={timeoutUserMutation.isPending}
            disabled={timeoutUserMutation.isPending || !timeoutReason.trim() || !timeoutSeconds}
            onClick={onConfirmTimeout}
          >
            {t('timeout_user.confirm')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default TimeoutUserModal;
