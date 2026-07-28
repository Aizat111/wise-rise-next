'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Modal, ModalContent } from '../Modal';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';

interface BreakInPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// GraphQL enum values (prefixed because enum names can't start with a digit).
// The canonical label is shown in the UI via i18n.
const DURATIONS: Array<{ value: string; labelKey: string }> = [
  { value: 'h24', labelKey: 'responsible_gambling.durations.h24' },
  { value: 'h48', labelKey: 'responsible_gambling.durations.h48' },
  { value: 'd7', labelKey: 'responsible_gambling.durations.d7' },
  { value: 'd30', labelKey: 'responsible_gambling.durations.d30' },
  { value: 'm2', labelKey: 'responsible_gambling.durations.m2' },
  { value: 'm3', labelKey: 'responsible_gambling.durations.m3' }
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

const BreakInPlayModal = ({ isOpen, onClose }: BreakInPlayModalProps) => {
  const t = useTranslations();
  const [step, setStep] = useState<Step>('pick');
  const [duration, setDuration] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useGraphWsFetcher(GRAPHQL_TYPES.BREAK_IN_PLAY_MUTATION).action();

  const reset = () => {
    setStep('pick');
    setDuration(null);
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
    if (!duration) return;
    setError(null);
    mutation.mutate(
      { duration },
      {
        onSuccess: () => {
          handleClose();
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
      header={t('responsible_gambling.break_in_play.modal_header')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        {step === 'pick' && (
          <div className="flex flex-col gap-3">
            <p className="text-white/70 text-sm">{t('responsible_gambling.break_in_play.modal_intro')}</p>
            <div className="grid grid-cols-3 gap-2">
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
                      ? 'border-blue-400 bg-blue-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
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
              <Button appearance="glossy" intent="blue" className="w-full" onClick={handleNext} disabled={!duration}>
                {t('next')}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && duration && (
          <div className="flex flex-col gap-4">
            <p className="text-white font-semibold text-center">
              {t('responsible_gambling.break_in_play.confirm_text', {
                duration: t(`responsible_gambling.durations.${duration}`)
              })}
            </p>
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
                intent="blue"
                className="w-full"
                onClick={handleConfirm}
                disabled={mutation.isPending}
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

export default BreakInPlayModal;
