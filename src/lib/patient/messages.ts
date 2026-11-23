import { ID, Query } from "appwrite";
import { getTablesServer } from "@/lib/appwrite/server";

export type PatientMessage = {
  $id?: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  body: string;
  fromRole: "doctor" | "patient";
  read: boolean;
  createdAt: string;
};

const databaseId = () => process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";

const DEMO_THREAD: Omit<PatientMessage, "patientId">[] = [
  {
    doctorId: "demo-psy-4",
    doctorName: "Dr. Karim Mesbah",
    body: "Bonjour, j’ai reçu votre dossier. Pouvez-vous confirmer votre disponibilité pour une téléconsultation demain à 10 h ?",
    fromRole: "doctor",
    read: false,
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    doctorId: "demo-psy-4",
    doctorName: "Dr. Karim Mesbah",
    body: "Votre compte rendu PDF est disponible dans Dossier → Documents.",
    fromRole: "doctor",
    read: false,
    createdAt: new Date(Date.now() - 1800_000).toISOString(),
  },
];

export async function listPatientMessages(patientId: string): Promise<PatientMessage[]> {
  const tables = getTablesServer();
  if (!tables) {
    return DEMO_THREAD.map((m, i) => ({ ...m, patientId, $id: `demo-msg-${i}` }));
  }

  try {
    const res = await tables.listRows({
      databaseId: databaseId(),
      tableId: "patient_messages",
      queries: [Query.equal("patientId", patientId), Query.orderDesc("createdAt"), Query.limit(80)],
    });
    const rows = res.rows as unknown as PatientMessage[];
    if (rows.length) return rows;
    return DEMO_THREAD.map((m, i) => ({ ...m, patientId, $id: `demo-msg-${i}` }));
  } catch {
    return DEMO_THREAD.map((m, i) => ({ ...m, patientId, $id: `demo-msg-${i}` }));
  }
}

export async function createPatientMessage(patientId: string, body: string) {
  const tables = getTablesServer();
  if (!tables) throw new Error("Appwrite not configured");
  const now = new Date().toISOString();
  const rowId = ID.unique();
  const data = {
    patientId,
    doctorId: "demo-psy-4",
    doctorName: "Dr. Karim Mesbah",
    body: body.trim(),
    fromRole: "patient",
    read: true,
    createdAt: now,
  };
  try {
    await tables.createRow({ databaseId: databaseId(), tableId: "patient_messages", rowId, data });
    return { $id: rowId, ...data };
  } catch {
    return { $id: rowId, ...data };
  }
}

export async function markMessagesRead(patientId: string) {
  const tables = getTablesServer();
  if (!tables) return;
  try {
    const res = await tables.listRows({
      databaseId: databaseId(),
      tableId: "patient_messages",
      queries: [Query.equal("patientId", patientId), Query.equal("read", false), Query.limit(50)],
    });
    for (const row of res.rows) {
      const id = String((row as { $id?: string }).$id ?? "");
      if (!id.startsWith("demo-")) {
        await tables.updateRow({
          databaseId: databaseId(),
          tableId: "patient_messages",
          rowId: id,
          data: { read: true },
        });
      }
    }
  } catch {
    /* demo mode */
  }
}