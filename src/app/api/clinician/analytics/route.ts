import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { getClinicianAnalytics, getClinicianProfile } from "@/lib/clinician/store";

export async function GET() {
  const session = await getDemoSession();
  if (!session || session.role !== "doctor") {
    return NextResponse.json({ error: "Clinicians only" }, { status: 403 });
  }
  const analytics = getClinicianAnalytics(session.email);
  const profile = getClinicianProfile(session.email);
  return NextResponse.json({ analytics, status: profile.status });
}
