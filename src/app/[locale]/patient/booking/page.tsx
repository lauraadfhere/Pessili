import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { DoctorsByCategory } from "@/components/patient/DoctorsByCategory";
import { filterDoctors, listPublicDoctors } from "@/lib/doctors/list";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function BookingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientBooking");
  const all = await listPublicDoctors();
  const doctors = filterDoctors(all, q);

  return (
    <PatientShell>
      <PatientPage title={t("title")} subtitle={q ? t("searchResults", { query: q }) : t("body")}>
        <DoctorsByCategory doctors={doctors} emptyQuery={Boolean(q?.trim())} />
      </PatientPage>
    </PatientShell>
  );
}