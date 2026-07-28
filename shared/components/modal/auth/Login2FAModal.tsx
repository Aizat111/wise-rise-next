'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../../ui/inputs/Input';
import { Modal, ModalContent } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { notify } from '@/core/lib/notify';
import { useNavigationLoading } from '@/core/providers/NavigationLoadingProvider';
import { setTokens } from '@/core/redux-toolkit/slices/userSlice';
import { RootState } from '@/core/redux-toolkit/store';

interface Login2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login2FAModal = ({ isOpen, onClose }: Login2FAModalProps) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { tempToken } = useSelector((state: RootState) => state.user);
  const { stopLoading } = useNavigationLoading();
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const reset2FAAction = useFetcher(TYPES.RESET_SECRET_2FA).action();
  const verify2FAAction = useFetcher(TYPES.VERIFY_LOGIN_2FA).action();
  const handleClose = () => {
    stopLoading();
    onClose();
  };

  const securityKeyLost = async () => {
    try {
      reset2FAAction
        .mutateAsync({ tempToken: tempToken || '' })
        .then(() => {
          notify(
            'success',
            'success.check_your_email',
            'success.we_sent_the_instructions_to_recover_your_2fa_to_your_registered_email'
          );
        })
        .catch((err: any) => {
          notify('error', 'errors.server_error', err.message);
        });
    } catch (err: any) {
      notify('error', 'errors.server_error', err.message);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    verify2FAAction
      .mutateAsync({ tempToken: tempToken || '', twoFactorCode })
      .then((res: any) => {
        if (res) {
          dispatch(setTokens(res));
          onClose();
        }
      })
      .catch((err: any) => {
        notify('error', 'errors.server_error', err.message);
      });
  };

  useEffect(() => {
    if (isOpen) {
      stopLoading();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEscape={true}
      size="md"
      variant="default"
      header={t('login')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full flex flex-col gap-4 px-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            label="Enter your 2FA code"
            placeholder=""
            value={twoFactorCode}
            onChange={e => setTwoFactorCode(e.target.value)}
          />

          <Button
            appearance="glossy"
            intent="primary"
            className="w-full"
            isLoading={verify2FAAction.isPending}
            loadingText={t('loading')}
            type="submit"
          >
            {t('submit')}
          </Button>
        </form>

        <div
          aria-hidden="true"
          onClick={() => {
            securityKeyLost();
          }}
          className="text-center text-sm text-white cursor-pointer"
        >
          Lost your security key?
        </div>
      </ModalContent>
    </Modal>
  );
};

export default Login2FAModal;
