'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import { Modal, ModalContent } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { notify } from '@/core/lib/notify';
import { logoutUser } from '@/core/redux-toolkit/slices/userSlice';
import { useModalManager } from '@/shared/hooks/useModal';
import PasswordInput from '@/shared/ui/inputs/PasswordInput';
import { authSchemas } from '@/shared/utils/validationSchemas';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

const ChangePasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams?.get('pw_token');
  const { openModal } = useModalManager();
  const resetPasswordAction = useFetcher(TYPES.RESET_PASSWORD).action();
  const schema = authSchemas.resetPassword(t);
  type FormData = z.infer<ReturnType<typeof authSchemas.resetPassword>>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: Record<string, any>) => {
    if (!token) {
      notify('error', 'Error changing password!', 'Invalid token. Please try again.');
      return;
    }
    resetPasswordAction.mutateAsync({ ...data, token }).then(() => {
      reset();
      dispatch(logoutUser());
      openModal('auth', 'login');
      onClose();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      closeOnOverlayClick={false}
      size="md"
      variant="default"
      header={t('change_password')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        <div className="">
          <p className="text-white70 text-sm mb-4">{t('change_password_description')}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-1" noValidate>
            <PasswordInput
              label="settings.new_password"
              isTranslated
              isRequired
              registration={register('newPassword')}
              error={(errors as Record<string, any>)?.newPassword?.message as string}
            />
            <PasswordInput
              label="settings.confirm_password"
              isTranslated
              isRequired
              registration={register('confirmPassword')}
              error={(errors as Record<string, any>)?.confirmPassword?.message as string}
            />

            <Button
              type="submit"
              appearance="glossy"
              isLoading={resetPasswordAction.isPending}
              loadingText={t('loading')}
              intent="primary"
            >
              {t('confirm')}
            </Button>
          </form>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
