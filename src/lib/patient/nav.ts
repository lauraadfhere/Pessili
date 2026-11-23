export type PatientNavKey =
  | "dashboard"
  | "talkNow"
  | "screening"
  | "booking"
  | "sessions"
  | "cases"
  | "messages"
  | "records"
  | "payments"
  | "guardian"
  | "settings"
  | "profile";

export const PATIENT_NAV: { key: PatientNavKey; href: string }[] = [
  { key: "dashboard", href: "/patient/dashboard" },
  { key: "talkNow", href: "/patient/talk-now" },
  { key: "screening", href: "/patient/screening" },
  { key: "booking", href: "/patient/booking" },
  { key: "sessions", href: "/patient/sessions" },
  { key: "messages", href: "/patient/messages" },
  { key: "cases", href: "/patient/cases" },
  { key: "records", href: "/patient/records" },
  { key: "payments", href: "/patient/payments" },
  { key: "guardian", href: "/patient/guardian" },
  { key: "settings", href: "/patient/settings" },
  { key: "profile", href: "/patient/profile" },
];
