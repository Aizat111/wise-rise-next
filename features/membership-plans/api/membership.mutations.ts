"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { QUERY_KEYS } from "@/core/api/query-keys";
import {
  getAuthErrorMessage,
  useLogoutMutation,
} from "@/features/auth/api/auth.mutations";
import { notify } from "@/shared/components/notify/store/notify.store";

import { membershipService } from "./membership.service";

export function useDisableAccountMutation() {
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutMutation();
  const t = useTranslations("pracingPlan");

  return useMutation({
    mutationFn: () => membershipService.disableAccount(),
    onSuccess: async () => {
      notify.success(t("cancelSuccess"));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order.all });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.account.subscriptionStatus,
      });
      await logoutMutation.mutateAsync();
    },
    onError: (error) => {
      notify.error(getAuthErrorMessage(error, t("cancelError")));
    },
  });
}
