import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";

const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").replace(/\/$/, "");
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6afde2120005bf2a9749";
const headers = { "Content-Type": "application/json", "X-Appwrite-Project": projectId, "X-Appwrite-Key": apiKey };

const patientEmail = "patient@demo.pessili.dz";

function buildPatientSerial(email) {
  const digest = crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 10).toUpperCase();
  return `PSL-${new Date().getFullYear()}-${digest}`;
}

async function api(method, pathName, body) {
  const res = await fetch(`${endpoint}${pathName}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok && res.status !== 409) throw new Error(`${method} ${pathName} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cKey = process.env.CLOUDINARY_API_KEY;
const cSecret = process.env.CLOUDINARY_API_SECRET;
const folder = process.env.CLOUDINARY_FOLDER ?? "pessili";
if (!cloudName || !cKey || !cSecret) {
  console.error("Configure CLOUDINARY_* in .env.local first");
  process.exit(1);
}

cloudinary.config({ cloud_name: cloudName, api_key: cKey, api_secret: cSecret, secure: true });

const serial = buildPatientSerial(patientEmail);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfPath = fs.existsSync(path.resolve(__dirname, "../../Algeria_Remote_Mental_Health_Platform_Report.pdf"))
  ? path.resolve(__dirname, "../../Algeria_Remote_Mental_Health_Platform_Report.pdf")
  : path.resolve(__dirname, "fixtures/pessili-upload-test.pdf");

const buffer = fs.readFileSync(pdfPath);
const uploadFolder = `${folder}/patients/${serial}`;

console.log("Patient:", patientEmail, "serial:", serial);
await cloudinary.api.ping();

const uploaded = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: uploadFolder,
      resource_type: "raw",
      type: "authenticated",
      public_id: `demo-consult-${Date.now()}`,
      overwrite: false,
    },
    (err, res) => (err ? reject(err) : resolve(res)),
  );
  stream.end(buffer);
});

const now = new Date().toISOString();
const rowId = `pm_${crypto.randomBytes(12).toString("hex")}`;
const data = {
  patientId: patientEmail,
  patientSerial: serial,
  title: "Consultation report (PeSSiLi demo)",
  doctorName: "Dr. Karim Mesbah",
  cloudinaryPublicId: uploaded.public_id,
  resourceType: "raw",
  format: "pdf",
  createdAt: now,
};

await api("POST", `/tablesdb/${databaseId}/tables/patient_media/rows`, { rowId, data });

console.log("Seed OK — row", rowId);
console.log("  cloudinary:", uploaded.public_id);
console.log("  patient opens at /patient/records with code", serial);