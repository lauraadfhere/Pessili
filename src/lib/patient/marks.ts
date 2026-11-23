import { ID, Query } from "appwrite";
import { getTablesServer } from "@/lib/appwrite/server";

export type DoctorMark = {
  $id?: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  score: number;
  note?: string;
  aiSummary?: string;
  read: boolean;
  createdAt: string;
};

const databaseId = () => process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";

const DEMO: Omit<DoctorMark, "patientId">[] = [
  {
    doctorId: "demo-psy-4",
    doctorName: "Dr. Karim Mesbah",
    score: 8,
    note: "Stable mood, continue sleep hygiene.",
    aiSummary: "AI: mild anxiety trend improving — maintain weekly check-ins.",
    read: false,
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
  },
];

export async function listPatientMarks(patientId: string): Promise<DoctorMark[]> {
  const tables = getTablesServer();
  if (!tables) return DEMO.map((m, i) => ({ ...m, patientId, $id: `demo-mark-${i}` }));

  try {
    const res = await tables.listRows({
      databaseId: databaseId(),
      tableId: "patient_marks",
      queries: [Query.equal("patientId", patientId), Query.orderDesc("createdAt"), Query.limit(30)],
    });
    const rows = res.rows as unknown as DoctorMark[];
    if (rows.length) return rows;
    return DEMO.map((m, i) => ({ ...m, patientId, $id: `demo-mark-${i}` }));
  } catch {
    return DEMO.map((m, i) => ({ ...m, patientId, $id: `demo-mark-${i}` }));
  }
}

export async function submitDoctorMark(input: {
  patientId: string;
  doctorId: string;
  doctorName: string;
  score: number;
  note: string;
}) {
  const tables = getTablesServer();
  const now = new Date().toISOString();
  const aiSummary = `AI: score ${input.score}/10 — ${input.note.slice(0, 120)}${input.note.length > 120 ? "…" : ""}`;
  const rowId = ID.unique();
  const data = {
    patientId: input.patientId,
    doctorId: input.doctorId,
    doctorName: input.doctorName,
    score: Math.min(10, Math.max(1, input.score)),
    note: input.note.trim(),
    aiSummary,
    read: false,
    createdAt: now,
  };
  if (!tables) return { $id: rowId, ...data };
  try {
    await tables.createRow({ databaseId: databaseId(), tableId: "patient_marks", rowId, data });
  } catch {
    /* demo */
  }
  return { $id: rowId, ...data };
}

export function latestAiInsight(marks: DoctorMark[]): string | null {
  const latest = marks[0];
  return latest?.aiSummary ?? null;
}