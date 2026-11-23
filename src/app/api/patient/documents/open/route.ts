import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { signedAssetUrl } from "@/lib/cloudinary/server";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { listPatientMediaDocuments } from "@/lib/patient/media-documents";
import { getPatientProfile } from "@/lib/patient/profile";
import { buildPatientSerial } from "@/lib/patient/serial";
import { verifyPatientAccessCode } from "@/lib/patient/verify-access-code";

export async function POST(request: Request) {
  const session = await getDemoSession();
  const body = (await request.json()) as { docId?: string; code?: string };
  if (!body.docId?.trim() || !body.code?.trim()) {
    return NextResponse.json({ error: "docId and code required" }, { status: 400 });
  }

  const gate = await verifyPatientAccessCode(session, body.code);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.reason ?? "denied" }, { status: 403 });
  }

  const code = body.code.trim().toUpperCase();
  let docs;
  if (session?.role === "patient") {
    const patientEmail = session.email;
    const profile = await getPatientProfile(patientEmail);
    const serial = (profile?.patientSerial ?? buildPatientSerial(patientEmail)).toUpperCase();
    if (code !== serial) return NextResponse.json({ error: "code_mismatch" }, { status: 403 });
    docs = await listPatientMediaDocuments(patientEmail, serial);
  } else {
    const { listMediaByPatientSerial } = await import("@/lib/patient/media-documents");
    docs = await listMediaByPatientSerial(code);
    if (!docs.length) return NextResponse.json({ error: "code_mismatch" }, { status: 403 });
  }
  const doc = docs.find((d) => d.$id === body.docId);
  if (!doc) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const demoAsset =
    doc.$id?.startsWith("demo-media") ||
    doc.cloudinaryPublicId.startsWith("demo/");
  if (demoAsset || !isCloudinaryConfigured()) {
    const fallback = `/api/patient/records/pdf?doc=summary&code=${encodeURIComponent(body.code)}`;
    return NextResponse.json({ url: fallback, demo: true });
  }

  try {
    const url = signedAssetUrl(doc.cloudinaryPublicId, doc.resourceType === "image" ? "image" : "raw", 600);
    return NextResponse.json({ url, expiresInSec: 600 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "sign_failed" }, { status: 500 });
  }
}