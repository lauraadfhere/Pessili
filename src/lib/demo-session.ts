import { cookies } from "next/headers";
import type { DemoRole } from "./demo-config";
import { DEMO_SESSION_COOKIE } from "./demo-config";

export type DemoSession = { email: string; role: DemoRole };

export async function getDemoSession(): Promise<DemoSession | null> {
  const jar = await cookies();
  const raw = jar.get(DEMO_SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DemoSession;
    if (!parsed?.email || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}