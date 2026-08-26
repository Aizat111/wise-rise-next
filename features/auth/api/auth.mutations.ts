"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import type {
  IAuthData,
  ILoginResponse,
  IRegisterGiftRequest,
  IRegisterStep1Request,
  IRegisterStep2Request,
  IRegisterStep3Request,
  IRegisterStep4Request,
  IRegisterStepResponse,
  IRegisterStepUser,
  IWiseRiseRegisterRequest,
} from "@/core/types/auth.types";
import type {
  CheckoutRequest,
  CheckoutResult,
} from "@/core/types/payment.types";
import {
  persistAuthSession,
  setStoredUser,
  type StoredAuthUser,
} from "@/core/lib/token";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { clearActiveProfile } from "@/store/slices/profileSlice";
import { useAppDispatch } from "@/store/hooks";

import { authService } from "./auth.service";
import { paymentService } from "./payment.service";

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      { message?: string; error?: string } | string | undefined;

    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }
      if (typeof data.error === "string" && data.error.trim()) {
        return data.error;
      }
    }

    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function toStoredUser(user: unknown): StoredAuthUser | null {
  if (!user || typeof user !== "object") return null;
  if (!("id" in user) || (user as { id?: unknown }).id == null) return null;
  return user as StoredAuthUser;
}

function extractAccessToken(
  response: IRegisterStepResponse,
): string | undefined {
  if ("accessToken" in response && typeof response.accessToken === "string") {
    return response.accessToken;
  }
  if (
    "token" in response &&
    response.token &&
    typeof response.token === "object" &&
    "accessToken" in (response.token as object)
  ) {
    return (response.token as ILoginResponse).token;
  }
  return undefined;
}

function extractTokenString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  return undefined;
}

function unwrapGiftRegisterLogin(response: unknown): ILoginResponse {
  if (!response || typeof response !== "object") {
    throw new Error("Gift registration response missing token");
  }

  const body = response as Record<string, unknown>;

  if (body.success === false) {
    const message =
      typeof body.message === "string" && body.message.trim()
        ? body.message
        : "Gift registration failed";
    throw new Error(message);
  }

  const nested =
    body.data && typeof body.data === "object"
      ? (body.data as Record<string, unknown>)
      : null;

  const token =
    extractTokenString(body.token) ??
    extractTokenString(body.accessToken) ??
    (nested
      ? extractTokenString(nested.token) ??
        extractTokenString(nested.accessToken)
      : undefined);

  if (!token) {
    throw new Error("Gift registration response missing token");
  }

  const userSource = nested?.user ?? body.user;
  return {
    token,
    user: toStoredUser(userSource) ?? undefined,
  };
}

async function persistLoginSession(
  data: ILoginResponse,
): Promise<StoredAuthUser | null> {
  const userFromResponse = toStoredUser(data.user);
  persistAuthSession({
    token: data.token,
    user: userFromResponse,
  });

  if (userFromResponse) return userFromResponse;

  try {
    const me = await authService.me();
    const user = toStoredUser(me);
    if (user) setStoredUser(user);
    return user;
  } catch {
    return null;
  }
}

export function useLoginMutation() {
  return useMutation<ILoginResponse, Error, IAuthData>({
    mutationFn: async (data) => {
      const response = await authService.login(data);
      await persistLoginSession(response);
      return response;
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: IWiseRiseRegisterRequest) => authService.register(data),
  });
}

export function useRegisterStep1Mutation() {
  return useMutation<IRegisterStepUser, Error, IRegisterStep1Request>({
    mutationFn: (data) => authService.registerStep1(data),
  });
}

export function useRegisterStep2Mutation() {
  return useMutation<
    IRegisterStepResponse,
    Error,
    { id: string; data: IRegisterStep2Request }
  >({
    mutationFn: ({ id, data }) => authService.registerStep2(id, data),
  });
}

export function useRegisterStep3Mutation() {
  return useMutation<
    IRegisterStepResponse,
    Error,
    { id: string; data: IRegisterStep3Request }
  >({
    mutationFn: ({ id, data }) => authService.registerStep3(id, data),
  });
}

export function useRegisterStep4Mutation() {
  return useMutation<
    IRegisterStepResponse,
    Error,
    { id: string; data: IRegisterStep4Request }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await authService.registerStep4(id, data);
      const accessToken = extractAccessToken(response);
      if (accessToken) {
        await persistLoginSession({
          token: accessToken,
          user:
            toStoredUser(
              "user" in response
                ? response.user
                : "data" in response
                  ? response.data
                  : null,
            ) ?? undefined,
        });
      }
      return response;
    },
  });
}

export function useRegisterGiftMutation() {
  return useMutation<
    ILoginResponse,
    Error,
    { id: string; data: IRegisterGiftRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await authService.registerGift(id, data);
      const login = unwrapGiftRegisterLogin(response);
      await persistLoginSession(login);
      return login;
    },
  });
}

export function useCheckoutMutation() {
  return useMutation<CheckoutResult, Error, CheckoutRequest>({
    mutationFn: async (data) => {
      const result = await paymentService.completeCheckout(data);
      if (result.accessToken) {
        await persistLoginSession({
          token: result.accessToken,
        });
      }
      return result;
    },
  });
}

export function useLogoutMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch {
        // Clear local session even if the network request fails.
      }
    },
    onSettled: async () => {
      dispatch(logoutAction());
      dispatch(clearActiveProfile());
      queryClient.clear();
    },
  });
}
