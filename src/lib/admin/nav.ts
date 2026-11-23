export type AdminNavKey =
  | "overview"
  | "urgentCrisis"
  | "clinicians"
  | "patients"
  | "sessions"
  | "support"
  | "content"
  | "finance"
  | "partnerships"
  | "compliance"
  | "system";

export const ADMIN_NAV: { key: AdminNavKey; href: string }[] = [
  { key: "overview", href: "/admin/overview" },
  { key: "urgentCrisis", href: "/admin/urgent-crisis" },
  { key: "clinicians", href: "/admin/clinicians" },
  { key: "patients", href: "/admin/patients" },
  { key: "sessions", href: "/admin/sessions" },
  { key: "support", href: "/admin/support" },
  { key: "content", href: "/admin/content" },
  { key: "finance", href: "/admin/finance" },
  { key: "partnerships", href: "/admin/partnerships" },
  { key: "compliance", href: "/admin/compliance" },
  { key: "system", href: "/admin/system" },
];
