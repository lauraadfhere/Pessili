export type ClinicianNavKey =
  | "today"
  | "urgent"
  | "schedule"
  | "requests"
  | "patients"
  | "session"
  | "notes"
  | "followUp"
  | "referrals"
  | "earnings"
  | "profile"
  | "support"
  | "prescriptions";

export const CLINICIAN_NAV: { key: ClinicianNavKey; href: string }[] = [
  { key: "today", href: "/clinician/today" },
  { key: "urgent", href: "/clinician/urgent" },
  { key: "schedule", href: "/clinician/schedule" },
  { key: "requests", href: "/clinician/requests" },
  { key: "patients", href: "/clinician/patients" },
  { key: "session", href: "/clinician/session" },
  { key: "notes", href: "/clinician/notes" },
  { key: "followUp", href: "/clinician/follow-up" },
  { key: "referrals", href: "/clinician/referrals" },
  { key: "earnings", href: "/clinician/earnings" },
  { key: "profile", href: "/clinician/profile" },
  { key: "support", href: "/clinician/support" },
];

export const CLINICIAN_PSYCHIATRIST_EXTRA: { key: ClinicianNavKey; href: string } = {
  key: "prescriptions",
  href: "/clinician/prescriptions",
};
