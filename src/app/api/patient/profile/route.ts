import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile, upsertPatientProfile } from "@/lib/patient/profile";

export async function GET() {
  const session = await getDemoSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "patient") return NextResponse.json({ error: "Patients only" }, { status: 403 });

  const profile = await getPatientProfile(session.email);
  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const session = await getDemoSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "patient") return NextResponse.json({ error: "Patients only" }, { status: 403 });

  const body = (await request.json()) as Record<string, unknown>;
  try {
    const saved = await upsertPatientProfile(session, body);
    return NextResponse.json({ profile: saved, quickLoginToken: saved.quickLoginToken });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}