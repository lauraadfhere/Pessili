import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { getClinicianProfile, setClinicianStatus } from "@/lib/clinician/store";
import type { AvailabilityStatus } from "@/lib/clinician/demo";

const allowed: AvailabilityStatus[] = ["available", "busy", "offline"];

export async function GET() {
  const session = await getDemoSession();
  if (!session || session.role !== "doctor") {
    return NextResponse.json({ error: "Clinicians only" }, { status: 403 });
  }
  const profile = getClinicianProfile(session.email);
  return NextResponse.json({
    status: profile.status,
    displayName: profile.displayName,
    avatarDataUrl: profile.avatarDataUrl ?? null,
    updatedAt: profile.updatedAt,
  });
}

export async function PATCH(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "doctor") {
    return NextResponse.json({ error: "Clinicians only" }, { status: 403 });
  }
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status as AvailabilityStatus | undefined;
  if (!status || !allowed.includes(status)) {
    return NextResponse.json({ error: "status must be available | busy | offline" }, { status: 400 });
  }
  const profile = setClinicianStatus(session.email, status);
  return NextResponse.json({ status: profile.status, updatedAt: profile.updatedAt });
}
