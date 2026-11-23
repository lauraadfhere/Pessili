export const DEMO_SUBSCRIPTION = {
  plan: "monthly" as const,
  requestsLeft: 17,
  requestsTotal: 20,
  minutesLeft: 14,
  minutesDaily: 20,
  walletDzd: 1500,
};

export const DEMO_SESSIONS = [
  {
    id: "ps1",
    clinician: "Dr. Amine B.",
    when: "Today · 18:00 (Algeria)",
    format: "video" as const,
    status: "upcoming" as const,
  },
  {
    id: "ps2",
    clinician: "Dr. Meriem K.",
    when: "Yesterday · 11:00",
    format: "audio" as const,
    status: "past" as const,
  },
  {
    id: "ps3",
    clinician: "Dr. Riad B.",
    when: "Mon · 09:30",
    format: "chat" as const,
    status: "missed" as const,
  },
];

export const DEMO_PAYMENTS = [
  { id: "pay1", label: "Consultation · Dr. Amine B.", amount: 500, status: "paid", date: "2026-11-12" },
  { id: "pay2", label: "Monthly subscription", amount: 1000, status: "paid", date: "2026-11-01" },
  { id: "pay3", label: "Urgent hold released", amount: 500, status: "refunded", date: "2026-10-28" },
];

export const DEMO_DEPENDENTS = [
  { id: "d1", name: "Yasmine", ageBand: "14–17", consent: "guardian", nextSession: "Fri 16:00" },
  { id: "d2", name: "Omar", ageBand: "adult", consent: "invited", nextSession: null },
];

export const DEMO_CONSENT_HISTORY = [
  { id: "c1", labelKey: "healthData", when: "2026-10-02" },
  { id: "c2", labelKey: "terms", when: "2026-10-02" },
  { id: "c3", labelKey: "crisisContact", when: "2026-11-01" },
];

export const DEMO_DEVICES = [
  { id: "dev1", name: "Chrome · Windows", lastActive: "Now", current: true },
  { id: "dev2", name: "Safari · iPhone", lastActive: "2 days ago", current: false },
  { id: "dev3", name: "Firefox · Android", lastActive: "1 week ago", current: false },
];
