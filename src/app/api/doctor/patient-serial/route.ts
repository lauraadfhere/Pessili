import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile } from "@/lib/patient/profile";
import { buildPatientSerial } from "@/lib/patient/serial";

export async function GET(request: Request) {
  const session = await getDemoSession();
  if (!session || (session.role !== "doctor" && session.role !== "admin")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  const profile = await getPatientProfile(email);
  const serial = (profile?.patientSerial ?? buildPatientSerial(email)).toUpperCase();
  return NextResponse.json({ email, serial, fullName: profile?.fullName ?? null });
}