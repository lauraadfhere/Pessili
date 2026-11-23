export const COOKIE_CONSENT_STORAGE_KEY = "pessili-cookie-consent";
export const OPEN_COOKIE_CONSENT_EVENT = "pessili-open-cookie-consent";

export type CookieConsentChoice = "all" | "rejected" | "essential";

export function openCookieConsent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_CONSENT_EVENT));
}