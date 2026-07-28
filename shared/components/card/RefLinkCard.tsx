'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FC, useCallback, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Card from './Card';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { RootState } from '@/core/redux-toolkit/store';
import { Rakeboos } from '@/shared/assets/general';
import useClipboard from '@/shared/hooks/useClipboard';
import Input from '@/shared/ui/inputs/Input';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';

interface RefLinkCardProps {
  refLink: string;
}

const RefLinkCard: FC<RefLinkCardProps> = ({ refLink }) => {
  const t = useTranslations();
  const { copy } = useClipboard();
  const { user } = useSelector((state: RootState) => state.user, shallowEqual);
  const changeReferralCode = useFetcher(TYPES.CHANGE_REFERRAL_CODE).action();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const onSubmit = useCallback(
    (code: string) => {
      if (!code) {
        setError(t('field_is_required'));
        return;
      }
      setError('');
      changeReferralCode.mutateAsync({ newReferralCode: code }).then(() => {
        setCode('');
        setError('');
      });
    },
    [changeReferralCode, t]
  );
  return (
    <Card className="@[768px]:gap-6 gap-8 @[768px]:gap-16 @[768px]:p-10 p-6 @[768px]:flex @[768px]:flex-row flex flex-col justify-between w-full">
      <div className="relative w-full flex-col @[768px]:gap-7 gap-5 @[768px]:max-w-[445px] flex rounded-md h-full">
        <div className="relative w-full  flex-col gap-1 flex rounded-xl h-full">
          <p className="text-base font-semibold text-white ">{t('affiliate.referral_link')}</p>
          <Input
            value={`toshi.bet/r/${refLink || ''}`}
            rightIcon={
              <CustomTooltip label={t('copy')} triggerClassName="cursor-pointer">
                <Copy className="text-white" onClick={() => copy(`toshi.bet/r/${refLink}`)} />
              </CustomTooltip>
            }
            size="lg"
            readOnly
            key={'ref-link'}
            background="dark"
          />
        </div>

        {user && (
          <div className="relative w-full  flex-col gap-1 flex rounded-xl h-full">
            <p className="text-base font-semibold text-white ">{t('affiliate.change_code')}</p>
            <Input
              size="lg"
              value={code}
              background="dark"
              placeholder={t('affiliate.enter_new_code')}
              onChange={e => setCode(e.target.value)}
              error={error}
              key={'new-code'}
              rightIcon={
                <Button
                  appearance="outline-soft"
                  intent="primary"
                  isLoading={changeReferralCode.isPending}
                  className="text-xs p-0 h-6 bg-primary-500/10 text-white"
                  onClick={() => onSubmit(code)}
                >
                  {t('affiliate.save')}
                </Button>
              }
            />
          </div>
        )}
      </div>

      <div className="relative w-full gap-6 justify-left @[768px]:max-w-[420px] flex flex-row items-start bg-bg_menu p-6 rounded-md">
        <div className="flex flex-row ">
          <Rakeboos width={44} height={44} />
        </div>
        <div className="relative flex flex-col gap-3">
          <p className="@[768px]:text-base text-lg font-semibold text-white">
            {' '}
            Friends get 50% rakeback boost for 3 days
          </p>
          <p className="text-base font-semibold text-grey"> Only applied when signing up on your referral link </p>
        </div>
      </div>
    </Card>
  );
};

export default RefLinkCard;
