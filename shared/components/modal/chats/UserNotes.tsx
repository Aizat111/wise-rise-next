import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import { Modal, ModalContent } from '../Modal';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { type ChatMessageV2 } from '@/shared/components/chats/partials/chat-item/ChatItemV2';
import { formatSafeDate, parseDateValue } from '@/shared/utils/chatCommands';

type UserNotesModalProps = {
  open: boolean;
  onClose: () => void;
  user: ChatMessageV2;
};

const UserNotesModal: FC<UserNotesModalProps> = ({ open, onClose, user }) => {
  const t = useTranslations();
  const actionAddUserNote = useGraphWsFetcher<{ addUserNote: { note: string; author: string; time: string } }>(
    GRAPHQL_TYPES.ADD_USER_NOTE_MUTATION
  ).action();
  const renderUserNotes = useGraphWsFetcher<{
    userNotes: Array<{ note: string; author: string; time: string }>;
  }>(GRAPHQL_TYPES.USER_NOTES_QUERY).render({
    user_id: user.user?.id || ''
  });
  const renderUserTimeouts = useGraphWsFetcher<{
    chatUserTimeouts: Array<{ id: string; reason: string; created_at: string; expires_at: string }>;
  }>(GRAPHQL_TYPES.USER_TIMEOUTS_QUERY).render({
    user_id: user.user?.id || '',
    limit: 20
  });

  const [noteInput, setNoteInput] = useState('');

  const onAddNote = async () => {
    if (!user.user?.id) return;
    if (!noteInput.trim()) return;
    actionAddUserNote
      .mutateAsync({
        user_id: user.user?.id || '',
        note: noteInput.trim()
      })
      .then(() => {
        setNoteInput('');
      });
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      modalClassName="max-w-[520px] bg-toshi_body md:bg-[#060E20]"
      contentClassName="p-0"
    >
      <ModalContent className="p-4">
        <div className="text-white text-lg font-semibold">{t('user_notes.title')}</div>
        <div className="text-white70 text-sm mt-1">{user.user?.username || 'User'}</div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={noteInput}
            onChange={event => {
              setNoteInput(event.target.value);
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') event.preventDefault();
            }}
            placeholder={t('user_notes.add_note')}
            className="h-[44px] flex-1 rounded-lg border border-white10 bg-transparent px-3 text-white"
          />
          <Button
            intent="primary"
            appearance="glossy"
            borderRadius="md"
            size="xs"
            onClick={onAddNote}
            disabled={actionAddUserNote.isPending || !noteInput.trim()}
            type="button"
          >
            {actionAddUserNote.isPending ? t('user_notes.saving') : t('user_notes.add')}
          </Button>
        </div>
        <div className="mt-4">
          <div className="text-white70 text-sm font-semibold">{t('user_notes.notes')}</div>
          <div className="mt-2 flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
            {renderUserNotes.isFetching && <div className="text-white70 text-sm">{t('user_notes.loading_notes')}</div>}
            {!renderUserNotes.isFetching && renderUserNotes.data?.userNotes.length === 0 && (
              <div className="text-white70 text-sm">{t('user_notes.no_notes')}</div>
            )}
            {renderUserNotes.data?.userNotes.map((item, idx) => (
              <div key={`${item.time}-${idx}`} className="rounded-lg border border-white10 p-2">
                <div className="text-white text-sm">{item.note}</div>
                <div className="text-white70 text-xs">
                  {item.author} • {formatSafeDate(item.time, 'MM/dd/yy hh:mm a')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-white70 text-sm font-semibold">{t('user_notes.timeout_history')}</div>
          <div className="mt-2 flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
            {renderUserTimeouts.isFetching && (
              <div className="text-white70 text-sm">{t('user_notes.loading_timeouts')}</div>
            )}
            {!renderUserTimeouts.isFetching && renderUserTimeouts.data?.chatUserTimeouts.length === 0 && (
              <div className="text-white70 text-sm">{t('user_notes.no_timeouts')}</div>
            )}
            {renderUserTimeouts.data?.chatUserTimeouts.map(item => {
              const createdAt = parseDateValue(item.created_at);
              const expiresAt = parseDateValue(item.expires_at);
              const createdAtMs = createdAt?.getTime() ?? NaN;
              const expiresAtMs = expiresAt?.getTime() ?? NaN;
              const hasValidDates = !Number.isNaN(createdAtMs) && !Number.isNaN(expiresAtMs);
              const isPermanent = hasValidDates && expiresAtMs > new Date('2999-01-01T00:00:00.000Z').getTime();
              const durationSeconds = hasValidDates ? Math.max(0, Math.round((expiresAtMs - createdAtMs) / 1000)) : 0;
              const durationLabel = isPermanent ? 'permanent' : `${durationSeconds}s`;
              return (
                <div key={item.id} className="rounded-lg border border-white10 p-2">
                  <div className="text-white text-sm">
                    {t('user_notes.timeout_history_item', {
                      date: formatSafeDate(item.created_at, 'MM/dd/yy hh:mm a'),
                      duration: durationLabel,
                      reason: item.reason
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default UserNotesModal;
