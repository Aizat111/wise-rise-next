'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import { Modal } from '../Modal';

import LoginOptions from './LoginOptions';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { buildImgixUrl, resolveImagePath } from '@/core/lib/imgix';
import { notify } from '@/core/lib/notify';
import { setTempToken, setTokens, setUser } from '@/core/redux-toolkit/slices/userSlice';
import { type ILoginResponse, type IRegisterResponse } from '@/core/types/auth.types';
import { useModalManager } from '@/shared/hooks/useModal';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import Image from '@/shared/ui/Images/Image';
import Checkbox from '@/shared/ui/inputs/Checkbox';
import Input from '@/shared/ui/inputs/Input';
import PasswordInput from '@/shared/ui/inputs/PasswordInput';
import { authSchemas, authUnionSchema } from '@/shared/utils/validationSchemas';

const SCALEO_CLICK_ID_KEY = 'scaleo_cid';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props?: Record<string, any>;
}

const AuthModal = ({ isOpen, onClose, type, props }: AuthModalProps) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { openModal } = useModalManager();
  const { width } = useWindowSize();
  const loginAction = useFetcher<ILoginResponse>(TYPES.LOGIN).action();
  const registerAction = useFetcher<IRegisterResponse>(TYPES.REGISTER).action();
  const [selectedValue, setSelectedValue] = useState(type);
  const [clickId, setClickId] = useState<string | null>(null);
  const [scaleoClickId, setScaleoClickId] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  const [readOnlyRefCode, setReadOnlyRefCode] = useState(false);
  const [sponsoredInviteCode, setSponsoredInviteCode] = useState<string | null>(null);
  const imageKey = selectedValue === 'login' ? 'auth.login' : 'auth.register';
  const [schema, setSchema] = useState(selectedValue === 'login' ? authSchemas.login(t) : authSchemas.register(t));
  type FormData = z.infer<ReturnType<typeof authUnionSchema>>;
  const [termsAccepted, setTermsAccepted] = useState(false);
  // Turnstile
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState<boolean>(false);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      referralCode: props?.referralCode || ''
    }
  });

  const onSubmit = (data: Record<string, any>) => {
    // Require accepting terms on register
    if (selectedValue === 'register' && !termsAccepted) {
      notify('error', 'errors.error_on_sign_up', 'errors.you_must_accept_terms');
      return;
    }
    // Require Turnstile token
    if (process.env.NEXT_PUBLIC_ENVIRONMENT == 'PROD') {
      if (!turnstileToken) {
        notify('error', 'errors.error', 'errors.please_complete_verification');
        return;
      }
    }
    // Backend expects the token in 'cf-turnstile-response'
    const payload = { ...data, ['cf-turnstile-response']: turnstileToken };
    if (selectedValue === 'login') {
      loginAction
        .mutateAsync(payload as unknown as void)
        .then((res: any) => {
          if (res?.require2FA) {
            dispatch(setTempToken(res?.tempToken));
            openModal('login2FA', 'login2FA');
            onClose();
          } else if (res?.need_change_password || res?.message === 'User needs to change password') {
            openModal('forgotPassword', 'forgotPassword');
            onClose();
          } else {
            dispatch(setTokens(res));
            reset();
            onClose();
          }
        })
        .catch(() => {})
        .finally(() => {
          const w = window as any;
          if (turnstileWidgetId && w?.turnstile?.reset) {
            try {
              w.turnstile.reset(turnstileWidgetId);
            } catch (error) {
              console.error(error);
            }
          }
          setTurnstileToken('');
        });
    } else {
      const referallCodeThirthparty = localStorage.getItem('ft_source_agency') ?? null;
      let referralForReferralCode = referralCode || data.referralCode || '';
      if (referallCodeThirthparty && referallCodeThirthparty === 'adm') {
        referralForReferralCode = referallCodeThirthparty;
      }
      registerAction
        .mutateAsync({
          ...payload,

          clickId,
          scaleoClickId,

          campaignId,

          referralCode: referralForReferralCode,
          sponsoredInviteCode
        } as unknown as void)
        .then(res => {
          dispatch(setTokens(res.token));
          dispatch(setUser(res.user));
          reset();
          localStorage.setItem('clickId', '');
          localStorage.setItem('campaignId', '');
          localStorage.setItem('referralCode', '');
          localStorage.removeItem(SCALEO_CLICK_ID_KEY);
          localStorage.removeItem('sponsoredInviteCode');
          onClose();
        })
        .catch(() => {})
        .finally(() => {
          const w = window as any;
          if (turnstileWidgetId && w?.turnstile?.reset) {
            try {
              w.turnstile.reset(turnstileWidgetId);
            } catch (error) {
              console.error(error);
            }
          }
          setTurnstileToken('');
        });
    }
  };

  useEffect(() => {
    setSchema(selectedValue === 'login' ? authSchemas.login(t) : authSchemas.register(t));
  }, [selectedValue, t]);

  // Set referral code when modal opens or when switching to register mode
  useEffect(() => {
    if (props?.referralCode && selectedValue === 'register' && isOpen) {
      setValue('referralCode', props.referralCode);
    }
  }, [props?.referralCode, selectedValue, isOpen, setValue]);

  useEffect(() => {
    setClickId(localStorage.getItem('clickId') ?? null);
    setScaleoClickId(localStorage.getItem(SCALEO_CLICK_ID_KEY) ?? null);
    setCampaignId(localStorage.getItem('campaignId') ?? null);
    setReferralCode(localStorage.getItem('referralCode') ?? '');
    setReadOnlyRefCode(localStorage.getItem('referralCode') ? true : false);
    setSponsoredInviteCode(localStorage.getItem('sponsoredInviteCode') ?? null);
    return () => {
      localStorage.setItem('clickId', '');
      localStorage.setItem('campaignId', '');
      localStorage.setItem('referralCode', '');
    };
  }, []);

  useEffect(() => {
    if (referralCode) {
      localStorage.setItem('referralCode', referralCode);
    }
  }, [referralCode]);

  // Render Turnstile explicitly when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const w = window as any;
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
    if (!sitekey) return;
    const el = turnstileContainerRef.current;
    if (!el) return;
    // Wait until the Turnstile library is loaded
    if (!w?.turnstile?.render && !turnstileReady) return;
    // Remove previous widget if any
    if (turnstileWidgetId && w?.turnstile?.remove) {
      try {
        w.turnstile.remove(turnstileWidgetId);
      } catch (error) {
        console.error(error);
      }
      setTurnstileWidgetId(null);
      setTurnstileToken('');
    }
    // Render new widget
    if (w?.turnstile?.render) {
      const config: any = {
        sitekey,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken('')
      };
      const id = w.turnstile.render(el, config);
      setTurnstileWidgetId(id);
    }
    // Cleanup on close
    return () => {
      if (turnstileWidgetId && w?.turnstile?.remove) {
        try {
          w.turnstile.remove(turnstileWidgetId);
        } catch (error) {
          console.error(error);
        }
      }
      setTurnstileWidgetId(null);
      setTurnstileToken('');
    };
  }, [isOpen, selectedValue, turnstileReady]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={false}
      size={width < 768 ? 'full' : 'lg'}
      modalClassName="lg:max-w-[1050px] "
      showOverlay
      closeOnOverlayClick={false}
      contentClassName="p-0  h-full "
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Turnstile script (explicit render) */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setTurnstileReady(true)}
      />
      <div className="flex flex-col-reverse lg:h-[730px] md:h-[640px] h-auto lg:grid grid-cols-2 gap-1 p-0 justify-end overflow-hidden">
        {/* Left side */}
        <div className="w-full h-full mb-[70px] no-scrollbar md:mb-0 gap-10 p-8 md:px-16 md:py-12  flex flex-col justify-between items-center overflow-y-auto">
          <div className="max-w-[400px] flex flex-col h-full gap-6 mb-0 justify-between w-full">
            <div className="flex flex-col gap-6">
              <p className=" text-lg md:text-2xl font-byrd uppercase text-white">
                {selectedValue === 'login' ? t('login') : t('register')}
              </p>
              <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
                  <div className="flex flex-col gap-3 md:gap-4">
                    {selectedValue === 'register' ? (
                      <>
                        <Input
                          label="email"
                          isTranslated
                          type="email"
                          isRequired
                          background="dark"
                          size="lg"
                          registration={register('email')}
                          error={(errors as Record<string, any>)?.email?.message as string}
                        />

                        <Input
                          label="username"
                          isTranslated
                          background="dark"
                          size="lg"
                          isRequired
                          registration={register('username')}
                          error={(errors as Record<string, any>)?.username?.message as string}
                        />
                      </>
                    ) : (
                      <Input
                        label="email_or_username"
                        isTranslated
                        type="text"
                        isRequired
                        size="lg"
                        background="dark"
                        registration={register('login')}
                        error={(errors as Record<string, any>)?.login?.message as string}
                      />
                    )}
                    <PasswordInput
                      label="password"
                      isTranslated
                      background="dark"
                      isRequired
                      size="lg"
                      registration={register('password')}
                      error={errors.password?.message as string}
                    />

                    {/* {selectedValue === 'register' && passwordValue && passwordValue.length > 0 && (
                      <div className="text-sm text-white70 -mt-2">
                        <ul className="list-disc list-inside">
                          <li className={passwordValue?.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                            8 characters long
                          </li>
                          <li
                            className={
                              passwordValue?.match(/[!@#$%^&*(),.?":{}|<>]/) ? 'text-green-500' : 'text-red-500'
                            }
                          >
                            Special characters
                          </li>
                          <li className={passwordValue?.match(/[0-9]/) ? 'text-green-500' : 'text-red-500'}>Numbers</li>
                          <li className={passwordValue?.match(/[A-Z]/) ? 'text-green-500' : 'text-red-500'}>
                            Uppercase
                          </li>
                          <li className={passwordValue?.match(/[a-z]/) ? 'text-green-500' : 'text-red-500'}>
                            Lowercase
                          </li>
                        </ul>
                      </div>
                    )} */}

                    {selectedValue === 'register' && (
                      <Input
                        size="lg"
                        background="dark"
                        label="Referral code (optional)"
                        disabled={readOnlyRefCode}
                        defaultValue={referralCode}
                        value={referralCode}
                        onChange={e => setReferralCode(e.target.value)}
                        registration={register('referralCode')}
                        error={(errors as Record<string, any>)?.referralCode?.message as string}
                      />
                    )}
                  </div>
                  <Button
                    type="submit"
                    appearance="glossy"
                    isLoading={loginAction.isPending || registerAction.isPending}
                    loadingText={'...'}
                    intent="primary"
                    size="lg"
                    className={`uppercase ${!turnstileToken ? 'opacity-50' : ''}`}
                    disabled={!turnstileToken || loginAction.isPending || registerAction.isPending}
                  >
                    {t('play')}
                  </Button>
                  {selectedValue === 'register' && (
                    <Checkbox
                      label="readterms"
                      isTranslated
                      labelPosition="left"
                      checked={termsAccepted ?? false}
                      onChange={e => {
                        setTermsAccepted(e.target.checked);
                      }}
                    />
                  )}
                  {/* Turnstile widget container */}
                  <div className="min-h-[60px] max-h-[63px] rounded-lg overflow-hidden mix-blend-exclusion">
                    <div
                      data-appearance="always"
                      data-theme="dark"
                      data-size="flexible"
                      ref={turnstileContainerRef}
                      className="-m-1 -mb-2"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-1">
                {selectedValue === 'login' && (
                  <div
                    aria-hidden="true"
                    onClick={() => {
                      openModal('forgotPassword', 'forgotPassword');
                      onClose();
                    }}
                    className="text-center text-sm text-white cursor-pointer"
                  >
                    {t('forgot_password')}
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 text-sm text-white70 my-1">
                  {selectedValue === 'login' ? t('dont_have_an_account') : t('already_have_an_account')}{' '}
                  <span
                    tabIndex={3}
                    role="button"
                    onKeyDown={e =>
                      e.key === 'Enter' && setSelectedValue(selectedValue === 'login' ? 'register' : 'login')
                    }
                    onClick={() => setSelectedValue(selectedValue === 'login' ? 'register' : 'login')}
                    className="text-green-500"
                  >
                    {selectedValue === 'login' ? t('sign_up') : t('sign_in')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-5 text-gray-300 mb-3 mt-2">
                <span className="h-0.5 w-full bg-linebreak" />
                <span className="text-white50 text-sm whitespace-nowrap">{t('login_with')}</span>
                <span className="h-0.5 w-full bg-linebreak" />
              </div>

              <LoginOptions />
            </div>
          </div>
        </div>
        {/* Image */}
        <div className="md:hidden lg:block overflow-hidden max-md:h-[200px] overflow-hidden  lg:h-[730px] shrink-0">
          <Image
            src={buildImgixUrl(resolveImagePath(imageKey), {
              w: 525,
              h: 730,
              fit: 'crop',
              crop: 'focalpoint'
            })}
            alt={selectedValue === 'login' ? 'login' : 'register'}
            width={525}
            height={730}
            quality={100}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
