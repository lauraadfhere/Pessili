import { Query } from "appwrite";
import { getTablesServer } from "@/lib/appwrite/server";
import { DEMO_DOCTORS } from "@/lib/doctors/demo";
import { DOCTOR_CATEGORIES, type DoctorCategory, type PublicDoctor } from "@/lib/doctors/types";

const databaseId = () => process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "6afde2120005bf2a9749";

function normalizeCategory(value: string): DoctorCategory {
  if (DOCTOR_CATEGORIES.includes(value as DoctorCategory)) return value as DoctorCategory;
  if (value === "psychiatrist") return "psychiatrist";
  return "psychologist";
}

function rowToDoctor(row: Record<string, unknown>, index: number): PublicDoctor | null {
  const specialty = normalizeCategory(String(row.specialty ?? "psychologist"));
  const id = String(row.$id ?? row.id ?? `row-${index}`);
  const displayName = String(row.displayName ?? row.fullName ?? "").trim();
  const demoFallback = DEMO_DOCTORS.find((d) => d.id === id) ?? DEMO_DOCTORS[index % DEMO_DOCTORS.length];

  const languagesRaw = row.languages;
  const languages = Array.isArray(languagesRaw)
    ? languagesRaw.map(String)
    : typeof languagesRaw === "string" && languagesRaw
      ? languagesRaw.split(",").map((s) => s.trim())
      : demoFallback.languages;

  return {
    id,
    displayName: displayName || demoFallback.displayName,
    specialty,
    wilayaCode: String(row.wilayaCode ?? demoFallback.wilayaCode),
    languages,
    consultationPrice: Number(row.consultationPrice ?? demoFallback.consultationPrice) || undefined,
    verified: Boolean(row.verified ?? true),
    onDemandAvailable: Boolean(row.onDemandAvailable ?? demoFallback.onDemandAvailable),
    bio: String(row.bio ?? demoFallback.bio ?? ""),
    avatarUrl: row.avatarUrl ? String(row.avatarUrl) : undefined,
    rating: row.rating ? Number(row.rating) : demoFallback.rating,
  };
}

export async function listPublicDoctors(): Promise<PublicDoctor[]> {
  const tables = getTablesServer();
  if (!tables) return [...DEMO_DOCTORS];

  try {
    const res = await tables.listRows({
      databaseId: databaseId(),
      tableId: "doctors",
      queries: [Query.limit(100)],
    });
    if (!res.rows.length) return [...DEMO_DOCTORS];
    const mapped = res.rows
      .map((row, i) => rowToDoctor(row as Record<string, unknown>, i))
      .filter((d): d is PublicDoctor => Boolean(d));
    return mapped.length ? mapped : [...DEMO_DOCTORS];
  } catch {
    return [...DEMO_DOCTORS];
  }
}

export function groupDoctorsByCategory(doctors: PublicDoctor[]): Record<DoctorCategory, PublicDoctor[]> {
  const groups: Record<DoctorCategory, PublicDoctor[]> = {
    psychologist: [],
    psychiatrist: [],
    child_psychologist: [],
  };
  for (const doc of doctors) groups[doc.specialty].push(doc);
  return groups;
}

export function filterDoctors(doctors: PublicDoctor[], query?: string): PublicDoctor[] {
  const q = query?.trim().toLowerCase();
  if (!q) return doctors;
  return doctors.filter(
    (d) =>
      d.displayName.toLowerCase().includes(q) ||
      d.wilayaCode.includes(q) ||
      d.languages.some((l) => l.toLowerCase().includes(q)) ||
      d.bio?.toLowerCase().includes(q),
  );
}