import type { DemoSession } from "@/lib/demo-session";
import { buildPatientSerial } from "@/lib/patient/serial";
import { getPatientProfile } from "@/lib/patient/profile";

/** Patient serial (PeSSiLi code) — required for opening cloud media. */
export async function verifyPatientAccessCode(session: DemoSession | null, code: string): Promise<{ ok: boolean; patientId?: string; reason?: string }> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false, reason: "code_required" };

  if (!session) return { ok: false, reason: "sign_in_required" };

  if (session.role === "patient") {
    const profile = await getPatientProfile(session.email);
    const serial = (profile?.patientSerial ?? buildPatientSerial(session.email)).toUpperCase();
    if (serial !== normalized) return { ok: false, reason: "code_mismatch" };
    return { ok: true, patientId: session.email };
  }

  if (session.role === "doctor" || session.role === "admin") {
    /* Doctors must know the patient serial shared out-of-band — we only check format here; row must match serial in DB */
    if (!/^PSL-\d{4}-[A-Z0-9]{6,}$/.test(normalized)) return { ok: false, reason: "invalid_format" };
    return { ok: true, patientId: undefined };
  }

  return { ok: false, reason: "forbidden" };
}