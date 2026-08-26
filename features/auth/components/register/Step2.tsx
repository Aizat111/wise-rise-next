"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { useRouter } from "@/core/i18n/navigation";
import { getAccessToken, getStoredUser } from "@/core/lib/token";
import {
  getAuthErrorMessage,
  useRegisterGiftMutation,
  useRegisterStep2Mutation,
} from "@/features/auth/api/auth.mutations";
import {
  canAccessStep,
  clearRegisterDraft,
  isGiftRegister,
  useRegisterDraft,
} from "@/features/auth/hooks/useRegisterDraft";
import { notify } from "@/shared/components/notify";
import { useAppDispatch } from "@/store/hooks";
import { setAuthSession } from "@/store/slices/authSlice";

import { RegisterFormShell } from "./RegisterFormShell";
import { StickyContinueButton } from "./StickyContinueButton";

const FORM_ID = "register-step2-form";

function createStep2Schema(t: ReturnType<typeof useTranslations<"register.step2">>) {
  return z.object({
    password: z
      .string()
      .min(1, t("passwordRequired"))
      .min(6, t("passwordMinLength")),
  });
}

export type Step2Values = z.infer<ReturnType<typeof createStep2Schema>>;

export function Step2() {
  const t = useTranslations("register.step2");
  const tGift = useTranslations("useGift");
  const tCommon = useTranslations("common");
  const tLogin = useTranslations("login");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { draft, ready, updateDraft } = useRegisterDraft();
  const registerStep2 = useRegisterStep2Mutation();
  const registerGift = useRegisterGiftMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const isGift = isGiftRegister(draft);

  const schema = useMemo(() => createStep2Schema(t), [t]);
  const resolver = useMemo(() => standardSchemaResolver(schema), [schema]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Step2Values>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver,
    defaultValues: { password: "" },
  });

  const isLoading =
    isSubmitting || registerStep2.isPending || registerGift.isPending;

  useEffect(() => {
    if (!ready) return;
    if (!canAccessStep(2, draft)) {
      router.replace("/kayit-ol");
      return;
    }
    reset({ password: draft.password });
  }, [ready, draft, reset, router]);

  const onSubmit = async (values: Step2Values) => {
    if (submittingRef.current || isLoading) return;
    setApiError(null);

    if (!draft.registrationId) {
      router.replace("/kayit-ol");
      return;
    }

    submittingRef.current = true;

    try {
      await registerStep2.mutateAsync({
        id: draft.registrationId,
        data: { password: values.password },
      });

      if (isGift && draft.giftCode) {
        const login = await registerGift.mutateAsync({
          id: draft.registrationId,
          data: { code: draft.giftCode },
        });
        dispatch(
          setAuthSession({
            token: login.token || getAccessToken() || "",
            user: getStoredUser(),
          }),
        );
        notify.success(tGift("success"));
        clearRegisterDraft();
        router.push("/profil-sec");
        return;
      }

      updateDraft({
        password: values.password,
        step: 3,
      });
      router.push("/kayit-ol/plan-sec");
    } catch (error) {
      const message = getAuthErrorMessage(
        error,
        isGift ? tGift("registerError") : tCommon("errorMessage"),
      );
      setApiError(message);
      if (isGift) notify.error(message);
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <RegisterFormShell title={t("title")} step={2} totalSteps={isGift ? 2 : 4}>
      <form
        id={FORM_ID}
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-1"
        noValidate
      >
        <div className="flex w-full flex-col gap-1.5">
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
              aria-invalid={Boolean(errors.password)}
              disabled={isLoading}
              className="pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? tLogin("hidePassword") : tLogin("showPassword")}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password?.message ? (
            <p className="text-sm text-red-500" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <p className="flex flex-col py-1 text-xs md:text-base font-medium text-left">
          {t("passwordMinLength")}
        </p>

        {apiError ? (
          <p className="text-sm text-red-500" role="alert">
            {apiError}
          </p>
        ) : null}

        <div className="h-8" />

        <StickyContinueButton
          formId={FORM_ID}
          label={isGift ? tGift("register") : tCommon("continue")}
          loadingLabel={tCommon("loading")}
          loading={isLoading}
          disabled={!ready}
        />
      </form>
    </RegisterFormShell>
  );
}
