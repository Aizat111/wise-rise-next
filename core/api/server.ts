import axios, { AxiosRequestConfig } from "axios";

export async function serverRequest<T>(
  config: AxiosRequestConfig,
  token?: string,
) {
  const { data } = await axios.request<T>({
    ...config,

    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api4.wisenrise.com",

    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  return data;
}
