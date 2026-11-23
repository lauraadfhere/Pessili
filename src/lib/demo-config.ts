export type DemoRole = "patient" | "doctor" | "admin";

export type DemoUser = {
  email: string;
  password: string;
  role: DemoRole;
  labelKey: string;
};

export const DEMO_USERS: DemoUser[] = [
  { email: "patient@demo.pessili.dz", password: "DemoPatient2026!", role: "patient", labelKey: "patient" },
  { email: "doctor@demo.pessili.dz", password: "DemoDoctor2026!", role: "doctor", labelKey: "doctor" },
  { email: "admin@demo.pessili.dz", password: "DemoAdmin2026!", role: "admin", labelKey: "admin" },
];

export const DEMO_SESSION_COOKIE = "pessili_demo_session";

export function findDemoUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  return DEMO_USERS.find((user) => user.email === normalized && user.password === password) ?? null;
}