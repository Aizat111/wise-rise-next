'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Modal, ModalContent } from '../Modal';

import { useNavigationLoading } from '@/core/providers/NavigationLoadingProvider';
import { logoutUser } from '@/core/redux-toolkit/slices/userSlice';
import Image from '@/shared/ui/Images/Image';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useRouter();
  const { stopLoading } = useNavigationLoading();

  const handleClose = () => {
    stopLoading();
    onClose();
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
      size="sm"
      variant="default"
      header={t('logout')}
      headerClassName="uppercase"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 w-full">
        <div className="flex flex-col justify-center items-center gap-3 mb-7">
          <Image src="/assets/svgs/logout.svg" alt="logout" width={170} height={103} />
          <p className="text-white text-center font-bold">{t('logout_description')}</p>
        </div>
        <div className="p-0 h-full">
          <Button
            appearance="glossy"
            intent="red"
            className="w-full"
            onClick={() => {
              dispatch(logoutUser());
              handleClose();
              router.replace('/');
            }}
          >
            {t('logout')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default LogoutModal;
