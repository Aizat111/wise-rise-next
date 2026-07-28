"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/core/i18n/navigation";
import {
    getAuthErrorMessage,
    useRegisterStep1Mutation,
} from "@/features/auth/api/auth.mutations";
import { useRegisterDraft } from "@/features/auth/hooks/useRegisterDraft";

import { RegisterFormShell } from "./RegisterFormShell";
import { StickyContinueButton } from "./StickyContinueButton";

const FORM_ID = "register-step1-form";

function createStep1Schema(t: ReturnType<typeof useTranslations<"register.step1">>) {
    return z.object({
        email: z
            .string()
            .min(1, t("emailRequired"))
            .email(t("emailInvalid")),
        commercialConsent: z.boolean().optional(),
        privacyConsent: z.boolean().refine((value) => value === true, {
            message: t("privacyRequired"),
        }),
    });
}

export type Step1Values = z.infer<ReturnType<typeof createStep1Schema>>;

export function Step1() {
    const t = useTranslations("register.step1");
    const tCommon = useTranslations("common");
    const router = useRouter();
    const { draft, ready, updateDraft } = useRegisterDraft();
    const registerStep1 = useRegisterStep1Mutation();
    const [apiError, setApiError] = useState<string | null>(null);

    const schema = useMemo(() => createStep1Schema(t), [t]);
    const resolver = useMemo(() => standardSchemaResolver(schema), [schema]);
    const GOOGLE_AUTH_URL = "https://api4.wisenrise.com/auth/google";

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Step1Values>({
        mode: "onSubmit",
        reValidateMode: "onChange",
        resolver,
        defaultValues: {
            email: "",
            commercialConsent: false,
            privacyConsent: false,
        },
    });

    const isLoading = isSubmitting || registerStep1.isPending;

    useEffect(() => {
        if (!ready) return;
        reset({
            email: draft.email,
            commercialConsent: draft.commercialConsent,
            privacyConsent: draft.privacyConsent,
        });
    }, [ready, draft.email, draft.commercialConsent, draft.privacyConsent, reset]);

    const onSubmit = async (values: Step1Values) => {
        setApiError(null);
        const email = values.email.trim();

        try {
            const user = await registerStep1.mutateAsync({
                email,
                country_code: "90",
                phone_number: "5555555555",
            });
            updateDraft({
                registrationId: user.id,
                email,
                commercialConsent: Boolean(values.commercialConsent),
                privacyConsent: values.privacyConsent,
                step: 2,
            });
            router.push("/kayit-ol/sifre-olustur");
        } catch (error) {
            setApiError(getAuthErrorMessage(error, tCommon("errorMessage")));
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    };
    return (
        <RegisterFormShell title={t("title")} subtitle={t("subtitle")} step={1}>
            <form
                id={FORM_ID}
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-5"
                noValidate
            >
                <div className="flex w-full flex-col gap-1.5">


                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={handleGoogleLogin}
                        className="h-11 w-full text-sm md:text-base text-white/70 font-medium cursor-pointer"
                    >
                        <svg
                            className="mr-2 size-5"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                fill="#4285F4"
                                d="M21.35 12.27c0-.77-.07-1.51-.22-2.23H12v4.23h5.3a4.53 4.53 0 0 1-1.96 2.97v2.47h3.17c1.86-1.71 2.84-4.23 2.84-7.44z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 22c2.65 0 4.87-.88 6.5-2.36l-3.17-2.47c-.88.59-2.01.94-3.33.94-2.56 0-4.73-1.73-5.51-4.06H3.22v2.55A10 10 0 0 0 12 22z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M6.49 14.05A6 6 0 0 1 6.18 12c0-.71.12-1.4.31-2.05V7.4H3.22A10 10 0 0 0 2 12c0 1.61.39 3.14 1.22 4.6l3.27-2.55z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.88c1.45 0 2.75.5 3.77 1.48l2.82-2.82C16.86 2.93 14.64 2 12 2a10 10 0 0 0-8.78 5.4l3.27 2.55C7.27 7.61 9.44 5.88 12 5.88z"
                            />
                        </svg>
                        {t("googleLogin")}
                    </Button>
                    <p className="py-1 text-center text-sm text-muted-foreground">
                        {t("or")}
                    </p>
                    <Input
                        type="email"
                        autoComplete="email"
                        placeholder={t("emailPlaceholder")}
                        aria-invalid={Boolean(errors.email)}
                        disabled={isLoading}
                        {...register("email")}
                    />
                    {errors.email?.message ? (
                        <p className="text-sm text-red-500 text-left" role="alert">
                            {errors.email.message}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3">
                    <Controller
                        name="commercialConsent"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={Boolean(field.value)}
                                onChange={(e) => field.onChange(e.target.checked)}
                                disabled={isLoading}
                                label={
                                    <>
                                        <Link
                                            href="/ticari-elektronik-ileti"
                                            className="text-primary underline-offset-2 hover:underline"
                                            target="_blank"
                                        >
                                            {t("commercialMessage")}
                                        </Link>
                                        {t("commercialMessageText")}
                                    </>
                                }
                            />
                        )}
                    />
                    {errors.commercialConsent?.message ? (
                        <p className="text-sm text-red-500" role="alert">
                            {errors.commercialConsent.message}
                        </p>
                    ) : null}

                    <Controller
                        name="privacyConsent"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={Boolean(field.value)}
                                onChange={(e) => field.onChange(e.target.checked)}
                                disabled={isLoading}
                                label={
                                    <>
                                        <Link
                                            href="/gizlilik-politikasi"
                                            className="text-primary underline-offset-2 hover:underline font-medium"
                                            target="_blank"
                                        >
                                            {t("privacyPolicy")}
                                        </Link>
                                        {t("privacyPolicyText")}
                                    </>
                                }
                            />
                        )}
                    />
                    {errors.privacyConsent?.message ? (
                        <p className="text-sm text-red-500 text-left" role="alert">
                            {errors.privacyConsent.message}
                        </p>
                    ) : null}
                </div>
                <div className="text-xs md:text-sm text-white/70 font-medium text-left">
                    {t("termsText")}{" "}
                    <Link
                        href="/kullanici-sozlesmesi"
                        className="text-primary underline-offset-2 hover:underline"
                        target="_blank"
                    >
                        {t("terms")}
                    </Link>{" "}
                    {t("termsTextEnd")}
                </div>

                {apiError ? (
                    <p className="text-sm text-red-500 text-left" role="alert">
                        {apiError}
                    </p>
                ) : null}

                {/* Spacer so content can scroll past fixed button */}
                <div className="h-8" />

                <StickyContinueButton
                    formId={FORM_ID}
                    label={tCommon("continue")}
                    loadingLabel={tCommon("loading")}
                    loading={isLoading}
                    disabled={!ready}
                />
            </form>
        </RegisterFormShell>
    );
}
