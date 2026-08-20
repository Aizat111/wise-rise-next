import { api } from "@/core/api/axios";
import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type { CertificateDetail } from "@/core/types/certificate.types";

type CertificateDetailParams = {
  userId: string | number;
  certificateId: string | number;
  signal?: AbortSignal;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function looksLikeCertificate(value: Record<string, unknown>): boolean {
  return (
    value.id != null ||
    value.uuid != null ||
    value.image != null ||
    value.thumbnail != null ||
    value.classroom != null ||
    value.file != null ||
    value.pdf != null ||
    value.pdf_url != null ||
    value.pdfUrl != null
  );
}

function toCertificate(
  value: Record<string, unknown>,
): CertificateDetail {
  const id = value.id ?? value.uuid;
  return {
    ...(value as CertificateDetail),
    id: (id as string | number | undefined) ?? "",
  };
}

function unwrapCertificate(
  response: unknown,
  depth = 0,
): CertificateDetail | null {
  if (response == null || depth > 4) return null;

  if (Array.isArray(response)) {
    const [first] = response;
    return unwrapCertificate(first, depth + 1);
  }

  if (!isRecord(response)) return null;

  for (const key of ["data", "certificate", "result", "item"]) {
    if (!(key in response)) continue;
    const nested = unwrapCertificate(response[key], depth + 1);
    if (nested) return nested;
  }

  if (looksLikeCertificate(response)) {
    return toCertificate(response);
  }

  return null;
}

export const certificateService = {
  async getDetail({
    userId,
    certificateId,
    signal,
  }: CertificateDetailParams): Promise<CertificateDetail> {
    const response = await clientRequest<unknown>({
      url: ENDPOINTS.certificates.detail(userId, certificateId),
      method: "GET",
      signal,
    });

    const certificate = unwrapCertificate(response);
    if (!certificate) {
      throw new Error("Certificate detail is empty");
    }

    return certificate;
  },

  async downloadPdfBlob(url: string): Promise<Blob> {
    const { data } = await api.request<Blob>({
      url,
      method: "GET",
      responseType: "blob",
    });

    return data;
  },
};
