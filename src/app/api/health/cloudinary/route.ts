import { NextResponse } from "next/server";
import { getCloudinaryConfig, isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { testCloudinaryConnection } from "@/lib/cloudinary/server";

export async function GET() {
  const configured = isCloudinaryConfigured();
  const cfg = getCloudinaryConfig();
  const test = await testCloudinaryConnection();
  return NextResponse.json({
    configured,
    cloudName: cfg?.cloudName ?? null,
    folder: cfg?.folder ?? null,
    connection: test,
  });
}