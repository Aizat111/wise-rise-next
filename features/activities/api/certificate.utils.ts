import type { Certificate } from "@/core/types/certificate.types";
import type { Classroom } from "@/core/types/classroom.types";
import {
  EMPTY_CERTIFICATE_IMAGE,
  type CertificateCardData,
} from "@/shared/ui/cards";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pickString(
  record: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return null;
}

function pickId(
  record: Record<string, unknown>,
  keys: string[],
): string | number | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return value;
  }
  return null;
}

function getNestedCertificateRecord(
  classroom: Classroom,
): Record<string, unknown> | null {
  const record = classroom as unknown as Record<string, unknown>;

  if (isRecord(record.certificate)) return record.certificate;

  if (Array.isArray(record.certificates)) {
    const [first] = record.certificates;
    if (isRecord(first)) return first;
  }

  return null;
}

function pickNestedPath(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value;
  if (!isRecord(value)) return null;
  return pickString(value, ["path", "url"]);
}

export function getCertificatePdfUrl(certificate: Certificate): string | null {
  const record = certificate as unknown as Record<string, unknown>;
  console.log(record);
  return (
    pickString(record, [
      "pdf_url",
      "pdfUrl",
      "download_url",
      "downloadUrl",
      "file_url",
      "fileUrl",
    ]) ??
    pickNestedPath(certificate.url) ??
    pickNestedPath(certificate.pdf)
  );
}

export function getCertificateShareUrl(
  certificate: Certificate,
): string | null {
  const record = certificate as unknown as Record<string, unknown>;

  return (
    pickString(record, [
      "public_url",
      "publicUrl",
      "share_url",
      "shareUrl",
      "url",
      "link",
    ]) ?? getCertificatePdfUrl(certificate)
  );
}

export function getCertificateImageUrl(
  certificate: Certificate,
): string | null {
  return (
    pickNestedPath(certificate.image) ?? pickNestedPath(certificate.thumbnail)
  );
}

export function mapWatchedClassroomToCertificateCard(
  classroom: Classroom,
  fallbackUserId: string | number,
): CertificateCardData {
  const record = classroom as unknown as Record<string, unknown>;
  const nestedCertificate = getNestedCertificateRecord(classroom);

  const certificateId =
    (nestedCertificate
      ? pickId(nestedCertificate, [
          "id",
          "uuid",
          "certificate_id",
          "certificateId",
        ])
      : null) ??
    pickId(record, ["certificate_id", "certificateId", "uuid"]) ??
    classroom.id;

  const userId =
    (nestedCertificate
      ? pickId(nestedCertificate, [
          "user_id",
          "userId",
          "profile_id",
          "profileId",
        ])
      : null) ??
    pickId(record, ["user_id", "userId", "profile_id", "profileId"]) ??
    fallbackUserId;

  return {
    id: classroom.id,
    userId,
    certificateId,
    image: EMPTY_CERTIFICATE_IMAGE,
    teacherLogo:
      classroom.teacher?.logo?.path ?? classroom.teacher?.photo?.path ?? null,
    courseName: classroom.name,
    categoryName: classroom.category?.name ?? null,
  };
}

export function mapWatchedClassroomsToCertificateCards(
  classrooms: Classroom[],
  fallbackUserId: string | number,
): CertificateCardData[] {
  return classrooms.map((classroom) =>
    mapWatchedClassroomToCertificateCard(classroom, fallbackUserId),
  );
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}

export function isPdfBlob(blob: Blob): boolean {
  return blob.type.includes("pdf") || blob.type === "application/octet-stream";
}
