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

async function stringCol(key, size, required = false) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_cases/columns/string`, { key, size, required });
}

async function datetimeCol(key) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_cases/columns/datetime`, { key, required: false });
}

async function main() {
  await api("POST", `/tablesdb/${databaseId}/tables`, {
    tableId: "patient_cases",
    name: "Patient cases",
    permissions: ['read("users")', 'create("users")', 'update("users")'],
  });
  console.log("table patient_cases");
  await new Promise((r) => setTimeout(r, 1500));
  await stringCol("patientId", 128, true);
  await stringCol("title", 256, true);
  await stringCol("bodyHtml", 16384);
  await stringCol("status", 32, true);
  await stringCol("statusNote", 512);
  await stringCol("documentRefs", 4096);
  await datetimeCol("createdAt");
  await datetimeCol("updatedAt");
  console.log("patient_cases ready");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});