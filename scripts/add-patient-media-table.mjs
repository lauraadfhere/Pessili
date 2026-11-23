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
  await api("POST", `/tablesdb/${databaseId}/tables/patient_media/columns/string`, { key, size, required });
}

async function datetimeCol(key) {
  await api("POST", `/tablesdb/${databaseId}/tables/patient_media/columns/datetime`, { key, required: false });
}

async function main() {
  await api("POST", `/tablesdb/${databaseId}/tables`, {
    tableId: "patient_media",
    name: "Patient media (Cloudinary)",
    permissions: ['read("users")', 'create("users")', 'update("users")'],
  });
  await new Promise((r) => setTimeout(r, 1200));
  await stringCol("patientId", 128, true);
  await stringCol("patientSerial", 32, true);
  await stringCol("title", 256, true);
  await stringCol("doctorName", 128);
  await stringCol("cloudinaryPublicId", 512, true);
  await stringCol("resourceType", 16, true);
  await stringCol("format", 16);
  await datetimeCol("createdAt");
  console.log("patient_media ready");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});