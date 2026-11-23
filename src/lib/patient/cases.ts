import { ID, Query } from "appwrite";
import { getTablesServer } from "@/lib/appwrite/server";

export const CASE_STATUSES = ["submitted", "triage", "assigned", "in_consultation", "report_ready", "closed"] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export type PatientCase = {
  $id?: string;
  patientId: string;
  title: string;
  bodyHtml?: string;
  status: CaseStatus;
  statusNote?: string;
  documentRefs?: string;
  createdAt?: string;
  updatedAt?: string;
};

const databaseId = () => process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";

export async function listPatientCases(patientId: string): Promise<PatientCase[]> {
  const tables = getTablesServer();
  if (!tables) return [];
  try {
    const res = await tables.listRows({
      databaseId: databaseId(),
      tableId: "patient_cases",
      queries: [Query.equal("patientId", patientId), Query.orderDesc("updatedAt"), Query.limit(50)],
    });
    return res.rows as unknown as PatientCase[];
  } catch {
    return [];
  }
}

export async function createPatientCase(patientId: string, input: { title: string; bodyHtml: string }) {
  const tables = getTablesServer();
  if (!tables) throw new Error("Appwrite not configured");
  const now = new Date().toISOString();
  const rowId = ID.unique();
  const data = {
    patientId,
    title: input.title.trim(),
    bodyHtml: input.bodyHtml,
    status: "submitted",
    statusNote: "Case received",
    documentRefs: "[]",
    createdAt: now,
    updatedAt: now,
  };
  await tables.createRow({ databaseId: databaseId(), tableId: "patient_cases", rowId, data });
  return { $id: rowId, ...data } as PatientCase;
}

export { ID };