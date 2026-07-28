'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AuthModal from './auth/AuthModal';
import ChangePasswordModal from './auth/ChangePasswordModal';
import ForgotPasswordModal from './auth/ForgotPasswordModal';
import Login2FAModal from './auth/Login2FAModal';
import LogoutModal from './auth/LogoutModal';
import UserDetailsModal from './auth/UserDetailsModal';
import BlackjackModal from './blackjack/BlackjackModal';
import ChatRulesModal from './chats/ChatRulesModal';
import ConfirmModal, { ConfirmModalProps } from './confirm/ConfirmModal';
import { CouponCaseModal, CouponCaseModalProps } from './coupon-case/CouponCaseModal';
import DepositBonusModal from './deposit-bonus/DepositBonus';
import DepositCurrencyModal from './deposit/DepositCurrencyModal';
import ChangeSeedModal from './fairness/ChangeSeedModal';
import FairnessModal from './fairness/FairnessModal';
import BetModal from './lms/BetModal';
import DrawCardModal from './lms/DrawCardModal';
import LmsFaqsModal from './lms/FaqsModal';
import LmsFixtureModal from './lms/FixtureModal';
import LifelineModal from './lms/LifelineModal';
import NotificationModal from './lms/NotificationModal';
import LmsParticipantsModal from './lms/ParticipantsModal';
import PastSelections from './lms/PastSelections';
import ReferralModal from './lms/ReferralModal';
import LmsRulesModal from './lms/RulesModal';
import WorldCupModal from './lms/WorldCupModal';
import CustomNotificationModal from './notification/CustomNotificationModal';
import PredictRulesModal from './predict/RulesModal';
import PrizesListModal from './prizes/PrizesListModal';
import PromoDetailModal from './promotions/PromoDetailModal';
import PromoHistoryModal from './promotions/PromoHistoryModal';
import InfluencerRaceModal from './race/InfluencerRaceModal';
import BreakInPlayModal from './responsible-gambling/BreakInPlayModal';
import SelfExcludeModal from './responsible-gambling/SelfExcludeModal';
import SearchModal from './search/SearchModal';
import StreaksModal from './streaks/StreaksModal';
import TipModal from './tip/TipModal';
import VaultModal from './vault/VaultModal';
import CreateRaceModal from './wager-race/CreateRaceModal';
import RaceHistoryModal from './wager-race/RaceHistoryModal';
import WithdrawalCurrencyModal from './withdrawal/WithdrawalCurrencyModal';
import { PAGE } from '@/core/config/public-page.config';
import { closeModal, openModal } from '@/core/redux-toolkit/slices/modalSlice';
import type { RootState } from '@/core/redux-toolkit/store';

// Modal registry - add new modals here
const modalRegistry = {
  auth: AuthModal,
  login2FA: Login2FAModal,
  userDetails: UserDetailsModal,
  depositCurrency: DepositCurrencyModal,
  withdrawalCurrency: WithdrawalCurrencyModal,
  vault: VaultModal,
  logout: LogoutModal,
  search: SearchModal,
  fairness: FairnessModal,
  confirm: ConfirmModal,
  changeSeed: ChangeSeedModal,
  claimNotification: CustomNotificationModal,
  forgotPassword: ForgotPasswordModal,
  changePassword: ChangePasswordModal,
  tip: TipModal,
  blackjack: BlackjackModal,
  prizesList: PrizesListModal,
  depositBonus: DepositBonusModal,
  influencerRace: InfluencerRaceModal,
  createRace: CreateRaceModal,
  raceHistory: RaceHistoryModal,
  couponCase: CouponCaseModal,
  drawCard: DrawCardModal,
  lifeline: LifelineModal,
  notification: NotificationModal,
  bet: BetModal,
  pastSelections: PastSelections,
  lmsFaqs: LmsFaqsModal,
  lmsRules: LmsRulesModal,
  lmsFixture: LmsFixtureModal,
  lmsParticipants: LmsParticipantsModal,
  lmsReferral: ReferralModal,
  chatRules: ChatRulesModal,
  worldCup: WorldCupModal,
  breakInPlay: BreakInPlayModal,
  selfExclude: SelfExcludeModal,
  promoDetail: PromoDetailModal,
  promoHistory: PromoHistoryModal,
  predictRules: PredictRulesModal,
  streaks: StreaksModal
} as const;

export type ModalName = keyof typeof modalRegistry;

interface ModalManagerProps {
  className?: string;
}

const ModalManager = ({ className }: ModalManagerProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { modals } = useSelector((state: RootState) => state.modals);

  // Command F open Search Modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'f') {
          dispatch(openModal({ modalName: 'search', type: 'search', props: {} }));
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseModal = (modalName: ModalName, id?: string) => {
    if (pathname?.includes('deposit') || pathname?.includes('withdraw')) {
      dispatch(closeModal({ modalName, id }));
      router.push(PAGE.HOME, { scroll: false });
      return;
    }
    if (modalName === 'streaks' && pathname?.endsWith('/streaks')) {
      dispatch(closeModal({ modalName, id }));
      router.push(PAGE.HOME, { scroll: false });
      return;
    }
    if (searchParams?.get('modal') === 'deposit' || searchParams?.get('modal') === 'withdraw') {
      dispatch(closeModal({ modalName, id }));
      router.push(pathname || PAGE.HOME, { scroll: false });
      return;
    }
    dispatch(closeModal({ modalName, id }));
  };
  if (!modals) return null;

  return (
    <div className={className}>
      {Object.entries(modals).map(([modalName, modalState]) => {
        const ModalComponent = modalRegistry[modalName as ModalName];

        if (!ModalComponent) {
          return null;
        }

        // Handle miniGame modals (array of modals)
        if (modalName === 'miniGame' && Array.isArray(modalState)) {
          return modalState.map(modal => {
            if (!modal?.isOpen || !modal?.type) return null;

            return (
              <ModalComponent
                key={modal.id || `${modalName}-${modal.type}`}
                isOpen={modal.isOpen}
                onClose={() => handleCloseModal(modalName as ModalName, modal.id)}
                type={modal.type}
                props={
                  modal.props as Record<string, unknown> & ConfirmModalProps['props'] & CouponCaseModalProps['props']
                }
              />
            );
          });
        }

        // Handle other modals (single instance)
        if (!Array.isArray(modalState) && (!modalState?.isOpen || !modalState?.type)) return null;

        // Type guard to ensure modalState is not an array for single instance modals
        if (Array.isArray(modalState)) return null;

        return (
          <ModalComponent
            key={modalName}
            isOpen={modalState?.isOpen}
            onClose={() => handleCloseModal(modalName as ModalName)}
            type={modalState?.type || 'default'}
            props={
              modalState?.props as Record<string, unknown> & ConfirmModalProps['props'] & CouponCaseModalProps['props']
            }
          />
        );
      })}
    </div>
  );
};

export default ModalManager;
