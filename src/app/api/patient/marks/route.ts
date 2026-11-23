import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { listPatientMarks } from "@/lib/patient/marks";

export async function GET() {
  const session = await getDemoSession();
  if (!session || session.role !== "patient") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const marks = await listPatientMarks(session.email);
  return NextResponse.json({ marks });
}