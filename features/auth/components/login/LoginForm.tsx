"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/core/i18n/navigation";
import {
    getAuthErrorMessage,
    useLoginMutation,
} from "@/features/auth/api/auth.mutations";
import { getAccessToken, getStoredUser, setAccessToken } from "@/core/lib/token";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { setAuthSession } from "@/store/slices/authSlice";

const GOOGLE_AUTH_URL = "https://api4.wisenrise.com/auth/google";

function createLoginSchema(t: ReturnType<typeof useTranslations<"login">>) {
    return z.object({
        email: z
            .string()
            .min(1, t("emailRequired"))
            .email(t("emailInvalid")),
        password: z
            .string()
            .min(1, t("passwordRequired"))
            .min(6, t("passwordMinLength")),
    });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

type LoginFormProps = {
    className?: string;
};

export const LoginForm = ({ className }: LoginFormProps) => {
    const t = useTranslations("login");
    const router = useRouter();
    const dispatch = useAppDispatch();
    const loginMutation = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const schema = useMemo(() => createLoginSchema(t), [t]);
    const resolver = useMemo(() => standardSchemaResolver(schema), [schema]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        mode: "onSubmit",
        reValidateMode: "onChange",
        resolver,
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const isLoading = loginMutation.isPending || isSubmitting;

    const onSubmit = async (values: LoginFormValues) => {
        setApiError(null);

        try {
            const response = await loginMutation.mutateAsync(values);
            console.log(response);
            dispatch(
                setAuthSession({
                    token: response.token || getAccessToken() || "",
                    user: getStoredUser(),
                }),
            );
            (response.token || getAccessToken() || "");
            router.push("/profil-sec");
        } catch (error) {
            setApiError(getAuthErrorMessage(error, t("loginError")));
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <div
            className={cn(
                "relative z-10 flex min-h-screen md:min-w-2xl items-start justify-start px-2 pt-[14vh] sm:px-10 md:px-25 md:py-35 ",
                className,
            )}
        >
            <div className="w-full md:max-w-lg border-none bg-black text-left py-10 px-5">
                <div className="mb-8 text-center">
                    <h2 className="mb-3 text-3xl font-semibold text-foreground sm:text-4xl">
                        {t("title")}
                    </h2>
                    <p className="text-sm font-medium text-white/90 antialiased sm:text-base">
                        {t("subtitle")}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-4"
                    noValidate
                >
                    <div className="flex w-full flex-col gap-1.5">
                        <Input
                            type="email"
                            autoComplete="email"
                            placeholder={t("emailPlaceholder")}
                            aria-invalid={Boolean(errors.email)}
                            disabled={isLoading}
                            {...register("email")}
                        />

                        {errors.email?.message ? (
                            <p className="text-sm text-red-500" role="alert">
                                {errors.email.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex w-full flex-col gap-1.5">
                        <div className="relative w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
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
                                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                        {errors.password?.message ? (
                            <p className="text-sm text-red-500" role="alert">
                                {errors.password.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex w-full justify-end">
                        <Link
                            href="/sifremi-unuttum"
                            className="text-sm md:text-md text-primary transition-colors hover:text-foreground"
                        >
                            {t("forgotPassword")}
                        </Link>
                    </div>

                    {apiError ? (
                        <p className="text-sm text-red-500" role="alert">
                            {apiError}
                        </p>
                    ) : null}

                    <Button
                        type="submit"
                        nativeButton
                        disabled={isLoading}
                        className="h-11 w-full text-sm md:text-base font-semibold cursor-pointer"
                    >
                        {isLoading ? t("submitting") : t("submit")}
                    </Button>

                    <p className="py-1 text-center text-sm text-muted-foreground">
                        {t("or")}
                    </p>

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
                </form>
                <div className="flex justify-center mt-5">
                    <p className="text-sm md:text-base text-white/70 font-medium">
                        {t("noAccount")}{" "}
                        <Link
                            href="/kayit-ol"
                            className="text-primary hover:text-foreground"
                        >
                            {t("registerNow")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
