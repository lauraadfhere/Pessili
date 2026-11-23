import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "@/lib/cloudinary/config";

function client() {
  const cfg = getCloudinaryConfig();
  if (!cfg) return null;
  cloudinary.config({
    cloud_name: cfg.cloudName,
    api_key: cfg.apiKey,
    api_secret: cfg.apiSecret,
    secure: true,
  });
  return cloudinary;
}

export async function testCloudinaryConnection(): Promise<{ ok: boolean; message: string }> {
  const c = client();
  if (!c) return { ok: false, message: "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET in .env.local" };
  try {
    await c.api.ping();
    return { ok: true, message: "Cloudinary ping OK — ready for images and PDF (raw)." };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Cloudinary ping failed" };
  }
}

export async function uploadPatientAsset(input: {
  buffer: Buffer;
  fileName: string;
  mime: string;
  patientSerial: string;
  kind: "image" | "pdf";
}) {
  const c = client();
  const cfg = getCloudinaryConfig();
  if (!c || !cfg) throw new Error("Cloudinary not configured");

  const resourceType = input.kind === "pdf" ? "raw" : "image";
  const folder = `${cfg.folder}/patients/${input.patientSerial}`;

  return new Promise<{ publicId: string; secureUrl: string; resourceType: string }>((resolve, reject) => {
    const stream = c.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        type: "authenticated",
        public_id: input.fileName.replace(/\.[^.]+$/, "").slice(0, 80),
        overwrite: false,
      },
      (err, result) => {
        if (err || !result) {
          reject(err ?? new Error("Upload failed"));
          return;
        }
        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          resourceType: result.resource_type,
        });
      },
    );
    stream.end(input.buffer);
  });
}

export function signedAssetUrl(publicId: string, resourceType: "image" | "raw" = "raw", expiresSec = 300) {
  const c = client();
  if (!c) throw new Error("Cloudinary not configured");
  const expiresAt = Math.floor(Date.now() / 1000) + expiresSec;
  return c.url(publicId, {
    resource_type: resourceType,
    type: "authenticated",
    sign_url: true,
    expires_at: expiresAt,
  });
}