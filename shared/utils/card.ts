export type CardBrand = "visa" | "mastercard" | null;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCardNumber(digits: string): string {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function detectCardBrand(digits: string): CardBrand {
  if (!digits) return null;
  if (digits.startsWith("4")) return "visa";

  const two = Number(digits.slice(0, 2));
  if (two >= 51 && two <= 55) return "mastercard";

  if (digits.length >= 4) {
    const four = Number(digits.slice(0, 4));
    if (four >= 2221 && four <= 2720) return "mastercard";
  }

  return null;
}

export function parseExpiry(expiry: string): { month: string; year: string } {
  const [month = "", year = ""] = expiry.split("/");
  return {
    month,
    year: year.length === 2 ? `20${year}` : year,
  };
}
