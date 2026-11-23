import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { getClinicianProfile, updateClinicianProfile } from "@/lib/clinician/store";

export async function GET() {
  const session = await getDemoSession();
  if (!session || session.role !== "doctor") {
    return NextResponse.json({ error: "Clinicians only" }, { status: 403 });
  }
  return NextResponse.json({ profile: getClinicianProfile(session.email) });
}

export async function PATCH(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "doctor") {
    return NextResponse.json({ error: "Clinicians only" }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("avatar");
    const displayName = String(form.get("displayName") ?? "").trim();
    const bioAr = String(form.get("bioAr") ?? "");
    const bioFr = String(form.get("bioFr") ?? "");
    const patch: Parameters<typeof updateClinicianProfile>[1] = {};

    if (displayName) patch.displayName = displayName;
    if (form.has("bioAr")) patch.bioAr = bioAr;
    if (form.has("bioFr")) patch.bioFr = bioFr;

    if (String(form.get("removeAvatar")) === "1") {
      patch.avatarDataUrl = undefined;
    } else if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Avatar must be an image" }, { status: 400 });
      }
      if (file.size > 2_500_000) {
        return NextResponse.json({ error: "Avatar max 2.5 MB" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      patch.avatarDataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const profile = updateClinicianProfile(session.email, patch);
    return NextResponse.json({ profile });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const patch: Parameters<typeof updateClinicianProfile>[1] = {};
  if (typeof body.displayName === "string") patch.displayName = body.displayName.trim();
  if (typeof body.bioAr === "string") patch.bioAr = body.bioAr;
  if (typeof body.bioFr === "string") patch.bioFr = body.bioFr;
  if (Array.isArray(body.languages)) patch.languages = body.languages.map(String);
  if (Array.isArray(body.formats)) {
    patch.formats = body.formats.filter((f): f is "video" | "audio" | "chat" =>
      f === "video" || f === "audio" || f === "chat",
    );
  }
  if (Array.isArray(body.specialties)) patch.specialties = body.specialties.map(String);
  if (body.avatarDataUrl === null) patch.avatarDataUrl = undefined;
  if (typeof body.avatarDataUrl === "string" && body.avatarDataUrl.startsWith("data:image/")) {
    if (body.avatarDataUrl.length > 3_500_000) {
      return NextResponse.json({ error: "Avatar too large" }, { status: 400 });
    }
    patch.avatarDataUrl = body.avatarDataUrl;
  }

  const profile = updateClinicianProfile(session.email, patch);
  return NextResponse.json({ profile });
}
