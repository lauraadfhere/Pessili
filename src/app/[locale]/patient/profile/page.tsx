import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile } from "@/lib/patient/profile";
import { buildPatientSerial } from "@/lib/patient/serial";
import { getActiveWilayas } from "@/lib/appwrite/server";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { ProfileForm } from "@/components/patient/ProfileForm";
import { QuickLoginQr } from "@/components/patient/QuickLoginQr";
import { PatientSerialCard } from "@/components/patient/PatientSerialCard";
import { PatientAvatar } from "@/components/ui/PatientAvatar";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function PatientProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "patient") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("patientProfile");
  const [profile, wilayaRows] = await Promise.all([getPatientProfile(session.email), getActiveWilayas()]);
  const wilayas = wilayaRows.map((w) => ({
    code: String((w as { code?: string }).code ?? ""),
    name_fr: String((w as { name_fr?: string }).name_fr ?? ""),
    name_ar: String((w as { name_ar?: string }).name_ar ?? ""),
  }));

  const name = profile?.nickname || profile?.fullName || session.email.split("@")[0];
  const serial = profile?.patientSerial ?? buildPatientSerial(session.email);

  return (
    <PatientShell displayName={name}>
      <PatientPage title={t("pageTitle")} subtitle={t("pageSubtitle")}>
        <Panel title={t("identitySection")}>
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <PatientAvatar name={name} avatarUrl={profile?.avatarUrl} size={72} className="!border-rule !bg-panel-head !text-brand" />
            <div className="min-w-0">
              <p className="text-[18px] font-semibold text-text">{name}</p>
              <p className="text-[13px] text-muted">{session.email}</p>
            </div>
          </div>
          <PatientSerialCard serial={serial} />
        </Panel>

        <Panel title={t("formSection")} className="mt-6">
          <ProfileForm initial={profile} wilayas={wilayas} />
        </Panel>

        <Panel title={t("qrSection")} className="mt-6" id="profile-qr">
          <QuickLoginQr initialToken={profile?.quickLoginToken} />
        </Panel>
      </PatientPage>
    </PatientShell>
  );
}