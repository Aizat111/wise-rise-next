import { digitsOnly } from "@/shared/utils/card";

export function normalizePhoneNumber(value: string): string {
  const digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidPhoneNumber(value: string, countryCode: number): boolean {
  const digits = normalizePhoneNumber(value);
  if (countryCode === 90) {
    return /^5\d{9}$/.test(digits);
  }
  return digits.length >= 6 && digits.length <= 15;
}
