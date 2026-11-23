import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { ClinicianShell } from "@/components/clinician/ClinicianShell";
import { TodayAnalytics } from "@/components/clinician/TodayAnalytics";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Panel } from "@/components/ui/SectionTitle";
import { Link } from "@/i18n/navigation";
import {
  DEMO_TASKS,
  DEMO_TODAY_SESSIONS,
  DEMO_URGENT_OFFERS,
} from "@/lib/clinician/demo";
import { getClinicianProfile } from "@/lib/clinician/store";

type Props = { params: Promise<{ locale: string }> };

export default async function ClinicianTodayPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "doctor") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("clinicianToday");
  const profile = getClinicianProfile(session.email);
  const offer = DEMO_URGENT_OFFERS[0];

  return (
    <ClinicianShell>
      <WorkspacePage title={t("title")} subtitle={t("subtitle")}>
        <TodayAnalytics />

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Panel title={t("agenda")}>
              {DEMO_TODAY_SESSIONS.length === 0 ? (
                <p className="text-[14px] text-muted">{t("emptyAgenda")}</p>
              ) : (
                <ul className="divide-y divide-rule">
                  {DEMO_TODAY_SESSIONS.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-[15px] font-semibold text-text">
                          <span className="tabular-nums">{s.time}</span>
                          <span className="text-muted"> · </span>
                          {s.patientFirstName}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          <StatusPill label={t(`format.${s.format}`)} tone="brand" />
                          <StatusPill label={t(`sessionStatus.${s.status}`)} tone="neutral" />
                        </div>
                      </div>
                      <Link
                        href="/clinician/session"
                        className="rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
                      >
                        {t("join")}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            {offer ? (
              <Panel title={t("urgentAlert")}>
                <div className="rounded-md border border-rule bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-text">
                        {t("urgentBrief", {
                          ageBand: offer.ageBand,
                          language: offer.language,
                          reason: offer.reason,
                          risk: offer.riskLevel,
                        })}
                      </p>
                      <p className="mt-1 text-[13px] text-muted">
                        {t("urgentWait", { minutes: offer.waitMinutes, wilaya: offer.wilaya })}
                      </p>
                    </div>
                    <StatusPill label={t("countdown", { seconds: offer.secondsLeft })} tone="danger" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href="/clinician/urgent" className="rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark">
                      {t("accept")}
                    </Link>
                    <Link href="/clinician/urgent" className="rounded-md border border-text px-4 py-2 text-[13px] font-semibold hover:bg-panel">
                      {t("decline")}
                    </Link>
                    <Link href="/clinician/urgent" className="rounded-md px-3 py-2 text-[13px] font-semibold text-brand hover:underline">
                      {t("viewUrgent")}
                    </Link>
                  </div>
                </div>
              </Panel>
            ) : null}
          </div>

          <div className="space-y-6">
            <Panel title={t("tasks")}>
              {DEMO_TASKS.length === 0 ? (
                <p className="text-[14px] text-muted">{t("emptyTasks")}</p>
              ) : (
                <ul className="space-y-2.5">
                  {DEMO_TASKS.map((task) => (
                    <li key={task.id} className="rounded-md border border-rule bg-white px-3 py-2.5">
                      <p className="text-[14px] font-medium text-text">{task.label}</p>
                      <p className="mt-0.5 text-[12px] text-muted">{t("due", { when: task.due })}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title={t("availability")}>
              <p className="text-[14px] text-text">
                {profile.displayName} · <StatusPill label={profile.status} tone={profile.status === "available" ? "ok" : "neutral"} />
              </p>
              <p className="mt-2 text-[13px] text-muted">{t("subtitle")}</p>
            </Panel>
          </div>
        </div>
      </WorkspacePage>
    </ClinicianShell>
  );
}
