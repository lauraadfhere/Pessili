import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_SESSIONS } from "@/lib/patient/demo-care";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { SessionsJoinChecklist } from "@/components/patient/SessionsJoinChecklist";
import { Panel } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ join?: string }>;
};

export default async function SessionsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { join } = await searchParams;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientSessions");
  const upcoming = DEMO_SESSIONS.filter((s) => s.status === "upcoming");
  const past = DEMO_SESSIONS.filter((s) => s.status === "past");
  const missed = DEMO_SESSIONS.filter((s) => s.status === "missed");

  function toneFor(status: string): "brand" | "ok" | "warn" | "neutral" {
    if (status === "upcoming") return "brand";
    if (status === "past") return "ok";
    if (status === "missed") return "warn";
    return "neutral";
  }

  function Section({
    title,
    rows,
    empty,
  }: {
    title: string;
    rows: typeof DEMO_SESSIONS;
    empty: string;
  }) {
    return (
      <Panel title={title}>
        {rows.length === 0 ? (
          <p className="text-[14px] text-muted">{empty}</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 border border-rule bg-white px-4 py-3">
                <div>
                  <p className="text-[14px] font-semibold text-text">{row.clinician}</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {row.when} · {t(`format.${row.format}`)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill label={t(`status.${row.status}`)} tone={toneFor(row.status)} />
                  {row.status === "upcoming" ? (
                    <Link
                      href={`/patient/sessions?join=${row.id}#join-checklist`}
                      className="inline-flex min-h-9 items-center bg-brand px-3 text-[13px] font-semibold text-white hover:bg-brand-dark"
                    >
                      {t("join")}
                    </Link>
                  ) : null}
                  {row.status === "missed" ? (
                    <Link
                      href="/patient/booking"
                      className="inline-flex min-h-9 items-center border border-rule px-3 text-[13px] font-medium text-text hover:border-brand"
                    >
                      {t("rebook")}
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    );
  }

  return (
    <PatientShell>
      <PatientPage title={t("title")} subtitle={t("subtitle")}>
        <div className="space-y-6">
          <Section title={t("tabs.upcoming")} rows={upcoming} empty={t("empty.upcoming")} />
          <Section title={t("tabs.past")} rows={past} empty={t("empty.past")} />
          <Section title={t("tabs.missed")} rows={missed} empty={t("empty.missed")} />
          <SessionsJoinChecklist sessionId={join} />
        </div>
      </PatientPage>
    </PatientShell>
  );
}
