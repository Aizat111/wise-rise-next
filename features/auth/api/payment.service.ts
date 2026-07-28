import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  ILoginResponse,
  IRegisterResponse,
  IWiseRiseRegisterRequest,
} from "@/core/types/auth.types";
import type {
  CheckoutRequest,
  CheckoutResult,
  ProcessPaymentRequest,
  ProcessPaymentResult,
} from "@/core/types/payment.types";
import { isAxiosError } from "axios";

import { authService } from "@/features/auth/api/auth.service";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractTokens(
  result: IRegisterResponse | ILoginResponse,
): Pick<CheckoutResult, "accessToken" | "hasSetGoal"> {
  if ("token" in result && result.token) {
    return {
      accessToken: result.token as string,
      hasSetGoal: (result.token as ILoginResponse).hasSetGoal,
    };
  }

  const login = result as ILoginResponse;
  return {
    accessToken: result.token as string,
    hasSetGoal: login.hasSetGoal,
  };
}

function isRegisterNotFound(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  if (error.response?.status === 404) return true;

  const data = error.response?.data;
  if (data && typeof data === "object" && "message" in data) {
    return (
      String((data as { message?: string }).message).toLowerCase() ===
      "not found"
    );
  }
  return false;
}

/**
 * Payment provider adapter (mock today, Iyzico-ready tomorrow).
 * Swap `processPayment` implementation when the real provider is wired.
 */
export const paymentService = {
  async processPayment(
    request: ProcessPaymentRequest,
  ): Promise<ProcessPaymentResult> {
    await delay(900);

    if (!request.planId || !request.email) {
      throw new Error("Missing payment details");
    }

    // Future: POST ENDPOINTS.payment.checkout with provider payload
    void ENDPOINTS.payment.checkout;

    return {
      success: true,
      transactionId: `mock_${Date.now()}`,
      provider: "mock",
    };
  },

  async completeCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
    const payment = await paymentService.processPayment({
      planId: request.planId,
      email: request.email,
      amount: 0,
      card: request.card,
    });

    const registerPayload: IWiseRiseRegisterRequest = {
      email: request.email,
      password: request.password,
      planId: request.planId,
      commercialConsent: request.commercialConsent,
      privacyConsent: request.privacyConsent,
    };

    try {
      const registerResult = await authService.register(registerPayload);
      return {
        payment,
        ...extractTokens(registerResult),
      };
    } catch (error) {
      // Register endpoint may not be live yet — keep checkout usable with mock activation
      if (!isRegisterNotFound(error)) throw error;

      return {
        payment,
        accessToken: `mock_access_${Date.now()}`,
        hasSetGoal: false,
      };
    }
  },
};
