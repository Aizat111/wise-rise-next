import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  IAuthData,
  ILoginResponse,
  IRegisterGiftRequest,
  IRegisterResponse,
  IRegisterStep1Request,
  IRegisterStep2Request,
  IRegisterStep3Request,
  IRegisterStep4Request,
  IRegisterStepResponse,
  IRegisterStepUser,
  IWiseRiseRegisterRequest,
} from "@/core/types/auth.types";
import type { IUser } from "@/core/types/user.types";

function unwrapRegisterStepUser(
  response: IRegisterStepResponse,
): IRegisterStepUser {
  if ("data" in response && response.data && typeof response.data === "object") {
    const nested = response.data as IRegisterStepUser;
    if (nested.id != null) {
      return { ...nested, id: String(nested.id) };
    }
  }

  if ("user" in response && response.user && typeof response.user === "object") {
    const user = response.user as IRegisterStepUser;
    if (user.id != null) {
      return { ...user, id: String(user.id) };
    }
  }

  if ("id" in response && response.id != null) {
    return {
      ...(response as IRegisterStepUser),
      id: String(response.id),
    };
  }

  throw new Error("Registration step response missing user id");
}

export const authService = {
  login(data: IAuthData) {
    return clientRequest<ILoginResponse>({
      url: ENDPOINTS.auth.login,
      method: "POST",
      data,
    });
  },

  register(data: IWiseRiseRegisterRequest) {
    return clientRequest<IRegisterResponse | ILoginResponse>({
      url: ENDPOINTS.auth.register,
      method: "POST",
      data,
    });
  },

  /** POST /register/1/steps */
  registerStep1(data: IRegisterStep1Request) {
    return clientRequest<IRegisterStepResponse>({
      url: ENDPOINTS.register.step1,
      method: "POST",
      data,
    }).then(unwrapRegisterStepUser);
  },

  /** POST /register/2/steps/{id} */
  registerStep2(id: string, data: IRegisterStep2Request) {
    return clientRequest<IRegisterStepResponse>({
      url: ENDPOINTS.register.step(2, id),
      method: "POST",
      data,
    });
  },

  /** POST /register/3/steps/{id} */
  registerStep3(id: string, data: IRegisterStep3Request) {
    return clientRequest<IRegisterStepResponse>({
      url: ENDPOINTS.register.step(3, id),
      method: "POST",
      data,
    });
  },

  /** POST /register/4/steps/{id} */
  registerStep4(id: string, data: IRegisterStep4Request) {
    return clientRequest<IRegisterStepResponse>({
      url: ENDPOINTS.register.step(4, id),
      method: "POST",
      data,
    });
  },

  /** POST /register/gift/{id} — attaches a verified gift code to the draft user */
  registerGift(id: string, data: IRegisterGiftRequest) {
    return clientRequest<IRegisterStepResponse>({
      url: ENDPOINTS.register.gift(id),
      method: "POST",
      data,
    });
  },

  logout() {
    return clientRequest({
      url: ENDPOINTS.auth.logout,
      method: "POST",
    });
  },

  me() {
    return clientRequest<IUser>({
      url: ENDPOINTS.auth.me,
      method: "GET",
    });
  },
};
