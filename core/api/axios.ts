import axios from "axios";

import { getAccessToken } from "@/core/lib/token";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api4.wisenrise.com",

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
