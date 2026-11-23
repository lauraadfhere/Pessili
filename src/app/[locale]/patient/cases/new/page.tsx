import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { CaseSubmitForm } from "@/components/patient/CaseSubmitForm";

type Props = { params: Promise<{ locale: string }> };

export default async function NewCasePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientCases");

  return (
    <PatientShell>
      <PatientPage title={t("newPageTitle")} subtitle={t("newPageSubtitle")}>
        <CaseSubmitForm />
      </PatientPage>
    </PatientShell>
  );
}