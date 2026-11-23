import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { MessagesCenter } from "@/components/patient/MessagesCenter";

type Props = { params: Promise<{ locale: string }> };

export default async function PatientMessagesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientMessages");

  return (
    <PatientShell>
      <PatientPage title={t("pageTitle")} subtitle={t("pageSubtitle")}>
        <MessagesCenter />
      </PatientPage>
    </PatientShell>
  );
}