import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { createPatientMessage, listPatientMessages, markMessagesRead } from "@/lib/patient/messages";

export async function GET(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "patient") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const markRead = new URL(request.url).searchParams.get("markRead") === "1";
  const messages = await listPatientMessages(session.email);
  const unread = messages.filter((m) => m.fromRole === "doctor" && !m.read).length;
  if (markRead) await markMessagesRead(session.email);
  return NextResponse.json({ messages, unread, syncedAt: new Date().toISOString() });
}

export async function POST(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "patient") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { text?: string };
  if (!body.text?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });
  try {
    const created = await createPatientMessage(session.email, body.text);
    return NextResponse.json({ message: created });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}