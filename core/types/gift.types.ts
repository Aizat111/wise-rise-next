export type BuyGiftRequest = {
  card_number: string;
  cvc: string;
  expiration_month: string;
  expiration_year: string;
  cardholder_name: string;
  cardholder_surname: string;
  sender_name: string;
  sender_surname: string;
  sender_email: string;
  country_code: number;
  phone_number: string;
  receiver_name: string;
  receiver_surname: string;
  receiver_email: string;
  gift_note: string;
  is_schedule: boolean;
  date: string;
  plan_id: string;
  installment: number;
  coupon_code: string;
  recaptcha_token: string | null;
};

export type BuyGiftResponse = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};
