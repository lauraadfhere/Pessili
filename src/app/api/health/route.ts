import { NextResponse } from "next/server";
import { getTablesServer } from "@/lib/appwrite/server";

export async function GET() {
  const tables = getTablesServer();
  return NextResponse.json({
    ok: true,
    appwrite: {
      configured: Boolean(tables),
      projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? null,
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749",
    },
  });
}