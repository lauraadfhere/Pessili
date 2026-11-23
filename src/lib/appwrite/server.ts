import { Client, Query, TablesDB } from "appwrite";

export function getTablesServer(): TablesDB | null {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!projectId || !apiKey) return null;

  const client = new Client().setEndpoint(endpoint).setProject(projectId);
  client.headers["X-Appwrite-Key"] = apiKey;
  return new TablesDB(client);
}

export async function getActiveWilayas() {
  const tables = getTablesServer();
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";
  if (!tables) return [];

  try {
    const res = await tables.listRows({
      databaseId,
      tableId: "wilayas",
      queries: [Query.equal("active", true), Query.orderAsc("code"), Query.limit(100)],
    });
    return res.rows;
  } catch {
    return [];
  }
}

export { Query };