const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing CLOUDINARY_* variables in .env.local (see .env.example)");
  process.exit(1);
}

const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
  headers: { Authorization: `Basic ${auth}` },
});
const text = await res.text();
if (!res.ok) {
  console.error("Cloudinary connection failed:", res.status, text);
  process.exit(1);
}
console.log("Cloudinary OK for cloud:", cloudName);
console.log("Supports: image uploads + raw/PDF (use resource_type raw).");