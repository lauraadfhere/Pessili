import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_CONFIG, DEMO_INTEGRATIONS, DEMO_STAFF } from "@/lib/admin/demo";
import { AdminShell } from "@/components/admin/AdminShell";
import { SystemControls } from "@/components/admin/SystemControls";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Panel } from "@/components/ui/SectionTitle";
import { tableClass, tdClass, thClass } from "@/components/admin/adminUi";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminSystemPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminSystem");
  const c = DEMO_CONFIG;

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("staffTitle")}>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.name")}</th>
                  <th className={thClass}>{t("cols.email")}</th>
                  <th className={thClass}>{t("cols.roles")}</th>
                  <th className={thClass}>{t("cols.mfa")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_STAFF.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{row.email}</td>
                    <td className={tdClass}>{row.roles.join(", ")}</td>
                    <td className={tdClass}>
                      <StatusPill label={row.mfa ? t("mfaOn") : t("mfaOff")} tone={row.mfa ? "ok" : "danger"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("configTitle")} className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ConfigCard label={t("config.plan500")} value={`${c.plan500} DZD`} />
            <ConfigCard label={t("config.plan1000")} value={`${c.plan1000} DZD`} />
            <ConfigCard label={t("config.maxRequests")} value={String(c.maxRequests)} />
            <ConfigCard label={t("config.maxMinutes")} value={String(c.maxMinutesPerDay)} />
          </div>
        </Panel>

        <Panel title={t("urgentTitle")} className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ConfigCard label={t("urgent.acceptWindow")} value={String(c.urgentAcceptWindowSec)} />
            <ConfigCard label={t("urgent.maxWait")} value={String(c.urgentMaxWaitMin)} />
            <ConfigCard label={t("urgent.parallel")} value={String(c.parallelOffers)} />
            <ConfigCard label={t("urgent.premium")} value={`${c.urgentPremiumDzd} DZD`} />
          </div>
        </Panel>

        <Panel title={`${t("flagsTitle")} · ${t("maintenanceTitle")}`} className="mt-6">
          <SystemControls />
        </Panel>

        <Panel title={t("integrationsTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.integration")}</th>
                  <th className={thClass}>{t("cols.status")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_INTEGRATIONS.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>
                      <StatusPill
                        label={t(`statuses.${row.status}` as "statuses.operational")}
                        tone={row.status === "operational" ? "ok" : row.status === "degraded" ? "warn" : "danger"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </WorkspacePage>
    </AdminShell>
  );
}

function ConfigCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-rule bg-white px-4 py-4">
      <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 text-[22px] font-semibold text-brand">{value}</p>
    </div>
  );
}
