import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientNotifications } from "@/lib/patient/notifications";

export async function GET() {
  const session = await getDemoSession();
  if (!session || session.role !== "patient") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notifications = await getPatientNotifications(session.email);
  const unread = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unread, syncedAt: new Date().toISOString() });
}