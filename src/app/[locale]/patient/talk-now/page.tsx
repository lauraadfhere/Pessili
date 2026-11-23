import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { TalkNowFlow } from "@/components/patient/TalkNowFlow";

type Props = { params: Promise<{ locale: string }> };

export default async function TalkNowPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientTalkNow");

  return (
    <PatientShell>
      <PatientPage title={t("title")} subtitle={t("subtitle")}>
        <TalkNowFlow />
      </PatientPage>
    </PatientShell>
  );
}
