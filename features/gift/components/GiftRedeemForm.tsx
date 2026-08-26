"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/core/i18n/navigation";
import { getAuthErrorMessage } from "@/features/auth/api/auth.mutations";
import {
  REGISTER_ROUTES,
  useRegisterDraft,
} from "@/features/auth/hooks/useRegisterDraft";
import { cn } from "@/lib/utils";
import { notify } from "@/shared/components/notify";
import { useDebounce } from "@/shared/hooks/useDebounce";

import { useCheckGiftCodeQuery } from "../api/gift.queries";
import { GIFT_CODE_DEBOUNCE_MS, GIFT_TYPEFORM_URL } from "../constants";

const CODE_INPUT_ID = "gift-redeem-code";

export function GiftRedeemForm() {
  const t = useTranslations("useGift");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { startGiftRegister } = useRegisterDraft();

  const [code, setCode] = useState("");
  const debouncedCode = useDebounce(code.trim(), GIFT_CODE_DEBOUNCE_MS);
  const checkQuery = useCheckGiftCodeQuery(debouncedCode);

  const errorId = useId();
  const statusId = useId();

  const trimmed = code.trim();
  const isDebouncing = trimmed.length > 0 && trimmed !== debouncedCode;
  const isChecking = isDebouncing || checkQuery.isFetching;
  const matchesLatestCheck = trimmed.length > 0 && trimmed === debouncedCode;

  const isValid =
    matchesLatestCheck &&
    !isChecking &&
    checkQuery.isSuccess &&
    checkQuery.data.success === true;

  const isInvalid =
    matchesLatestCheck &&
    !isChecking &&
    checkQuery.isSuccess &&
    checkQuery.data.success === false;

  useEffect(() => {
    if (!checkQuery.isError) return;
    notify.error(
      getAuthErrorMessage(checkQuery.error, t("error")),
    );
  }, [checkQuery.error, checkQuery.isError, t]);

  const describedBy = isInvalid ? errorId : isValid ? statusId : undefined;
  const canSubmit = isValid && !isChecking;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    startGiftRegister(trimmed);
    router.push(REGISTER_ROUTES[1]);
  };

  return (
    <div className="w-full text-left">
      <h1 className="mb-3 text-2xl font-semibold text-white sm:text-3xl">
        {t("title")}
      </h1>
      <p className="mb-6 text-sm font-medium text-white/70 sm:text-base">
        {t("subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4" noValidate>
        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor={CODE_INPUT_ID} className="sr-only">
            {t("inputGiftCode")}
          </label>
          <div className="relative w-full">
            <Input
              id={CODE_INPUT_ID}
              type="text"
              name="code"
              autoComplete="off"
              spellCheck={false}
              placeholder={t("placeholder")}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              aria-invalid={isInvalid}
              aria-describedby={describedBy}
              aria-busy={isChecking}
              className={cn("pr-11", isValid && "border-emerald-500/70")}
            />
            {isChecking ? (
              <Loader2
                className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            ) : null}
          </div>
          {isChecking ? (
            <p className="sr-only" role="status">
              {tCommon("loading")}
            </p>
          ) : null}
          {isInvalid ? (
            <p id={errorId} className="text-sm text-red-500" role="alert">
              {t("invalidCode")}
            </p>
          ) : null}
          {isValid ? (
            <p id={statusId} className="text-sm text-emerald-400" role="status">
              {t("validCode")}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          nativeButton
          disabled={!canSubmit}
          className="h-11 w-50 text-sm font-semibold md:text-base"
        >
          {t("use")}
        </Button>
      </form>

      <div className="mt-8 text-sm text-white/70 sm:text-base">
        <p>{t("help")}</p>
        <a
          href={GIFT_TYPEFORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {tCommon("contactUs")}
        </a>
      </div>
    </div>
  );
}
