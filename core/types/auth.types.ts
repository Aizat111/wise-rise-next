import type { IUser } from "./user.types";

export interface IAuthData {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  need_change_password?: boolean | null;
  /** True when the user has completed the "hedefini belirle" onboarding step */
  hasSetGoal?: boolean;
  /** Present when the auth API returns the user alongside tokens */
  user?:
    | IUser
    | {
        id: string | number;
        email?: string;
        name?: string;
        [key: string]: unknown;
      };
}

export interface IRegisterResponse {
  user: IUser;
  token: ILoginResponse;
  country_code?: string | null;
}

/** Wise&Rise registration payload for the multi-step register flow */
export interface IWiseRiseRegisterRequest {
  email: string;
  password: string;
  planId: string;
  commercialConsent: boolean;
  privacyConsent: boolean;
}

/** Multi-step register API — POST /register/{currentStep}/steps/{id} */
export interface IRegisterStep1Request {
  email: string;
  country_code: string;
  phone_number: string;
}

export interface IRegisterStep2Request {
  password: string;
}

/** POST /register/gift/{id} */
export interface IRegisterGiftRequest {
  code: string;
}

export interface IRegisterStep3Request {
  plan_id: string;
}

export interface IRegisterStep4Request {
  card_number: string;
  expiration_month: string;
  expiration_year: string;
  cvc: string;
  cardholder_name: string;
  cardholder_surname: string;
  coupone_code?: string;
}

export interface IRegisterStepUser {
  id: string;
  email?: string;
  [key: string]: unknown;
}

export type IRegisterStepResponse =
  | IRegisterStepUser
  | { data: IRegisterStepUser }
  | (ILoginResponse & { data?: IRegisterStepUser; user?: IRegisterStepUser });
