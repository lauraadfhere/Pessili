import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { DoctorsByCategory } from "@/components/patient/DoctorsByCategory";
import { filterDoctors, listPublicDoctors } from "@/lib/doctors/list";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function DoctorsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("doctors");
  const all = await listPublicDoctors();
  const doctors = filterDoctors(all, q);

  return (
    <PageShell
      active="doctors"
      breadcrumbs={[{ label: t("breadcrumb") }]}
      hero={{ title: q ? t("searchResults", { query: q }) : t("title") }}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <DoctorsByCategory doctors={doctors} emptyQuery={Boolean(q?.trim())} />
      </div>
    </PageShell>
  );
}