'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { Check, CopyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IDepositOrWithdraw } from '@/core/types/deposit.types';
import Card from '@/shared/components/card/Card';
import { Modal, ModalContent } from '@/shared/components/modal/Modal';
import useClipboard from '@/shared/hooks/useClipboard';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { Badge } from '@/shared/ui/Badge';
import Image from '@/shared/ui/Images/Image';
import ShowTextInput from '@/shared/ui/inputs/ShowTextInput';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';
import { getFormattedDate } from '@/shared/utils/dateTimeUtils';
import { getAssetImage, getWithdrawalSymbol } from '@/shared/utils/getWithdrawalSymbol';
import { shortenAddress } from '@/shared/utils/stringUtils';

interface WithdrawlModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: IDepositOrWithdraw | undefined;
}

const WithdrawlModal = ({ isOpen, onClose, data }: WithdrawlModalProps) => {
  const t = useTranslations();
  const { width } = useWindowSize();
  const { copy } = useClipboard();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="xl"
      variant="default"
      header={t(data?.direction?.toLowerCase() === 'withdrawal' ? 'withdrawl' : 'deposit')}
      headerClassName="uppercase font-byrd"
      contentClassName="px-6 pt-4 pb-6"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full no-scrollbar h-fit">
        <div className="flex flex-col justify-center items-center gap-1 md:gap-2.5 mb-3 md:mb-5">
          <Image
            src={`/assets/currencies/${
              getAssetImage((data?.asset ?? '').toLowerCase()) || (data?.asset ?? '').toLowerCase()
            }.svg`}
            alt={data?.direction?.toLowerCase() === 'withdrawl' ? 'withdrawl' : 'deposit'}
            width={60}
            className="rounded-full border-4 border-lightgrey"
            height={60}
          />
          <h4 className="text-white text-center text-md font-bold">
            {data?.asset_amount} {getWithdrawalSymbol(data?.asset || '')}
          </h4>
        </div>
        {data?.status?.toLowerCase() === 'completed' && (
          <Card className="bg-bg_menu gap-5 py-4 md:px-6 px-4 mb-4">
            <div className="flex items-center gap-5">
              <div className="min-h-11 min-w-11 relative h-11 w-11 border-success-500 rounded-full border-[14px] after:content-[''] after:absolute after:w-1 after:h-5 after:bg-success-500 after:rounded-full after:left-1/2 after:-bottom-[42px] after:-translate-x-1/2"></div>
              <div>
                <h5 className="text-gray-200 text-base font-bold">
                  {t(data?.direction?.toLowerCase() === 'withdrawl' ? 'review_complete' : 'review_complete_deposit')}
                </h5>
                <p className="text-white/60 text-sm">
                  {t(
                    data?.direction?.toLowerCase() === 'withdrawl'
                      ? 'review_complete_description'
                      : 'review_complete_description_deposit'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="h-11 w-11 border-success-500 rounded-full border-4 flex items-center justify-center">
                <div className="bg-success-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-gray-900" />
                </div>
              </div>
              <div>
                <h5 className="text-gray-200 text-base font-bold">{t('successful')}</h5>
                <p className="text-white/60 text-sm">
                  {t(
                    data?.direction?.toLowerCase() === 'withdrawl'
                      ? 'your_withdrawal_is_complete'
                      : 'your_deposit_is_complete'
                  )}
                </p>
              </div>
            </div>
          </Card>
        )}
        <Card className="bg-bg_menu gap-6 p-0 mb-4">
          <div className="flex flex-col gap-2">
            {data?.status && (
              <div className="flex  px-4 pb-2 pt-2 items-center justify-between border-b border-white/10 ">
                <span className="text-white/60 text-sm">{t('status')}</span>
                <Badge
                  variant={
                    data?.status?.toLowerCase() === 'completed'
                      ? 'success'
                      : data?.status?.toLowerCase() === 'rejected'
                        ? 'danger'
                        : 'toshiWarning'
                  }
                  className="rounded-md text-gray-900 px-1 capitalize"
                >
                  {t(data?.status?.toLowerCase())}
                </Badge>
              </div>
            )}
            {data?.fiat_amount && (
              <div className="flex items-center  px-4 pt-0 justify-between border-b border-white/10 pb-2">
                <span className="text-white/60 text-sm">{t('fiat')}</span>
                <span className="flex items-center gap-1">
                  {data?.fiat_amount}{' '}
                  <Image src={'/assets/currencies/dollar.svg'} alt="Marlin Masters" width={15} height={15} />
                </span>
              </div>
            )}
            {data?.created_at && (
              <div className="flex px-4 pb-2 items-center justify-between">
                <span className="text-white/70 text-sm">{t('time')}</span>
                <span>{getFormattedDate(data?.created_at, 'hh:mm a MM/dd/yyyy')}</span>
              </div>
            )}
          </div>
        </Card>
        <Card className="bg-bg_menu p-3 md:mb-6 mb-4">
          {data?.transaction_link && (
            <ShowTextInput
              label={t('transaction')}
              value={shortenAddress(data?.transaction_link, width)}
              inputClassName="bg-bg_content text-nowrap  "
              rightIcon={
                <CustomTooltip label={t('copy')} triggerClassName="cursor-pointer">
                  <CopyIcon className="size-4 cursor-pointer" onClick={() => copy(data?.transaction_link || '')} />
                </CustomTooltip>
              }
            />
          )}
          {data?.to_address && (
            <ShowTextInput
              label={t('address')}
              value={shortenAddress(data?.to_address, width)}
              inputClassName="bg-bg_content text-nowrap "
              rightIcon={
                <CustomTooltip label={t('copy')} triggerClassName="cursor-pointer">
                  <CopyIcon className="size-4 cursor-pointer" onClick={() => copy(data?.to_address || '')} />
                </CustomTooltip>
              }
            />
          )}
        </Card>
        <div className="p-0 h-full">
          <Button
            appearance="glossy"
            intent="primary"
            size="md"
            className="w-full"
            onClick={() => {
              onClose();
            }}
          >
            {t('done')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default WithdrawlModal;
