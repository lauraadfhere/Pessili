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
  await api("POST", `/tablesdb/${databaseId}/tables/patient_messages/columns/string`, { key, size, required });
}

async function boolCol(key) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_messages/columns/boolean`, { key, required: false });
}

async function datetimeCol(key) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_messages/columns/datetime`, { key, required: false });
}

async function main() {
  await api("POST", `/tablesdb/${databaseId}/tables`, {
    tableId: "patient_messages",
    name: "Patient messages",
    permissions: ['read("users")', 'create("users")', 'update("users")'],
  });
  console.log("table patient_messages");
  await new Promise((r) => setTimeout(r, 1200));
  await stringCol("patientId", 128, true);
  await stringCol("doctorId", 64, true);
  await stringCol("doctorName", 128, true);
  await stringCol("body", 4096, true);
  await stringCol("fromRole", 16, true);
  await boolCol("read");
  await datetimeCol("createdAt");
  console.log("patient_messages ready");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});