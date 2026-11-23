import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { uploadPatientAsset } from "@/lib/cloudinary/server";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { createPatientMediaDocument } from "@/lib/patient/media-documents";
import { getPatientProfile } from "@/lib/patient/profile";
import { buildPatientSerial } from "@/lib/patient/serial";

export async function POST(request: Request) {
  const session = await getDemoSession();
  if (!session || (session.role !== "doctor" && session.role !== "admin")) {
    return NextResponse.json({ error: "Doctors only" }, { status: 403 });
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const patientEmail = String(form.get("patientEmail") ?? "").trim().toLowerCase();
  const patientSerial = String(form.get("patientSerial") ?? "").trim().toUpperCase();
  const title = String(form.get("title") ?? "Medical document").trim();

  if (!(file instanceof File)) return NextResponse.json({ error: "file required" }, { status: 400 });
  if (!patientEmail) return NextResponse.json({ error: "patientEmail required" }, { status: 400 });

  const profile = await getPatientProfile(patientEmail);
  const serial = (profile?.patientSerial ?? buildPatientSerial(patientEmail)).toUpperCase();
  if (patientSerial && patientSerial !== serial) {
    return NextResponse.json({ error: "Patient serial does not match profile" }, { status: 400 });
  }

  const mime = file.type || "application/octet-stream";
  const kind = mime.startsWith("image/") ? "image" : "pdf";
  if (kind === "pdf" && mime !== "application/pdf") {
    return NextResponse.json({ error: "PDF or image only" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadPatientAsset({
    buffer,
    fileName: file.name,
    mime,
    patientSerial: serial,
    kind,
  });

  const saved = await createPatientMediaDocument({
    patientId: patientEmail,
    patientSerial: serial,
    title,
    doctorName: session.email.split("@")[0],
    cloudinaryPublicId: uploaded.publicId,
    resourceType: kind === "pdf" ? "raw" : "image",
    format: kind === "pdf" ? "pdf" : mime.split("/")[1],
  });

  return NextResponse.json({ document: saved, cloudinary: { publicId: uploaded.publicId } });
}