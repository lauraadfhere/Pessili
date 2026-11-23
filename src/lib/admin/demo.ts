export const DEMO_ADMIN_KPIS = {
  patients: 1284,
  cliniciansOnline: 37,
  activeSessions: 14,
  urgentNow: 3,
  urgentToday: 41,
  avgTimeToClinicianMin: 6.2,
  openCrisis: 2,
  openTickets: 18,
  revenueTodayDzd: 215000,
};

export const DEMO_ADMIN_ALERTS = [
  { id: "a1", type: "coverage", messageKey: "coverageGap", tone: "warn" as const },
  { id: "a2", type: "licence", messageKey: "licenceExpiry", tone: "danger" as const },
  { id: "a3", type: "payment", messageKey: "paymentFailures", tone: "warn" as const },
];

export const DEMO_URGENT_QUEUE = [
  { id: "uq1", status: "waiting", waitMin: 8, language: "ar", wilaya: "16", risk: 2 },
  { id: "uq2", status: "offered", waitMin: 3, language: "fr", wilaya: "31", risk: 1 },
  { id: "uq3", status: "accepted", waitMin: 1, language: "ar", wilaya: "09", risk: 2 },
  { id: "uq4", status: "missed", waitMin: 16, language: "fr", wilaya: "19", risk: 1 },
];

export const DEMO_CRISIS_ALERTS = [
  { id: "c1", source: "screening", severity: 3, status: "New", slaSec: 90 },
  { id: "c2", source: "crisis_button", severity: 2, status: "Acknowledged", slaSec: 0 },
  { id: "c3", source: "clinician_flag", severity: 2, status: "In progress", slaSec: 0 },
];

export const DEMO_ON_CALL_ROTA = [
  { id: "oc1", name: "Dr. Amira S.", shift: "08:00–16:00", backup: "Dr. Karim L.", phone: "+213 555 0101", wilaya: "16" },
  { id: "oc2", name: "Dr. Yacine M.", shift: "16:00–00:00", backup: "Dr. Nadia B.", phone: "+213 555 0102", wilaya: "31" },
  { id: "oc3", name: "Dr. Sara H.", shift: "00:00–08:00", backup: "Dr. Amira S.", phone: "+213 555 0103", wilaya: "09" },
];

export const DEMO_HOTLINES = [
  { id: "h1", name: "National emergency", number: "14", region: "National", updated: "2026-01-15" },
  { id: "h2", name: "Algiers psych. emergency", number: "+213 21 XX XX XX", region: "Wilaya 16", updated: "2026-02-01" },
  { id: "h3", name: "Oran psych. emergency", number: "+213 41 XX XX XX", region: "Wilaya 31", updated: "2026-02-01" },
  { id: "h4", name: "Child protection hotline", number: "3033", region: "National", updated: "2025-11-20" },
];

export const DEMO_VERIFICATIONS = [
  { id: "v1", name: "Dr. Meriem K.", status: "Under review", slaHours: 18, specialty: "Clinical psychology" },
  { id: "v2", name: "Dr. Riad B.", status: "Needs changes", slaHours: 40, specialty: "Psychiatry" },
  { id: "v3", name: "Dr. Ines T.", status: "Submitted", slaHours: 6, specialty: "Clinical psychology" },
];

export const DEMO_LICENCE_MONITOR = [
  { id: "l1", name: "Dr. Farid A.", expiresInDays: 7, status: "critical" },
  { id: "l2", name: "Dr. Leila C.", expiresInDays: 14, status: "warn" },
  { id: "l3", name: "Dr. Omar Z.", expiresInDays: 28, status: "ok" },
];

export const DEMO_CLINICIAN_DIRECTORY = [
  { id: "cd1", name: "Dr. Amira S.", status: "online", language: "ar/fr", wilaya: "16", load: 2 },
  { id: "cd2", name: "Dr. Karim L.", status: "offline", language: "fr", wilaya: "31", load: 0 },
  { id: "cd3", name: "Dr. Nadia B.", status: "online", language: "ar", wilaya: "09", load: 1 },
];

export const DEMO_PATIENTS = [
  {
    id: "p1",
    email: "patient.a@example.dz",
    phone: "+213 555 1001",
    status: "active",
    wilaya: "16",
    subscription: "1000 DZD",
    lastLogin: "2026-03-18 09:12",
    language: "ar",
  },
  {
    id: "p2",
    email: "patient.b@example.dz",
    phone: "+213 555 1002",
    status: "locked",
    wilaya: "31",
    subscription: "500 DZD",
    lastLogin: "2026-03-10 21:04",
    language: "fr",
  },
  {
    id: "p3",
    email: "patient.c@example.dz",
    phone: "+213 555 1003",
    status: "unverified",
    wilaya: "19",
    subscription: "none",
    lastLogin: "—",
    language: "ar",
  },
];

export const DEMO_SESSIONS = [
  {
    id: "s1",
    mode: "live",
    patient: "p***@example.dz",
    clinician: "Dr. Amira S.",
    durationMin: 12,
    quality: "good",
    outcome: "in_progress",
  },
  {
    id: "s2",
    mode: "live",
    patient: "q***@example.dz",
    clinician: "Dr. Nadia B.",
    durationMin: 4,
    quality: "fair",
    outcome: "in_progress",
  },
  {
    id: "s3",
    mode: "past",
    patient: "r***@example.dz",
    clinician: "Dr. Karim L.",
    durationMin: 45,
    quality: "good",
    outcome: "completed",
  },
  {
    id: "s4",
    mode: "past",
    patient: "t***@example.dz",
    clinician: "Dr. Yacine M.",
    durationMin: 8,
    quality: "poor",
    outcome: "dropped",
  },
];

export const DEMO_TECH_DIAGNOSTICS = {
  dropRatePct: 4.2,
  fallbackUsagePct: 11,
  regionIssues: ["Wilaya 09 — high packet loss", "Wilaya 23 — ISP timeout spikes"],
  providerStatus: "operational" as const,
};

export const DEMO_SUPPORT_TICKETS = [
  { id: "tk1", category: "technical", subject: "Cannot join session", status: "open", lang: "fr", slaMin: 42 },
  { id: "tk2", category: "payment", subject: "Refund request", status: "assigned", lang: "ar", slaMin: 18 },
  { id: "tk3", category: "account", subject: "OTP not received", status: "resolved", lang: "fr", slaMin: 0 },
  { id: "tk4", category: "safety", subject: "User mentioned self-harm risk", status: "open", lang: "ar", slaMin: 5 },
  { id: "tk5", category: "clinician_complaint", subject: "Late start complaint", status: "open", lang: "fr", slaMin: 90 },
];

export const DEMO_SUPPORT_TEMPLATES = [
  { id: "tpl1", titleKey: "joinSession", lang: "fr" },
  { id: "tpl2", titleKey: "refundAck", lang: "ar" },
  { id: "tpl3", titleKey: "verifyEmail", lang: "fr" },
];

export const DEMO_SCREENING_TOOLS = [
  { id: "st1", name: "PHQ-9", version: "1.2", languages: "AR/FR", licence: "OK", signedOff: "2025-11-02" },
  { id: "st2", name: "GAD-7", version: "1.1", languages: "AR/FR", licence: "OK", signedOff: "2025-11-02" },
];

export const DEMO_RISK_RULES = [
  { id: "rr1", tool: "PHQ-9", trigger: "Item 9 ≥ 1", action: "crisis_protocol" },
  { id: "rr2", tool: "GAD-7", trigger: "Total ≥ 15", action: "elevated_flag" },
];

export const DEMO_TRANSLATIONS = [
  { id: "tr1", key: "screening.intro", ar: "أجب بصراحة…", fr: "Répondez honnêtement…", status: "approved" },
  { id: "tr2", key: "crisis.banner", ar: "أنت لست وحدك", fr: "Vous n'êtes pas seul(e)", status: "needs_review" },
];

export const DEMO_GROUNDING = [
  { id: "g1", title: "4-7-8 breathing", durationSec: 90, usedOn: "urgent_wait" },
  { id: "g2", title: "5-4-3-2-1 senses", durationSec: 120, usedOn: "urgent_wait" },
];

export const DEMO_AWARENESS_CMS = [
  { id: "aw1", title: "World Mental Health Day", status: "published", lang: "ar/fr" },
  { id: "aw2", title: "Exam stress tips", status: "draft", lang: "ar" },
  { id: "aw3", title: "Workplace wellbeing", status: "review", lang: "fr" },
];

export const DEMO_FINANCE = {
  consultationsDzd: 980000,
  subscriptionsDzd: 420000,
  institutionalDzd: 175000,
  payoutsPendingDzd: 310000,
  failedPayments: 7,
  holds: 4,
  refundsPending: 3,
};

export const DEMO_PAYOUTS = [
  { id: "po1", clinician: "Dr. Amira S.", netDzd: 42000, requestedBy: "finance.ops@pessili.dz", status: "pending" },
  { id: "po2", clinician: "Dr. Nadia B.", netDzd: 28500, requestedBy: "finance.ops@pessili.dz", status: "pending" },
  { id: "po3", clinician: "Dr. Karim L.", netDzd: 51000, requestedBy: "finance.ops@pessili.dz", status: "approved" },
];

export const DEMO_INSTITUTIONS = [
  { id: "i1", name: "Université d'Alger 1", type: "university", members: 420, status: "active" },
  { id: "i2", name: "Sonatrach Care", type: "employer", members: 180, status: "active" },
  { id: "i3", name: "NGO Espoir", type: "ngo", members: 65, status: "pilot" },
];

export const DEMO_CONSENT_VERSIONS = [
  { id: "cv1", name: "Privacy Policy", version: "2.4", published: "2026-01-10", acceptances: 1102 },
  { id: "cv2", name: "Telehealth Consent", version: "1.8", published: "2026-02-01", acceptances: 986 },
];

export const DEMO_DSR_QUEUE = [
  { id: "dsr1", type: "access", requester: "u***@mail.dz", status: "open", dueDays: 12 },
  { id: "dsr2", type: "deletion", requester: "v***@mail.dz", status: "in_progress", dueDays: 5 },
  { id: "dsr3", type: "correction", requester: "w***@mail.dz", status: "closed", dueDays: 0 },
];

export const DEMO_INCIDENTS = [
  { id: "inc1", title: "Payment webhook retry storm", severity: "medium", status: "resolved", deadline: "2026-03-01" },
  { id: "inc2", title: "Suspected credential stuffing", severity: "high", status: "investigating", deadline: "2026-03-20" },
];

export const DEMO_AUDIT_LOG = [
  { id: "au1", actor: "admin@pessili.dz", action: "verification.approve", resource: "v1", at: "2026-03-18 08:41" },
  { id: "au2", actor: "crisis@pessili.dz", action: "crisis.acknowledge", resource: "c1", at: "2026-03-18 09:02" },
  { id: "au3", actor: "support@pessili.dz", action: "patient.unlock", resource: "p2", at: "2026-03-18 10:15" },
  { id: "au4", actor: "finance@pessili.dz", action: "payout.request", resource: "po1", at: "2026-03-18 11:00" },
];

export const DEMO_STAFF = [
  { id: "stf1", name: "Amina Admin", email: "admin@pessili.dz", roles: ["Super Admin"], mfa: true },
  { id: "stf2", name: "Karim Crisis", email: "crisis@pessili.dz", roles: ["Crisis", "Support"], mfa: true },
  { id: "stf3", name: "Sara Finance", email: "finance@pessili.dz", roles: ["Finance"], mfa: true },
  { id: "stf4", name: "Omar Compliance", email: "compliance@pessili.dz", roles: ["Compliance"], mfa: false },
];

export const DEMO_CONFIG = {
  plan500: 500,
  plan1000: 1000,
  maxRequests: 20,
  maxMinutesPerDay: 20,
  urgentAcceptWindowSec: 45,
  urgentMaxWaitMin: 15,
  parallelOffers: 3,
  urgentPremiumDzd: 200,
};

export const DEMO_FEATURE_FLAGS = [
  { id: "ff1", key: "talk_now", enabled: true },
  { id: "ff2", key: "guardian_mode", enabled: true },
  { id: "ff3", key: "institution_portal", enabled: false },
  { id: "ff4", key: "psychiatrist_rx", enabled: true },
];

export const DEMO_INTEGRATIONS = [
  { id: "int1", name: "Payment gateway", status: "operational" },
  { id: "int2", name: "Video provider", status: "operational" },
  { id: "int3", name: "SMS / email", status: "degraded" },
  { id: "int4", name: "Object storage", status: "operational" },
];
