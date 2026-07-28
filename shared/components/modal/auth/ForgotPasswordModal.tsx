'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Modal, ModalContent } from '../Modal';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import Input from '@/shared/ui/inputs/Input';
import { authSchemas } from '@/shared/utils/validationSchemas';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const t = useTranslations();
  const forgotPasswordAction = useFetcher(TYPES.FORGOT_PASSWORD).action();
  const schema = authSchemas.forgotPassword(t);
  type FormData = z.infer<ReturnType<typeof authSchemas.forgotPassword>>;

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
    const path = data.login.includes('@') ? 'email' : 'username';
    forgotPasswordAction.mutateAsync({ [path]: data.login } as unknown as void).then(() => {
      reset();
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
          <p className="text-white70 text-sm mb-4">{t('seeing_this_unexpectedly')}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-1" noValidate>
            <Input
              label="email_or_username"
              isTranslated
              type="text"
              isRequired
              registration={register('login')}
              error={(errors as Record<string, any>)?.login?.message as string}
            />

            <Button
              type="submit"
              appearance="glossy"
              isLoading={forgotPasswordAction.isPending}
              loadingText={t('loading')}
              intent="primary"
            >
              {t('send_recovery_link')}
            </Button>
          </form>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ForgotPasswordModal;
