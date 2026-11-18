import { NextResponse } from "next/server";
import { getAppwriteServer } from "@/lib/appwrite/server";

export async function GET() {
  const db = getAppwriteServer();
  return NextResponse.json({
    ok: true,
    appwrite: {
      configured: Boolean(db),
      projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? null,
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "pessili_main",
    },
  });
}