'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Modal, ModalContent } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { notify } from '@/core/lib/notify';

interface CreateRaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props: Record<string, unknown>;
}

interface PrizeFormData {
  [key: number]: string;
}

interface CreateLeaderboardPayload {
  startDate: string;
  endDate: string;
  prizes: {
    position: number;
    amount: number;
  }[];
}

interface CheckEligibilityResponse {
  success: boolean;
  data: boolean;
}

const PRIZE_POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CreateRaceModal = ({ isOpen, onClose }: CreateRaceModalProps) => {
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [prizes, setPrizes] = useState<PrizeFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();
  const { data: eligibilityData, isFetching: isCheckingEligibility } = useFetcher<CheckEligibilityResponse>(
    TYPES.CHECK_AFFILIATE_ELIGIBILITY
  ).render();

  const { action: createAction } = useFetcher<any>(TYPES.CREATE_LEADERBOARD);
  const createMutation = createAction();

  const totalPrize = useMemo(() => {
    return Object.values(prizes).reduce((total, prize) => {
      const amount = parseFloat(prize) || 0;
      return total + amount;
    }, 0);
  }, [prizes]);

  const handlePrizeChange = (position: number, value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrizes(prev => ({
        ...prev,
        [position]: value
      }));
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!endDate || !endTime) {
      notify('error', 'errors.missing_information', 'errors.missing_information_description');
      return;
    }

    const filledPrizes = PRIZE_POSITIONS.filter(position => prizes[position] && parseFloat(prizes[position]) > 0);

    if (filledPrizes.length !== 10) {
      notify('error', 'errors.all_prizes_required', {
        key: 'errors.all_prizes_required_description',
        params: { totalPrize: totalPrize.toFixed(2) }
      });
      return;
    }

    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= new Date()) {
      notify('error', 'errors.invalid_date', 'errors.invalid_date_description');
      return;
    }

    setIsSubmitting(true);
    try {
      const prizesArray = PRIZE_POSITIONS.map(position => ({
        position,
        amount: parseFloat(prizes[position]) || 0
      }));

      const payload: CreateLeaderboardPayload = {
        startDate: new Date().toISOString(),
        endDate: endDateTime.toISOString(),
        prizes: prizesArray
      };

      await createMutation.mutateAsync(payload);

      notify('success', 'success.race_created', {
        key: 'success.race_created_description',
        params: { totalPrize: totalPrize.toFixed(2) }
      });

      setPrizes({});
      setEndDate('');
      setEndTime('');
      onClose();

      window.location.reload();
    } catch (error: any) {
      console.error('Error creating race:', error);
      notify(
        'error',
        'errors.error_creating_race',
        error.response?.data?.message || 'errors.error_creating_race_description'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingEligibility) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('affiliate.create_race')}
        size="lg"
        variant="default"
        modalClassName="bg-toshi_body"
      >
        <ModalContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-toshi-primary border-t-transparent" />
            <span className="text-white">{t('affiliate.checking_eligibility')}</span>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  if (eligibilityData?.data === false) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('affiliate.create_race')}
        size="lg"
        variant="default"
        modalClassName="bg-toshi_body"
      >
        <ModalContent className="p-4">
          <div className="flex flex-col items-center gap-4 p-6 bg-red-500/10 rounded-lg border border-red-500/20">
            <h3 className="text-lg font-bold text-red-400">{t('affiliate.not_eligible')}</h3>
            <p className="text-center text-white80 ">{t('affiliate.requirement')}</p>
            <Button appearance="solid" intent="gray" onClick={onClose} className="mt-4">
              {t('close')}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={t('affiliate.create_race')}
      size="lg"
      variant="default"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center p-4 bg-bg_menu rounded-lg">
            <span className="text-md font-semibold text-white80 mb-1">{t('affiliate.total_prize_pool')}</span>
            <span className="text-md font-bold text-toshi-primary">${totalPrize.toFixed(2)}</span>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-md  text-white">{t('affiliate.race_end_date_time')}</h3>
            <div className="grid grid-cols-1 @[768px]:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white80">{t('affiliate.end_date')}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  min={getCurrentDate()}
                  className="bg-bg_menu border-none text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-toshi-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white80">{t('affiliate.end_time')}</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="bg-bg_menu border-none text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-toshi-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-md font-semibold text-white">{t('affiliate.prize_distribution')}</h3>
            <div className="grid grid-cols-1 @[768px]:grid-cols-2 gap-3">
              {PRIZE_POSITIONS.map(position => (
                <div key={position} className="flex flex-col gap-2">
                  <label className="text-sm text-white80">
                    {position === 1
                      ? t('affiliate.first_place')
                      : position === 2
                        ? t('affiliate.second_place')
                        : position === 3
                          ? t('affiliate.third_place')
                          : `${position}${t('affiliate.th_place')}`}{' '}
                    Place Prize
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white80 text-sm">$</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={prizes[position] || ''}
                      onChange={e => handlePrizeChange(position, e.target.value)}
                      className="bg-bg_menu border-none text-white rounded-lg px-4 py-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-toshi-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 bg-toshi_body pt-4 pb-2">
            <Button appearance="solid" intent="gray" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              {t('cancel')}
            </Button>
            <Button
              appearance="solid"
              intent="primary"
              onClick={handleSubmit}
              className="flex-1"
              isLoading={isSubmitting}
              disabled={totalPrize === 0 || isSubmitting}
            >
              {t('affiliate.create_race')} (${totalPrize.toFixed(2)})
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default CreateRaceModal;
