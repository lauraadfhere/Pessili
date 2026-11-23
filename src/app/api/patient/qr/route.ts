import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile } from "@/lib/patient/profile";
import { SITE_URL } from "@/lib/seo";

export async function GET(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "patient") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = new URL(request.url).searchParams.get("token");
  const profile = await getPatientProfile(session.email);
  const effective = token || profile?.quickLoginToken;
  if (!effective) return NextResponse.json({ error: "No token" }, { status: 404 });

  const url = `${SITE_URL}/fr/login?quick=${effective}`;
  const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 280 });
  return NextResponse.json({ dataUrl, url });
}