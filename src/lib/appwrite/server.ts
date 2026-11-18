import { Client, Databases, ID, Query } from "appwrite";

export function getAppwriteServer() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!projectId || !apiKey) return null;

  const client = new Client().setEndpoint(endpoint).setProject(projectId);
  client.headers["X-Appwrite-Key"] = apiKey;
  return new Databases(client);
}

export async function getActiveWilayas() {
  const db = getAppwriteServer();
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "pessili_main";
  if (!db) return [];

  try {
    const res = await db.listDocuments(databaseId, "wilayas", [Query.equal("active", true), Query.orderAsc("code"), Query.limit(100)]);
    return res.documents;
  } catch {
    return [];
  }
}

export { ID, Query };