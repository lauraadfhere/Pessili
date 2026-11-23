import { ID, Query } from "appwrite";
import { getTablesServer } from "@/lib/appwrite/server";
import type { DemoSession } from "@/lib/demo-session";
import { randomBytes } from "crypto";
import { buildPatientSerial } from "@/lib/patient/serial";

export type PatientProfile = {
  $id?: string;
  userId: string;
  role: string;
  email: string;
  fullName?: string;
  nickname?: string;
  phone?: string;
  wilayaCode?: string;
  language?: string;
  avatarUrl?: string;
  medicalHistory?: string;
  conditionsJson?: string;
  quickLoginToken?: string;
  birthYear?: number;
  gender?: string;
  patientSerial?: string;
};

function profileRowId(email: string) {
  const slug = Buffer.from(email.trim().toLowerCase()).toString("base64url").slice(0, 36);
  return `prof_${slug}`;
}

export async function getPatientProfile(email: string): Promise<PatientProfile | null> {
  const tables = getTablesServer();
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";
  if (!tables) return null;

  try {
    const list = await tables.listRows({
      databaseId,
      tableId: "profiles",
      queries: [Query.equal("email", email.toLowerCase()), Query.limit(1)],
    });
    const first = list.rows[0] as unknown as PatientProfile | undefined;
    if (first) {
      return {
        ...first,
        patientSerial: first.patientSerial || buildPatientSerial(email),
      };
    }
    const row = await tables.getRow({ databaseId, tableId: "profiles", rowId: profileRowId(email) });
    const rowProfile = row as unknown as PatientProfile;
    return {
      ...rowProfile,
      patientSerial: rowProfile.patientSerial || buildPatientSerial(email),
    };
  } catch {
    return null;
  }
}

export async function upsertPatientProfile(session: DemoSession, input: Partial<PatientProfile>) {
  const tables = getTablesServer();
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";
  if (!tables) throw new Error("Appwrite not configured");

  const rowId = profileRowId(session.email);
  const token = input.quickLoginToken ?? randomBytes(24).toString("hex");
  const now = new Date().toISOString();
  const existing = await getPatientProfile(session.email);
  const patientSerial = input.patientSerial ?? existing?.patientSerial ?? buildPatientSerial(session.email);

  const data = {
    userId: session.email,
    role: session.role,
    email: session.email,
    fullName: input.fullName ?? "",
    nickname: input.nickname ?? "",
    phone: input.phone ?? "",
    wilayaCode: input.wilayaCode ?? "",
    language: input.language ?? "fr",
    avatarUrl: input.avatarUrl ?? "",
    medicalHistory: input.medicalHistory ?? "",
    conditionsJson: input.conditionsJson ?? "[]",
    quickLoginToken: token,
    birthYear: input.birthYear ?? undefined,
    gender: input.gender ?? "",
    patientSerial,
    updatedAt: now,
  };

  try {
    await tables.updateRow({ databaseId, tableId: "profiles", rowId, data });
    return { ...data, $id: rowId, quickLoginToken: token };
  } catch {
    await tables.createRow({
      databaseId,
      tableId: "profiles",
      rowId,
      data: { ...data, createdAt: now },
    });
    return { ...data, $id: rowId, quickLoginToken: token };
  }
}

export async function findProfileByQuickToken(token: string): Promise<PatientProfile | null> {
  const tables = getTablesServer();
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";
  if (!tables || !token) return null;

  const list = await tables.listRows({
    databaseId,
    tableId: "profiles",
    queries: [Query.equal("quickLoginToken", token), Query.limit(1)],
  });
  return (list.rows[0] as unknown as PatientProfile) ?? null;
}

export { profileRowId, ID };