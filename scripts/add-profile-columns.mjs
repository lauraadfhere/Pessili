/** Adds extended patient profile columns to TablesDB (safe to re-run). */
const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").replace(/\/$/, "");
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6afde2120005bf2a9749";
const headers = { "Content-Type": "application/json", "X-Appwrite-Project": projectId, "X-Appwrite-Key": apiKey };

async function api(method, path, body) {
  const res = await fetch(`${endpoint}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok && res.status !== 409) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
}

const cols = [
  ["string", "nickname", 128],
  ["string", "avatarUrl", 512],
  ["string", "medicalHistory", 8192],
  ["string", "conditionsJson", 4096],
  ["string", "quickLoginToken", 64],
  ["integer", "birthYear", false],
  ["string", "gender", 24],
  ["string", "patientSerial", 32],
  ["datetime", "createdAt", false],
  ["datetime", "updatedAt", false],
];

async function main() {
  for (const [type, key, ...rest] of cols) {
    const path = `/tablesdb/${databaseId}/tables/profiles/columns/${type}`;
    const body = type === "integer" ? { key, required: false } : type === "datetime" ? { key, required: false } : { key, size: rest[0], required: false };
    await api("POST", path, body);
    console.log("column", key);
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log("Profile columns OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});