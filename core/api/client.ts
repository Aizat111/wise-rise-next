import { api } from "./axios";
import { AxiosRequestConfig } from "axios";

export async function clientRequest<T>(config: AxiosRequestConfig) {
  const { data } = await api.request<T>(config);

  return data;
}
