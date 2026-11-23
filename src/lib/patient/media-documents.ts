import { ID, Query } from "appwrite";
import { getTablesServer } from "@/lib/appwrite/server";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";

export type PatientMediaDocument = {
  $id?: string;
  patientId: string;
  patientSerial: string;
  title: string;
  doctorName?: string;
  cloudinaryPublicId: string;
  resourceType: "image" | "raw";
  format?: string;
  createdAt: string;
};

const databaseId = () => process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";

const DEMO: Omit<PatientMediaDocument, "patientId" | "patientSerial">[] = [
  {
    title: "Consultation report (demo)",
    doctorName: "Dr. Karim Mesbah",
    cloudinaryPublicId: "demo/consult-report",
    resourceType: "raw",
    format: "pdf",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export async function listPatientMediaDocuments(patientId: string, patientSerial: string): Promise<PatientMediaDocument[]> {
  const tables = getTablesServer();
  if (!tables) {
    return DEMO.map((d, i) => ({ ...d, patientId, patientSerial, $id: `demo-media-${i}` }));
  }
  try {
    const res = await tables.listRows({
      databaseId: databaseId(),
      tableId: "patient_media",
      queries: [Query.equal("patientId", patientId), Query.orderDesc("createdAt"), Query.limit(50)],
    });
    const rows = res.rows as unknown as PatientMediaDocument[];
    if (rows.length) return rows;
    return isCloudinaryConfigured()
      ? []
      : DEMO.map((d, i) => ({ ...d, patientId, patientSerial, $id: `demo-media-${i}` }));
  } catch {
    return DEMO.map((d, i) => ({ ...d, patientId, patientSerial, $id: `demo-media-${i}` }));
  }
}

export async function listMediaByPatientSerial(patientSerial: string): Promise<PatientMediaDocument[]> {
  const tables = getTablesServer();
  const serial = patientSerial.trim().toUpperCase();
  if (!tables) {
    return DEMO.map((d, i) => ({ ...d, patientId: "patient@demo.pessili.dz", patientSerial: serial, $id: `demo-media-${i}` }));
  }
  try {
    const res = await tables.listRows({
      databaseId: databaseId(),
      tableId: "patient_media",
      queries: [Query.equal("patientSerial", serial), Query.orderDesc("createdAt"), Query.limit(50)],
    });
    return res.rows as unknown as PatientMediaDocument[];
  } catch {
    return [];
  }
}

export async function createPatientMediaDocument(row: Omit<PatientMediaDocument, "$id" | "createdAt">) {
  const tables = getTablesServer();
  const now = new Date().toISOString();
  const rowId = ID.unique();
  const data = { ...row, createdAt: now };
  if (!tables) return { $id: rowId, ...data };
  try {
    await tables.createRow({ databaseId: databaseId(), tableId: "patient_media", rowId, data });
    return { $id: rowId, ...data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "create_failed";
    throw new Error(`patient_media save failed: ${msg}`);
  }
}