const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").replace(/\/$/, "");
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6afde2120005bf2a9749";
const headers = { "Content-Type": "application/json", "X-Appwrite-Project": projectId, "X-Appwrite-Key": apiKey };

async function api(method, path, body) {
  const res = await fetch(`${endpoint}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok && res.status !== 409) throw new Error(`${method} ${path} → ${res.status}: ${await res.text()}`);
}

async function stringCol(key, size, required = false) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_marks/columns/string`, { key, size, required });
}

async function intCol(key) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_marks/columns/integer`, { key, required: false });
}

async function boolCol(key) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_marks/columns/boolean`, { key, required: false });
}

async function datetimeCol(key) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_marks/columns/datetime`, { key, required: false });
}

async function main() {
  await api("POST", `/tablesdb/${databaseId}/tables`, {
    tableId: "patient_marks",
    name: "Patient marks",
    permissions: ['read("users")', 'create("users")', 'update("users")'],
  });
  await new Promise((r) => setTimeout(r, 1200));
  await stringCol("patientId", 128, true);
  await stringCol("doctorId", 128, true);
  await stringCol("doctorName", 128, true);
  await intCol("score");
  await stringCol("note", 2048);
  await stringCol("aiSummary", 1024);
  await boolCol("read");
  await datetimeCol("createdAt");
  console.log("patient_marks ready");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});