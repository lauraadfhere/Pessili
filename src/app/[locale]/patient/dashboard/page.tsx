import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile } from "@/lib/patient/profile";
import { listPatientCases } from "@/lib/patient/cases";
import { listPatientMessages } from "@/lib/patient/messages";
import { buildPatientSerial } from "@/lib/patient/serial";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { DashboardPanelTile } from "@/components/patient/DashboardPanelTile";
import { CaseTracker } from "@/components/patient/CaseTracker";
import { DoctorMarksPanel } from "@/components/patient/DoctorMarksPanel";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function PatientDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "patient") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("patientDashboard");
  const [profile, cases, messages] = await Promise.all([
    getPatientProfile(session.email),
    listPatientCases(session.email),
    listPatientMessages(session.email),
  ]);
  const name = profile?.nickname || profile?.fullName || session.email.split("@")[0];
  const openCases = cases.filter((c) => c.status !== "closed").length;
  const unreadMsgs = messages.filter((m) => m.fromRole === "doctor" && !m.read).length;
  const serial = profile?.patientSerial ?? buildPatientSerial(session.email);

  return (
    <PatientShell displayName={name}>
      <PatientPage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <DashboardPanelTile
            title={t("cards.talkNow.title")}
            href="/patient/talk-now"
            linkLabel={t("cards.open")}
            meta={t("cards.talkNow.stat")}
          >
            <p>{t("cards.talkNow.desc")}</p>
          </DashboardPanelTile>
          <DashboardPanelTile
            title={t("cards.serial.title")}
            href="/patient/profile"
            linkLabel={t("cards.open")}
            meta={serial}
          >
            <p>{t("cards.serial.desc")}</p>
          </DashboardPanelTile>
          <DashboardPanelTile
            title={t("cards.messages.title")}
            href="/patient/messages"
            linkLabel={t("cards.open")}
            meta={unreadMsgs > 0 ? t("cards.messages.unread", { count: unreadMsgs }) : t("cards.messages.stat")}
          >
            <p>{t("cards.messages.desc")}</p>
          </DashboardPanelTile>
          <DashboardPanelTile title={t("cards.sessions.title")} href="/patient/sessions" linkLabel={t("cards.open")} meta={t("cards.sessions.stat")}>
            <p>{t("cards.sessions.desc")}</p>
          </DashboardPanelTile>
          <DashboardPanelTile title={t("cards.consult.title")} href="/patient/booking" linkLabel={t("cards.open")} meta={t("cards.consult.stat")}>
            <p>{t("cards.consult.desc")}</p>
          </DashboardPanelTile>
          <DashboardPanelTile title={t("cards.screening.title")} href="/patient/screening" linkLabel={t("cards.open")} meta={t("cards.screening.stat")}>
            <p>{t("cards.screening.desc")}</p>
          </DashboardPanelTile>
          <DashboardPanelTile title={t("cards.payments.title")} href="/patient/payments" linkLabel={t("cards.open")} meta={t("cards.payments.stat")}>
            <p>{t("cards.payments.desc")}</p>
          </DashboardPanelTile>
          <DashboardPanelTile
            title={t("cards.cases.title")}
            href="/patient/cases"
            linkLabel={t("cards.open")}
            meta={openCases > 0 ? t("cards.cases.openCount", { count: openCases }) : t("cards.cases.stat")}
          >
            <p>{t("cards.cases.desc")}</p>
          </DashboardPanelTile>
          <DashboardPanelTile title={t("cards.records.title")} href="/patient/records" linkLabel={t("cards.open")} meta={t("cards.records.stat")}>
            <p>{t("cards.records.desc")}</p>
          </DashboardPanelTile>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CaseTracker />
          <DoctorMarksPanel patientId={session.email} />
        </div>

        <Panel title={t("journeyTitle")} className="mt-6">
          <ol className="list-decimal space-y-2 ps-5 text-[14px] leading-relaxed text-muted">
            <li>{t("journey.step1")}</li>
            <li>{t("journey.step2")}</li>
            <li>{t("journey.step3")}</li>
            <li>{t("journey.step4")}</li>
          </ol>
          <div className="mt-4 border-t border-rule pt-4">
            <SignOutButton />
          </div>
        </Panel>
      </PatientPage>
    </PatientShell>
  );
}