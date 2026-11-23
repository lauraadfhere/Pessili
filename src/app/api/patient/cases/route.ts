import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { createPatientCase, listPatientCases } from "@/lib/patient/cases";

export async function GET() {
  const session = await getDemoSession();
  if (!session || session.role !== "patient") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cases = await listPatientCases(session.email);
  return NextResponse.json({ cases, syncedAt: new Date().toISOString() });
}

export async function POST(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "patient") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { title?: string; bodyHtml?: string };
  if (!body.title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });

  try {
    const created = await createPatientCase(session.email, {
      title: body.title,
      bodyHtml: body.bodyHtml ?? "",
    });
    return NextResponse.json({ case: created });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}