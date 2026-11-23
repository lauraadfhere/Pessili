/**
 * PeSSiLi schema on Appwrite TablesDB database `6afde2120005bf2a9749`.
 */
import { WILAYAS } from "./wilayas-data.mjs";

const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").replace(/\/$/, "");
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6afde2120005bf2a9749";

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
};

async function api(method, path, body) {
  const res = await fetch(`${endpoint}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok && res.status !== 409) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  return { status: res.status, json: text ? JSON.parse(text) : {} };
}

async function ensureTable(tableId, name) {
  await api("POST", `/tablesdb/${databaseId}/tables`, {
    tableId,
    name,
    permissions: ['read("any")', 'create("users")', 'read("users")', 'update("users")', 'delete("users")'],
  });
  console.log("  table", tableId);
  await new Promise((r) => setTimeout(r, 1500));
}

async function stringColumn(tableId, key, size, required = false, array = false) {
  await api("POST", `/tablesdb/${databaseId}/tables/${tableId}/columns/string`, {
    key,
    size,
    required,
    array,
  });
}

async function boolColumn(tableId, key, required = false, defaultValue = undefined) {
  const body = { key, required };
  if (defaultValue !== undefined && !required) body.default = defaultValue;
  await api("POST", `/tablesdb/${databaseId}/tables/${tableId}/columns/boolean`, body);
}

async function intColumn(tableId, key, required = false) {
  await api("POST", `/tablesdb/${databaseId}/tables/${tableId}/columns/integer`, { key, required });
}

async function datetimeColumn(tableId, key, required = false) {
  await api("POST", `/tablesdb/${databaseId}/tables/${tableId}/columns/datetime`, { key, required });
}

const TABLES = [
  {
    id: "wilayas",
    name: "Wilayas",
    cols: async () => {
      await stringColumn("wilayas", "code", 4, true);
      await stringColumn("wilayas", "name_fr", 128, true);
      await stringColumn("wilayas", "name_ar", 128, true);
      await stringColumn("wilayas", "name_en", 128);
      await boolColumn("wilayas", "active", true, true);
    },
  },
  {
    id: "profiles",
    name: "Profiles",
    cols: async () => {
      await stringColumn("profiles", "userId", 64, true);
      await stringColumn("profiles", "role", 24, true);
      await stringColumn("profiles", "fullName", 256);
      await stringColumn("profiles", "phone", 32);
      await stringColumn("profiles", "email", 256);
      await stringColumn("profiles", "wilayaCode", 4);
      await stringColumn("profiles", "language", 8);
    },
  },
  {
    id: "doctors",
    name: "Doctors",
    cols: async () => {
      await stringColumn("doctors", "userId", 64, true);
      await stringColumn("doctors", "specialty", 32, true);
      await stringColumn("doctors", "licenseNumber", 64);
      await boolColumn("doctors", "verified");
      await stringColumn("doctors", "languages", 8, false, true);
      await stringColumn("doctors", "wilayaCode", 4);
      await intColumn("doctors", "consultationPrice");
      await boolColumn("doctors", "onDemandAvailable");
    },
  },
  {
    id: "appointments",
    name: "Appointments",
    cols: async () => {
      await stringColumn("appointments", "patientId", 64, true);
      await stringColumn("appointments", "doctorId", 64, true);
      await stringColumn("appointments", "type", 16, true);
      await stringColumn("appointments", "status", 24, true);
      await datetimeColumn("appointments", "startAt", true);
      await intColumn("appointments", "durationMin", true);
    },
  },
  {
    id: "questionnaires",
    name: "Questionnaires",
    cols: async () => {
      await stringColumn("questionnaires", "code", 16, true);
      await stringColumn("questionnaires", "title_fr", 256);
      await stringColumn("questionnaires", "title_ar", 256);
    },
  },
  {
    id: "questionnaire_responses",
    name: "Questionnaire responses",
    cols: async () => {
      await stringColumn("questionnaire_responses", "patientId", 64, true);
      await stringColumn("questionnaire_responses", "questionnaireId", 64, true);
      await intColumn("questionnaire_responses", "totalScore");
      await boolColumn("questionnaire_responses", "riskFlag");
    },
  },
  {
    id: "consultation_reports",
    name: "Consultation reports",
    cols: async () => {
      await stringColumn("consultation_reports", "appointmentId", 64, true);
      await stringColumn("consultation_reports", "patientId", 64, true);
      await stringColumn("consultation_reports", "doctorId", 64, true);
      await stringColumn("consultation_reports", "impression", 4096);
    },
  },
  {
    id: "payments",
    name: "Payments",
    cols: async () => {
      await stringColumn("payments", "appointmentId", 64, true);
      await stringColumn("payments", "patientId", 64, true);
      await intColumn("payments", "amountDZD", true);
      await stringColumn("payments", "status", 24, true);
    },
  },
  {
    id: "notifications",
    name: "Notifications",
    cols: async () => {
      await stringColumn("notifications", "userId", 64, true);
      await stringColumn("notifications", "channel", 24, true);
      await stringColumn("notifications", "status", 24);
    },
  },
  {
    id: "audit_logs",
    name: "Audit logs",
    cols: async () => {
      await stringColumn("audit_logs", "actorId", 64, true);
      await stringColumn("audit_logs", "action", 128, true);
      await datetimeColumn("audit_logs", "createdAt");
    },
  },
];

async function seedWilayas() {
  for (const w of WILAYAS) {
    const rowId = `wilaya_${w.code}`;
    await api("POST", `/tablesdb/${databaseId}/tables/wilayas/rows`, {
      rowId,
      data: { code: w.code, name_fr: w.name_fr, name_ar: w.name_ar, name_en: w.name_fr, active: true },
    });
  }
  console.log(`Seeded ${WILAYAS.length} wilayas`);
}

async function main() {
  console.log("TablesDB:", databaseId, "project:", projectId);
  for (const t of TABLES) {
    await ensureTable(t.id, t.name);
    await t.cols();
    await new Promise((r) => setTimeout(r, 2000));
  }
  await seedWilayas();
  console.log("TablesDB setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});