import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile } from "@/lib/patient/profile";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { PatientRecordsPdfList } from "@/components/patient/PatientRecordsPdfList";
import { SecureMediaDocuments } from "@/components/patient/SecureMediaDocuments";
import { listPatientMediaDocuments } from "@/lib/patient/media-documents";
import { buildPatientSerial } from "@/lib/patient/serial";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function RecordsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientRecords");
  const profile = await getPatientProfile(session.email);
  const serial = profile?.patientSerial ?? buildPatientSerial(session.email);
  const cloudDocs = await listPatientMediaDocuments(session.email, serial);

  return (
    <PatientShell>
      <PatientPage title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("cloudTitle")}>
          <SecureMediaDocuments documents={cloudDocs} defaultCode={serial} />
        </Panel>
        <div className="mt-6">
          <PatientRecordsPdfList patientSerial={profile?.patientSerial} patientCode={serial} />
        </div>
        <Panel title={t("historyTitle")} className="mt-6">
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-text">
            {profile?.medicalHistory || t("empty")}
          </p>
        </Panel>
      </PatientPage>
    </PatientShell>
  );
}