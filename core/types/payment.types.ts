export interface PaymentCardInput {
  cardHolderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface ProcessPaymentRequest {
  planId: string;
  email: string;
  amount: number;
  card?: PaymentCardInput;
}

export interface ProcessPaymentResult {
  success: boolean;
  transactionId: string;
  provider: "mock" | "iyzico";
}

export interface CheckoutRequest {
  email: string;
  password: string;
  planId: string;
  commercialConsent: boolean;
  privacyConsent: boolean;
  card?: PaymentCardInput;
}

export interface CheckoutResult {
  payment: ProcessPaymentResult;
  accessToken?: string;
  hasSetGoal?: boolean;
}

/** Authenticated membership renewal — POST /payments/checkout */
export interface RenewMembershipRequest {
  card_number: string;
  expiration_month: string;
  expiration_year: string;
  cvc: string;
  cardholder_name: string;
  cardholder_surname: string;
  coupone_code?: string;
  plan_id: string;
}
