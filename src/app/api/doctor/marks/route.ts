import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile } from "@/lib/patient/profile";
import { submitDoctorMark } from "@/lib/patient/marks";

export async function POST(request: Request) {
  const session = await getDemoSession();
  if (!session || (session.role !== "doctor" && session.role !== "admin")) {
    return NextResponse.json({ error: "Doctors only" }, { status: 403 });
  }

  const body = (await request.json()) as { patientEmail?: string; patientSerial?: string; score?: number; note?: string };
  let patientId = body.patientEmail?.trim().toLowerCase();
  if (!patientId && body.patientSerial) {
    /* resolve via profile list not implemented — require email for demo */
    patientId = "patient@demo.pessili.dz";
  }
  if (!patientId) return NextResponse.json({ error: "patientEmail required" }, { status: 400 });
  if (!body.note?.trim()) return NextResponse.json({ error: "note required" }, { status: 400 });

  const profile = await getPatientProfile(patientId);
  if (body.patientSerial && profile?.patientSerial && profile.patientSerial !== body.patientSerial) {
    return NextResponse.json({ error: "Serial mismatch" }, { status: 400 });
  }

  const created = await submitDoctorMark({
    patientId,
    doctorId: session.email,
    doctorName: session.email.split("@")[0].includes("doctor") ? "Dr. Karim Mesbah" : `Dr. ${session.email.split("@")[0]}`,
    score: Number(body.score ?? 7),
    note: body.note,
  });
  return NextResponse.json({ mark: created });
}