'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';

import UDstatcard from '../../userdetails/UDstatcard';
import { Modal, ModalContent } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { levelBands } from '@/core/constants/user.constants';
import { getVipLevelBorderColor } from '@/core/constants/vip-levels.constants';
import { useModalManager } from '@/shared/hooks/useModal';
import Image from '@/shared/ui/Images/Image';
import ProgressBar from '@/shared/ui/ProgressBar';
import VipLevelBadge from '@/shared/ui/badges/VipLevelBadge';
import { Loader } from '@/shared/ui/loaders/Loader';
import { getFormattedDate } from '@/shared/utils/dateTimeUtils';
import { formatWinAmount } from '@/shared/utils/numberUtils';
import { getLevelSource } from '@/shared/utils/userUtils';

export interface UserInfoResponse {
  username: string;
  level: number;
  profilePic: string;
  totalBets: string;
  totalWins: string;
  favouriteGame: string;
  totalRakeback: number;
  lootboxesOpened: number;
  levelPercentage: number;
  totalGames: string;
  biggestWin: string;
  highestCrashMultiplier: number;
  totalPlinkoBalls: string;
  totalRewarded: number;
  totalTowerReveals: number;
  totalMinesReveals: number;
  totalSlotSpins: string;
  totalWagered: number;
  accountCreated: string;
  role?: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props: Record<string, unknown>;
  // Visual styling props
  progressBarColor?: string;
  borderColor?: string;
  glowColor?: string;
  imageSrc?: string;
  // Content props
  wageringAmount?: string;
  wageringTarget?: string;
  progressValue?: number;
  sealText?: string;
  sealLevel?: string;
  // Stats props
  stat1Value?: string;
  stat2Value?: string;
  stat3Value?: string;
  stat4Value?: string;
  stat5Value?: string;
  stat6Value?: string;
}

const UserDetailsModal = ({ isOpen, onClose, props }: UserDetailsModalProps) => {
  const t = useTranslations();
  // const { user } = useAppSelector(state => state.user);
  const userInfo = useFetcher<UserInfoResponse>(TYPES.GET_USER_INFO).render([{}, [props?.userId]]);

  const { openModal } = useModalManager();
  // Derive level/progress strictly from totalWagered and levelBands
  const totalWagered = Number(userInfo.data?.totalWagered ?? 0);
  const derivedCurrentBand =
    levelBands.find(b => totalWagered >= b.min && totalWagered <= b.max) ?? levelBands[levelBands.length - 1];
  const derivedLevel = Number(derivedCurrentBand.level || 0);
  const derivedNextBand = levelBands.find(b => b.level === derivedLevel + 1);
  const bandBase = Number(derivedCurrentBand.min || 0);
  const bandTargetAbsolute = Number(derivedNextBand ? derivedNextBand.min : derivedCurrentBand.max || bandBase);
  const bandSpan = Math.max(1, bandTargetAbsolute - bandBase);
  const progressInBand = Math.max(0, Math.min(bandSpan, totalWagered - bandBase));
  const computedPercent = Math.min(100, Math.max(0, (progressInBand / bandSpan) * 100));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      modalClassName="max-w-[450px] min-h-[300px] bg-toshi_body md:bg-[#060E20] mx-6 md:max-w-[1050px]"
      contentClassName="p-0 "
    >
      {userInfo?.isFetching ? (
        <div className="flex justify-center items-center min-h-[500px] w-full">
          <Loader />
        </div>
      ) : (
        <ModalContent className="p-0 w-full h-full max-h-full overflow-scroll">
          <div className="rounded-xl p-[1.5px]" style={{ background: getVipLevelBorderColor(derivedLevel) }}>
            <div className="rounded-3xl w-full h-full overflow-hidden bg-toshi_body md:bg-[#060E20]">
              {/* Desktop header: username left, reserve space for built-in close icon on right */}
              <div className="hidden md:flex items-center justify-between p-4 md:pl-7 ">
                <div className="text-white text-xl font-semibold leading-snug tracking-tight">
                  {userInfo?.data?.username}{' '}
                  {userInfo?.data?.role === 'moderator' && <span className="text-white70 text-sm">Moderator</span>}
                </div>
                <div className="w-9 h-9" />
              </div>
              {/* Mobile top container: username + level badge with VIP border */}
              <div className="md:hidden pb-0 p-4">
                <div className="rounded-xl p-0.5" style={{ background: getVipLevelBorderColor(derivedLevel) }}>
                  <div className="rounded-xl bg-toshi_body p-4 flex flex-col gap-2.5">
                    <div className="text-white70 text-sm">
                      {userInfo?.data?.username}{' '}
                      {userInfo?.data?.role === 'moderator' && <span className="text-white70 text-sm">Moderator</span>}
                    </div>
                    <VipLevelBadge level={userInfo?.data?.level} />
                  </div>
                </div>
              </div>
              <div className="flex no-scrollbar flex-col md:grid md:grid-cols-2 gap-4 pt-0 @[768px]:pt-0 @[768px]:p-5 p-4 w-full h-full ">
                <div className="w-full flex items-center max-h-220 md:max-h-[900px] justify-center">
                  <Image
                    src={userInfo.data?.profilePic}
                    alt="user-details"
                    width={500}
                    height={500}
                    className="md:w-[600px] md:h-[600px] w-[285px] h-[285px] -my-16 md:-mb-[180px]  z-20 object-contain @[768px]:h-700 @[768px]:w-700 @[768px]:mt-200"
                  />
                </div>
                <div className="flex flex-col md:gap-8 z-40 gap-2 border:none md:border md:border-white10 rounded-xl h-fit justify-between  p-0 @[768px]:p-4 md:p-5 overflow-hidden">
                  <div className="flex md:bg-transparent rounded-xl bg-[#323646] md:p-0 flex-col gap-3 p-3 pb-4">
                    <p className="text-lg font-bold text-white ">
                      ${formatWinAmount(totalWagered)} / ${formatWinAmount(bandTargetAbsolute)}
                    </p>
                    <ProgressBar
                      progress={computedPercent}
                      height="h-3 rounded-sm"
                      backgroundColor="bg-white10"
                      progressColor="bg-yellow"
                      showPercentage={false}
                      className="mt-2"
                    />
                    <div className="flex flex-row justify-between items-center p-0">
                      <VipLevelBadge
                        level={derivedLevel}
                        widthClassName="w-auto"
                        paddingClassName="px-5 py-2"
                        textSizeClassName="text-md font-base"
                        className=""
                      />
                      <p className="text-md font-base text-grey">{getLevelSource(derivedLevel + 1)}</p>
                    </div>
                  </div>
                  <div className=" px-3 py-3 bg-[#323646] rounded-xl inline-flex justify-start items-center gap-2.5">
                    <div className=" px-4 py-3 bg-white30 rounded-xl flex justify-center items-center gap-1">
                      <div className="justify-start text-white text-base font-semibold leading-snug tracking-wide">
                        OG
                      </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                      <div className=" justify-start text-white70 text-sm font-semibold leading-tight tracking-tight">
                        {t('userDetailsModal.member_since')}
                      </div>
                      <div className="justify-start text-white text-base font-semibold  leading-snug tracking-wide">
                        {getFormattedDate(new Date(userInfo.data?.accountCreated))}
                      </div>
                    </div>
                    <Button
                      intent="primary"
                      className="h-[50px]"
                      size="lg"
                      appearance="glossy"
                      borderRadius="xl"
                      onClick={() => openModal('tip', 'default', { userId: props.userId as string })}
                    >
                      {t('userDetailsModal.tip')}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-0">
                    <UDstatcard
                      title={t('userDetailsModal.statstitle1')}
                      value={formatWinAmount(Number(userInfo.data?.totalRewarded))}
                    />
                    <UDstatcard
                      title={t('userDetailsModal.statstitle2')}
                      value={formatWinAmount(Number(userInfo.data?.totalWagered))}
                    />
                    <UDstatcard title={t('userDetailsModal.statstitle3')} value={userInfo.data?.favouriteGame} />
                    <UDstatcard title={t('userDetailsModal.statstitle4')} value={userInfo.data?.favouriteGame} />
                    <UDstatcard title={t('userDetailsModal.statstitle5')} value={userInfo.data?.favouriteGame} />
                    <UDstatcard title={t('userDetailsModal.statstitle6')} value={userInfo.data?.favouriteGame} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
      )}
    </Modal>
  );
};

export default UserDetailsModal;
