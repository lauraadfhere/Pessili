/**
 * Provisions PeSSiLi Appwrite database + collections (see PESSILI_PLATFORM.md §8.4).
 * Usage: npm run appwrite:setup
 */
import { WILAYAS } from "./wilayas-data.mjs";

const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").replace(/\/$/, "");
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "pessili_main";

if (!projectId || !apiKey) {
  console.error("Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env.local");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
};

async function api(method, path, body) {
  const res = await fetch(`${endpoint}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok && res.status !== 409) {
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  return { status: res.status, json };
}

async function ensureDatabase() {
  try {
    await api("POST", "/databases", {
      databaseId,
      name: "PeSSiLi Main",
    });
    console.log("Created database", databaseId);
  } catch (e) {
    if (String(e.message).includes("409")) console.log("Database exists", databaseId);
    else throw e;
  }
}

async function ensureCollection(collectionId, name, permissions = ["read(\"any\")", "create(\"users\")", "read(\"users\")", "update(\"users\")", "delete(\"users\")"]) {
  try {
    await api("POST", `/databases/${databaseId}/collections`, {
      collectionId,
      name,
      permissions,
    });
    console.log("  + collection", collectionId);
  } catch (e) {
    if (String(e.message).includes("409")) console.log("  = collection", collectionId);
    else throw e;
  }
}

async function ensureStringAttr(collectionId, key, size, required = false, array = false) {
  try {
    await api("POST", `/databases/${databaseId}/collections/${collectionId}/attributes/string`, {
      key,
      size,
      required,
      array,
      default: array ? [] : undefined,
    });
  } catch (e) {
    if (!String(e.message).includes("409")) throw e;
  }
}

async function ensureBoolAttr(collectionId, key, required = false, defaultValue = undefined) {
  try {
    await api("POST", `/databases/${databaseId}/collections/${collectionId}/attributes/boolean`, {
      key,
      required,
      default: defaultValue,
    });
  } catch (e) {
    if (!String(e.message).includes("409")) throw e;
  }
}

async function ensureIntAttr(collectionId, key, required = false, min = undefined, max = undefined) {
  try {
    await api("POST", `/databases/${databaseId}/collections/${collectionId}/attributes/integer`, {
      key,
      required,
      min,
      max,
    });
  } catch (e) {
    if (!String(e.message).includes("409")) throw e;
  }
}

async function ensureDatetimeAttr(collectionId, key, required = false) {
  try {
    await api("POST", `/databases/${databaseId}/collections/${collectionId}/attributes/datetime`, {
      key,
      required,
    });
  } catch (e) {
    if (!String(e.message).includes("409")) throw e;
  }
}

async function waitAttributes(collectionId) {
  await new Promise((r) => setTimeout(r, 2000));
}

const COLLECTIONS = [
  {
    id: "wilayas",
    name: "Wilayas",
    attrs: async () => {
      await ensureStringAttr("wilayas", "code", 4, true);
      await ensureStringAttr("wilayas", "name_fr", 128, true);
      await ensureStringAttr("wilayas", "name_ar", 128, true);
      await ensureStringAttr("wilayas", "name_en", 128, false);
      await ensureBoolAttr("wilayas", "active", true, true);
    },
  },
  {
    id: "profiles",
    name: "Profiles",
    attrs: async () => {
      await ensureStringAttr("profiles", "userId", 64, true);
      await ensureStringAttr("profiles", "role", 24, true);
      await ensureStringAttr("profiles", "fullName", 256, false);
      await ensureStringAttr("profiles", "nickname", 128, false);
      await ensureStringAttr("profiles", "phone", 32, false);
      await ensureStringAttr("profiles", "email", 256, false);
      await ensureStringAttr("profiles", "wilayaCode", 4, false);
      await ensureStringAttr("profiles", "language", 8, false);
      await ensureIntAttr("profiles", "birthYear", false);
      await ensureStringAttr("profiles", "gender", 24, false);
      await ensureDatetimeAttr("profiles", "createdAt", false);
    },
  },
  {
    id: "doctors",
    name: "Doctors",
    attrs: async () => {
      await ensureStringAttr("doctors", "userId", 64, true);
      await ensureStringAttr("doctors", "specialty", 32, true);
      await ensureStringAttr("doctors", "licenseNumber", 64, false);
      await ensureStringAttr("doctors", "diplomaFileId", 64, false);
      await ensureStringAttr("doctors", "idFileId", 64, false);
      await ensureBoolAttr("doctors", "verified", false, false);
      await ensureStringAttr("doctors", "languages", 8, false, true);
      await ensureStringAttr("doctors", "wilayaCode", 4, false);
      await ensureStringAttr("doctors", "bio", 4096, false);
      await ensureIntAttr("doctors", "yearsExperience", false);
      await ensureIntAttr("doctors", "consultationPrice", false);
      await ensureBoolAttr("doctors", "onDemandAvailable", false, false);
      await ensureIntAttr("doctors", "rating", false);
    },
  },
  {
    id: "appointments",
    name: "Appointments",
    attrs: async () => {
      await ensureStringAttr("appointments", "patientId", 64, true);
      await ensureStringAttr("appointments", "doctorId", 64, true);
      await ensureStringAttr("appointments", "type", 16, true);
      await ensureStringAttr("appointments", "mode", 24, true);
      await ensureDatetimeAttr("appointments", "startAt", true);
      await ensureIntAttr("appointments", "durationMin", true);
      await ensureStringAttr("appointments", "status", 24, true);
      await ensureStringAttr("appointments", "roomId", 128, false);
      await ensureStringAttr("appointments", "paymentId", 64, false);
    },
  },
  {
    id: "questionnaires",
    name: "Questionnaires",
    attrs: async () => {
      await ensureStringAttr("questionnaires", "code", 16, true);
      await ensureStringAttr("questionnaires", "title_ar", 256, false);
      await ensureStringAttr("questionnaires", "title_fr", 256, false);
      await ensureStringAttr("questionnaires", "itemsJson", 16384, false);
      await ensureStringAttr("questionnaires", "scoringRules", 8192, false);
    },
  },
  {
    id: "questionnaire_responses",
    name: "Questionnaire responses",
    attrs: async () => {
      await ensureStringAttr("questionnaire_responses", "patientId", 64, true);
      await ensureStringAttr("questionnaire_responses", "questionnaireId", 64, true);
      await ensureStringAttr("questionnaire_responses", "answersJson", 16384, false);
      await ensureIntAttr("questionnaire_responses", "totalScore", false);
      await ensureStringAttr("questionnaire_responses", "severity", 32, false);
      await ensureBoolAttr("questionnaire_responses", "riskFlag", false, false);
      await ensureDatetimeAttr("questionnaire_responses", "createdAt", false);
    },
  },
  {
    id: "consultation_reports",
    name: "Consultation reports",
    attrs: async () => {
      await ensureStringAttr("consultation_reports", "appointmentId", 64, true);
      await ensureStringAttr("consultation_reports", "patientId", 64, true);
      await ensureStringAttr("consultation_reports", "doctorId", 64, true);
      await ensureStringAttr("consultation_reports", "clinicalNotes", 16384, false);
      await ensureStringAttr("consultation_reports", "impression", 4096, false);
      await ensureStringAttr("consultation_reports", "recommendations", 4096, false);
      await ensureDatetimeAttr("consultation_reports", "followUpDate", false);
      await ensureStringAttr("consultation_reports", "pdfFileId", 64, false);
      await ensureDatetimeAttr("consultation_reports", "createdAt", false);
    },
  },
  {
    id: "payments",
    name: "Payments",
    attrs: async () => {
      await ensureStringAttr("payments", "appointmentId", 64, true);
      await ensureStringAttr("payments", "patientId", 64, true);
      await ensureIntAttr("payments", "amountDZD", true);
      await ensureStringAttr("payments", "provider", 64, false);
      await ensureStringAttr("payments", "providerRef", 128, false);
      await ensureStringAttr("payments", "status", 24, true);
    },
  },
  {
    id: "notifications",
    name: "Notifications",
    attrs: async () => {
      await ensureStringAttr("notifications", "userId", 64, true);
      await ensureStringAttr("notifications", "channel", 24, true);
      await ensureStringAttr("notifications", "template", 64, false);
      await ensureDatetimeAttr("notifications", "sentAt", false);
      await ensureStringAttr("notifications", "status", 24, false);
    },
  },
  {
    id: "audit_logs",
    name: "Audit logs",
    attrs: async () => {
      await ensureStringAttr("audit_logs", "actorId", 64, true);
      await ensureStringAttr("audit_logs", "action", 128, true);
      await ensureStringAttr("audit_logs", "targetType", 64, false);
      await ensureStringAttr("audit_logs", "targetId", 64, false);
      await ensureStringAttr("audit_logs", "ip", 64, false);
      await ensureDatetimeAttr("audit_logs", "createdAt", false);
    },
  },
];

async function seedWilayas() {
  for (const w of WILAYAS) {
    const documentId = `wilaya_${w.code}`;
    try {
      await api("POST", `/databases/${databaseId}/collections/wilayas/documents`, {
        documentId,
        data: {
          code: w.code,
          name_fr: w.name_fr,
          name_ar: w.name_ar,
          name_en: w.name_en || w.name_fr,
          active: true,
        },
      });
      process.stdout.write(".");
    } catch (e) {
      if (String(e.message).includes("409")) process.stdout.write("s");
      else console.error("\nWilaya", w.code, e.message);
    }
  }
  console.log("\nWilayas seeded");
}

async function main() {
  console.log("Appwrite endpoint:", endpoint);
  console.log("Project:", projectId);
  await ensureDatabase();

  for (const col of COLLECTIONS) {
    await ensureCollection(col.id, col.name);
    await col.attrs();
    await waitAttributes(col.id);
  }

  console.log("Seeding wilayas…");
  await seedWilayas();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});