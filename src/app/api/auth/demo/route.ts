import { NextResponse } from "next/server";
import { findDemoUser, DEMO_SESSION_COOKIE } from "@/lib/demo-config";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email ?? "";
  const password = body?.password ?? "";
  const user = findDemoUser(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid demo credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, role: user.role, email: user.email });
  response.cookies.set(DEMO_SESSION_COOKIE, JSON.stringify({ email: user.email, role: user.role }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEMO_SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}