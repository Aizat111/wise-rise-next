'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PAGE } from '../../../../core/config/public-page.config';
import { handleShare } from '../../../../core/lib/utils';
import ToshiBetWhiteLogo from '../../../assets/branding/ToshiBetWhiteLogo';
import useClipboard from '../../../hooks/useClipboard';
import { Modal, ModalContent } from '../Modal';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  props: Record<string, unknown>;
}

const ReferralModal = ({ isOpen, onClose, props }: ReferralModalProps) => {
  const t = useTranslations('last_man_standing');
  const router = useRouter();
  const { copy } = useClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const referralCode = String(props?.referralCode || '');
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const referralLink = referralCode ? `${baseUrl}/r/${referralCode}` : '';

  const handleMoreInfo = () => {
    router.push(PAGE.AFFILIATE);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="sm"
      variant="default"
      modalClassName="!p-0 !m-0 rounded-none !bg-transparent border-none"
      contentClassName="!p-0 !m-0"
      closeButtonSize="lg"
      closeButtonClassName="mt-4"
    >
      <ModalContent
        className="p-1 rounded-xl w-full"
        style={{
          background:
            'linear-gradient(135.34deg, #8C421D 15.43%, #FBE67B 38.47%, #FCFBE7 53.36%, #F7D14E 69.97%, #D4A041 86.26%)'
        }}
      >
        <div className="bg-toshi_body rounded-xl">
          <div className="flex flex-col items-center gap-10 py-6 px-4 w-full mb-8">
            <div className="w-full h-full flex items-center justify-start mb-8">
              <ToshiBetWhiteLogo width={147} height={34} className="w-[147px] h-[34px]" />
            </div>
            <h3 className="m-0 w-full text-center font-tusker_grotesk text-3xl font-bold uppercase tracking-wide leading-[1.5] text-white">
              <span className="block">{t('refer_modal_headline_l1')}</span>
              <span className="block">
                {t.rich('refer_modal_headline_l2', {
                  earn: chunks => (
                    <span className="inline bg-gradient-to-b from-[#FFF6C8] via-[#F7D14E] to-[#C17A1A] bg-clip-text text-transparent">
                      {chunks}
                    </span>
                  )
                })}
              </span>
              <span className="block">{t('refer_modal_headline_l3')}</span>
            </h3>

            {referralLink ? (
              <div className="flex items-center gap-2 w-full bg-bg_color rounded-lg p-3">
                <span className="text-sm text-white/70 truncate flex-1">{referralLink}</span>
                <button
                  onClick={() => {
                    copy(referralLink);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="shrink-0 p-2 rounded-md bg-bg_btn_lms hover:opacity-80 transition-opacity"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-[#03FF88]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#03FF88]" />
                  )}
                </button>
              </div>
            ) : (
              <p className="text-sm text-white/50">{t('no_referral_code')}</p>
            )}
          </div>
          <div className="px-4 pb-4 flex justify-between items-center gap-2">
            <Button
              appearance="solid"
              intent="green"
              className="text-sm font-semibold !bg-bg_btn_lms !text-[#03FF88] rounded-xl"
              onClick={handleMoreInfo}
            >
              More Info
            </Button>
            <Button
              appearance="solid"
              intent="green"
              onClick={() => handleShare(`Refer a friend & earn every time they bet!`, '', referralLink)}
              className="text-sm font-semibold !bg-bg_btn_lms !text-[#03FF88] rounded-xl"
            >
              Share
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ReferralModal;
