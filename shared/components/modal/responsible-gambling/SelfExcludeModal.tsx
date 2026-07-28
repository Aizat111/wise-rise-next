'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Modal, ModalContent } from '../Modal';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { logoutUser } from '@/core/redux-toolkit/slices/userSlice';

interface SelfExcludeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DURATIONS: Array<{ value: string; labelKey: string }> = [
  { value: 'm6', labelKey: 'responsible_gambling.durations.m6' },
  { value: 'y1', labelKey: 'responsible_gambling.durations.y1' },
  { value: 'y2', labelKey: 'responsible_gambling.durations.y2' },
  { value: 'y3', labelKey: 'responsible_gambling.durations.y3' },
  { value: 'y4', labelKey: 'responsible_gambling.durations.y4' },
  { value: 'y5', labelKey: 'responsible_gambling.durations.y5' },
  { value: 'y10', labelKey: 'responsible_gambling.durations.y10' },
  { value: 'indefinite', labelKey: 'responsible_gambling.durations.indefinite' }
];

type Step = 'pick' | 'confirm';

const getErrorMessage = (error: Error): string => {
  const serverMessage =
    (error as unknown as { response?: { errors?: Array<{ message?: string }> } }).response?.errors?.[0]?.message ?? '';

  if (serverMessage.includes('rate_limited')) {
    return 'responsible_gambling.errors.rate_limited';
  }
  if (serverMessage.startsWith('already_active')) {
    return 'responsible_gambling.errors.already_active';
  }
  return 'responsible_gambling.errors.generic';
};

const SelfExcludeModal = ({ isOpen, onClose }: SelfExcludeModalProps) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useRouter();
  const [step, setStep] = useState<Step>('pick');
  const [duration, setDuration] = useState<string | null>(null);
  const [ack, setAck] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useGraphWsFetcher(GRAPHQL_TYPES.SELF_EXCLUDE_MUTATION).action();

  const reset = () => {
    setStep('pick');
    setDuration(null);
    setAck(false);
    setError(null);
  };

  const handleClose = () => {
    if (mutation.isPending) return;
    reset();
    onClose();
  };

  const handleNext = () => {
    if (!duration) return;
    setError(null);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!duration || !ack) return;
    setError(null);
    mutation.mutate(
      { duration },
      {
        onSuccess: () => {
          dispatch(logoutUser());
          reset();
          onClose();
          router.replace('/');
        },
        onError: (err: Error) => {
          setError(getErrorMessage(err));
        }
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="sm"
      variant="default"
      header={t('responsible_gambling.self_exclusion.modal_header')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        {step === 'pick' && (
          <div className="flex flex-col gap-3">
            <p className="text-white70 text-sm">{t('responsible_gambling.self_exclusion.modal_intro')}</p>
            <div className="grid grid-cols-2 gap-2">
              {DURATIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setDuration(opt.value);
                    setError(null);
                  }}
                  className={`rounded-md border py-2 text-sm font-semibold transition-colors ${
                    duration === opt.value
                      ? 'border-red-400 bg-red-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-white70 hover:border-white/30'
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Button appearance="solid" intent="gray" className="w-full" onClick={handleClose}>
                {t('cancel')}
              </Button>
              <Button appearance="glossy" intent="red" className="w-full" onClick={handleNext} disabled={!duration}>
                {t('next')}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && duration && (
          <div className="flex flex-col gap-4">
            <p className="text-white font-semibold text-center">
              {t('responsible_gambling.self_exclusion.confirm_text', {
                duration: t(`responsible_gambling.durations.${duration}`)
              })}
            </p>
            <div className="rounded-md border border-red-500/60 bg-red-500/10 p-3 text-sm text-red-200 leading-relaxed">
              {t('responsible_gambling.self_exclusion.disclaimer')}
            </div>
            <label className="flex items-start gap-2 text-sm text-white/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ack}
                onChange={e => setAck(e.target.checked)}
                className="mt-1 accent-red-500"
              />
              <span>{t('responsible_gambling.self_exclusion.ack_checkbox')}</span>
            </label>
            {error && <p className="text-sm text-red-400 text-center">{t(error)}</p>}
            <div className="flex gap-2">
              <Button
                appearance="solid"
                intent="gray"
                className="w-full"
                onClick={() => setStep('pick')}
                disabled={mutation.isPending}
              >
                {t('back')}
              </Button>
              <Button
                appearance="glossy"
                intent="red"
                className="w-full"
                onClick={handleConfirm}
                disabled={!ack || mutation.isPending}
              >
                {mutation.isPending ? t('loading') : t('confirm')}
              </Button>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SelfExcludeModal;
