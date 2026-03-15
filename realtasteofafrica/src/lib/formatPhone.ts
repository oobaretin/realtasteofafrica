/**
 * Build tel: href for click-to-call. US numbers → 10 digits only (no +1).
 */
export function toTelHref(phone: string | undefined): string {
  const digits = String(phone ?? "").replace(/\D/g, "")
  if (digits.length === 10) return digits
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1)
  if (digits.length >= 10) return digits.slice(-10)
  return digits
}

/**
 * Format phone number for display as (XXX) XXX-XXXX.
 * Handles 10-digit US, 11-digit with leading 1, and passes through others.
 */
export function formatPhoneDisplay(phone: string | undefined): string {
  const raw = String(phone ?? "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    return `(${last10.slice(0, 3)}) ${last10.slice(3, 6)}-${last10.slice(6)}`;
  }
  return raw;
}
