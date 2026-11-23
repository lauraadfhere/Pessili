import { createHash } from "crypto";

/** Stable PeSSiLi patient ID for doctor consultations (copy/paste). */
export function buildPatientSerial(email: string): string {
  const digest = createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 10).toUpperCase();
  const year = new Date().getFullYear();
  return `PSL-${year}-${digest}`;
}