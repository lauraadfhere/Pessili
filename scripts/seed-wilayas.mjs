/** Re-run only wilaya documents (collections must exist). */
import { WILAYAS } from "./wilayas-data.mjs";

const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").replace(/\/$/, "");
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "pessili_main";

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
};

async function api(method, path, body) {
  const res = await fetch(`${endpoint}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok && res.status !== 409) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
}

async function main() {
  for (const w of WILAYAS) {
    await api("POST", `/databases/${databaseId}/collections/wilayas/documents`, {
      documentId: `wilaya_${w.code}`,
      data: { code: w.code, name_fr: w.name_fr, name_ar: w.name_ar, name_en: w.name_fr, active: true },
    });
  }
  console.log(`Seeded ${WILAYAS.length} wilayas`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});