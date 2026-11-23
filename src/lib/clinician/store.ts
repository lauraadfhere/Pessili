import type { AvailabilityStatus } from "@/lib/clinician/demo";
import { DEMO_CLINICIAN } from "@/lib/clinician/demo";

export type ClinicianProfileState = {
  email: string;
  displayName: string;
  type: "psychologist" | "psychiatrist";
  status: AvailabilityStatus;
  bioAr: string;
  bioFr: string;
  languages: string[];
  formats: Array<"video" | "audio" | "chat">;
  specialties: string[];
  avatarDataUrl?: string;
  licenceExpiry: string;
  updatedAt: string;
};

type AnalyticsPoint = { label: string; sessions: number; urgent: number; earnings: number };

const globalStore = globalThis as typeof globalThis & {
  __pessiliClinicianStore?: Map<string, ClinicianProfileState>;
};

function store() {
  if (!globalStore.__pessiliClinicianStore) {
    globalStore.__pessiliClinicianStore = new Map();
  }
  return globalStore.__pessiliClinicianStore;
}

function defaultProfile(email: string): ClinicianProfileState {
  return {
    email,
    displayName: DEMO_CLINICIAN.displayName,
    type: DEMO_CLINICIAN.type,
    status: DEMO_CLINICIAN.status,
    bioAr: "أخصائي نفساني معتمد، خبرة في القلق والصدمات.",
    bioFr: "Psychologue clinicien, spécialisé anxiété et trauma.",
    languages: ["ar", "fr", "darija"],
    formats: ["video", "audio", "chat"],
    specialties: ["CBT", "Trauma", "Anxiety", "Young adults"],
    licenceExpiry: "2027-03-15",
    updatedAt: new Date().toISOString(),
  };
}

export function getClinicianProfile(email: string): ClinicianProfileState {
  const key = email.trim().toLowerCase();
  const existing = store().get(key);
  if (existing) return existing;
  const created = defaultProfile(key);
  store().set(key, created);
  return created;
}

export function updateClinicianProfile(
  email: string,
  patch: Partial<Omit<ClinicianProfileState, "email">>,
): ClinicianProfileState {
  const current = getClinicianProfile(email);
  const next: ClinicianProfileState = {
    ...current,
    ...patch,
    email: current.email,
    updatedAt: new Date().toISOString(),
  };
  if ("avatarDataUrl" in patch && !patch.avatarDataUrl) {
    delete next.avatarDataUrl;
  }
  store().set(current.email, next);
  return next;
}

export function setClinicianStatus(email: string, status: AvailabilityStatus) {
  return updateClinicianProfile(email, { status });
}

/** Deterministic weekly analytics for charts (stable per email). */
export function getClinicianAnalytics(email: string): {
  week: AnalyticsPoint[];
  formatMix: { format: string; count: number }[];
  riskAccepted: { level: string; count: number }[];
  totals: {
    weekSessions: number;
    acceptanceRate: number;
    avgResponseSec: number;
    monthEarningsDzd: number;
    rating: number;
  };
} {
  const seed = [...email].reduce((a, c) => a + c.charCodeAt(0), 0);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const week = days.map((label, i) => {
    const sessions = 1 + ((seed + i * 3) % 5);
    const urgent = (seed + i) % 3;
    const earnings = sessions * 500 + urgent * 150;
    return { label, sessions, urgent, earnings };
  });
  const weekSessions = week.reduce((s, d) => s + d.sessions, 0);
  return {
    week,
    formatMix: [
      { format: "video", count: 7 + (seed % 3) },
      { format: "audio", count: 3 + (seed % 2) },
      { format: "chat", count: 2 + (seed % 2) },
    ],
    riskAccepted: [
      { level: "1", count: 4 + (seed % 3) },
      { level: "2", count: 2 + (seed % 2) },
      { level: "3", count: seed % 2 },
    ],
    totals: {
      weekSessions,
      acceptanceRate: 88 + (seed % 10),
      avgResponseSec: 35 + (seed % 40),
      monthEarningsDzd: week.reduce((s, d) => s + d.earnings, 0) * 4,
      rating: Number((4.5 + (seed % 5) / 10).toFixed(1)),
    },
  };
}
