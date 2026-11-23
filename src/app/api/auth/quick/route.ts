import { NextResponse } from "next/server";
import { findProfileByQuickToken } from "@/lib/patient/profile";
import { DEMO_SESSION_COOKIE } from "@/lib/demo-config";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { token?: string } | null;
  const token = body?.token?.trim();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const profile = await findProfileByQuickToken(token);
  if (!profile?.email) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const response = NextResponse.json({
    ok: true,
    email: profile.email,
    role: profile.role ?? "patient",
  });
  response.cookies.set(
    DEMO_SESSION_COOKIE,
    JSON.stringify({ email: profile.email, role: profile.role ?? "patient" }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  );
  return response;
}