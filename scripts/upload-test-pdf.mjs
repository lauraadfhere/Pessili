import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const folder = process.env.CLOUDINARY_FOLDER ?? "pessili";

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing CLOUDINARY_* in .env.local");
  process.exit(1);
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoPdf = path.resolve(__dirname, "../../Algeria_Remote_Mental_Health_Platform_Report.pdf");
const fallback = path.resolve(__dirname, "fixtures/pessili-upload-test.pdf");

let pdfPath = fallback;
if (fs.existsSync(repoPdf)) pdfPath = repoPdf;
else if (!fs.existsSync(fallback)) {
  fs.mkdirSync(path.dirname(fallback), { recursive: true });
  fs.writeFileSync(
    fallback,
    Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 300 144]/Parent 2 0 R>>endobj\nxref\n0 4\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n0\n%%EOF",
    ),
  );
  pdfPath = fallback;
}

const buffer = fs.readFileSync(pdfPath);
const patientSerial = "PSL-TEST-UPLOAD";
const uploadFolder = `${folder}/patients/${patientSerial}`;

console.log("Ping Cloudinary...");
await cloudinary.api.ping();
console.log("Uploading PDF:", path.basename(pdfPath), "→", uploadFolder);

const result = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: uploadFolder,
      resource_type: "raw",
      type: "authenticated",
      public_id: `pessili-test-${Date.now()}`,
      overwrite: false,
    },
    (err, res) => (err ? reject(err) : resolve(res)),
  );
  stream.end(buffer);
});

console.log("Upload OK");
console.log("  public_id:", result.public_id);
console.log("  resource_type:", result.resource_type);
console.log("  bytes:", result.bytes);

const signed = cloudinary.url(result.public_id, {
  resource_type: "raw",
  type: "authenticated",
  sign_url: true,
  expires_at: Math.floor(Date.now() / 1000) + 600,
});
console.log("  signed_url (10 min):", signed);