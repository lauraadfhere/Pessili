export type AvailabilityStatus = "available" | "busy" | "offline";

export type UrgentOffer = {
  id: string;
  ageBand: string;
  language: string;
  reason: string;
  riskLevel: 1 | 2 | 3;
  waitMinutes: number;
  wilaya: string;
  format: "video" | "audio" | "chat";
  secondsLeft: number;
};

export type ClinicianSession = {
  id: string;
  patientFirstName: string;
  time: string;
  format: "video" | "audio" | "chat";
  status: "upcoming" | "live" | "done" | "missed";
};

export type CarePatient = {
  id: string;
  firstName: string;
  wilaya: string;
  status: "active" | "paused" | "discharged";
  nextSession?: string;
  unpaid: boolean;
};

export const DEMO_CLINICIAN = {
  displayName: "Dr. Amine B.",
  type: "psychologist" as "psychologist" | "psychiatrist",
  status: "available" as AvailabilityStatus,
  rating: 4.8,
  weekSessions: 12,
  acceptanceRate: "92%",
  responseTime: "48 s",
  monthEarningsDzd: 84000,
};

export const DEMO_URGENT_OFFERS: UrgentOffer[] = [
  {
    id: "uo-1",
    ageBand: "25–34",
    language: "ar",
    reason: "Anxiety / panic",
    riskLevel: 2,
    waitMinutes: 4,
    wilaya: "16",
    format: "video",
    secondsLeft: 72,
  },
];

export const DEMO_TODAY_SESSIONS: ClinicianSession[] = [
  { id: "s1", patientFirstName: "Sara", time: "10:00", format: "video", status: "upcoming" },
  { id: "s2", patientFirstName: "Karim", time: "14:30", format: "audio", status: "upcoming" },
  { id: "s3", patientFirstName: "Lina", time: "18:00", format: "chat", status: "upcoming" },
];

export const DEMO_REQUESTS = [
  { id: "r1", patient: "Nour M.", slot: "Thu 11:00", format: "video", sharedScreening: true },
  { id: "r2", patient: "Yacine H.", slot: "Fri 16:00", format: "audio", sharedScreening: false },
];

export const DEMO_PATIENTS: CarePatient[] = [
  { id: "p1", firstName: "Sara", wilaya: "16", status: "active", nextSession: "Today 10:00", unpaid: false },
  { id: "p2", firstName: "Karim", wilaya: "31", status: "active", nextSession: "Today 14:30", unpaid: false },
  { id: "p3", firstName: "Lina", wilaya: "09", status: "paused", unpaid: true },
];

export const DEMO_TASKS = [
  { id: "t1", label: "Sign note — Sara (yesterday)", due: "Today" },
  { id: "t2", label: "Report due — Karim", due: "Tomorrow" },
  { id: "t3", label: "Licence renewal reminder", due: "30 days" },
];
