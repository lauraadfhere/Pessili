import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_ADMIN_ALERTS, DEMO_ADMIN_KPIS } from "@/lib/admin/demo";
import { AdminShell } from "@/components/admin/AdminShell";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminOverviewPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminOverview");
  const k = DEMO_ADMIN_KPIS;

  const kpis: { label: string; value: string }[] = [
    { label: t("kpis.patients"), value: String(k.patients) },
    { label: t("kpis.cliniciansOnline"), value: String(k.cliniciansOnline) },
    { label: t("kpis.activeSessions"), value: String(k.activeSessions) },
    { label: t("kpis.urgentNow"), value: String(k.urgentNow) },
    { label: t("kpis.urgentToday"), value: String(k.urgentToday) },
    { label: t("kpis.avgTime"), value: t("kpis.avgTimeUnit", { value: k.avgTimeToClinicianMin }) },
    { label: t("kpis.openCrisis"), value: String(k.openCrisis) },
    { label: t("kpis.openTickets"), value: String(k.openTickets) },
    { label: t("kpis.revenueToday"), value: t("kpis.dzd", { value: k.revenueTodayDzd.toLocaleString("en-US") }) },
  ];

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="border border-rule bg-white px-4 py-4">
              <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{kpi.label}</p>
              <p className="mt-1 text-[26px] font-semibold text-brand">{kpi.value}</p>
            </div>
          ))}
        </div>

        <Panel title={t("alertsTitle")} className="mt-6">
          <ul className="space-y-3">
            {DEMO_ADMIN_ALERTS.map((alert) => (
              <li key={alert.id} className="flex flex-wrap items-start gap-3 border-b border-rule pb-3 last:border-0 last:pb-0">
                <StatusPill label={alert.type} tone={alert.tone} />
                <p className="min-w-0 flex-1 text-[14px] text-text">
                  {t(`alerts.${alert.messageKey}` as "alerts.coverageGap")}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </WorkspacePage>
    </AdminShell>
  );
}
