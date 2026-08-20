"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { CertificateDetail } from "@/core/types/certificate.types";

import { certificateService } from "./certificate.service";

function isIdEnabled(
  value: string | number | null | undefined,
): value is string | number {
  return value != null && value !== "";
}

export function useCertificateDetailQuery(
  userId: string | number | null | undefined,
  certificateId: string | number | null | undefined,
  enabled = false,
) {
  const canFetch =
    enabled && isIdEnabled(userId) && isIdEnabled(certificateId);

  return useQuery<CertificateDetail>({
    queryKey: QUERY_KEYS.certificates.detail(
      userId ?? "none",
      certificateId ?? "none",
    ),
    queryFn: ({ signal }) =>
      certificateService.getDetail({
        userId: userId as string | number,
        certificateId: certificateId as string | number,
        signal,
      }),
    enabled: canFetch,
    staleTime: 5 * 60 * 1000,
  });
}
