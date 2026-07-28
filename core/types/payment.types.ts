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
