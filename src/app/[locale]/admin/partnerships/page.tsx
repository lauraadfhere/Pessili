import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_INSTITUTIONS } from "@/lib/admin/demo";
import { AdminShell } from "@/components/admin/AdminShell";
import { EligibilityUpload } from "@/components/admin/EligibilityUpload";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Panel } from "@/components/ui/SectionTitle";
import { tableClass, tdClass, thClass } from "@/components/admin/adminUi";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPartnershipsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminPartnerships");

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("institutionsTitle")}>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.name")}</th>
                  <th className={thClass}>{t("cols.type")}</th>
                  <th className={thClass}>{t("cols.members")}</th>
                  <th className={thClass}>{t("cols.status")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_INSTITUTIONS.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{t(`types.${row.type}` as "types.university")}</td>
                    <td className={tdClass}>{row.members}</td>
                    <td className={tdClass}>
                      <StatusPill label={row.status} tone={row.status === "active" ? "ok" : "brand"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("eligibilityTitle")} className="mt-6">
          <EligibilityUpload />
        </Panel>

        <Panel title={t("reportingTitle")} className="mt-6">
          <p className="mb-4 border border-brand/25 bg-brand/5 px-3 py-2 text-[13px] text-brand">{t("cohortNote")}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {DEMO_INSTITUTIONS.map((inst) => {
              const show = inst.members >= 10;
              return (
                <div key={inst.id} className="border border-rule bg-white px-4 py-4">
                  <p className="text-[14px] font-semibold text-text">{inst.name}</p>
                  {show ? (
                    <ul className="mt-3 space-y-1 text-[13px] text-muted">
                      <li>
                        {t("reportMetrics.usage")}: 62%
                      </li>
                      <li>
                        {t("reportMetrics.satisfaction")}: 4.2/5
                      </li>
                      <li>
                        {t("reportMetrics.peak")}: 18:00–21:00
                      </li>
                    </ul>
                  ) : (
                    <p className="mt-3 text-[13px] text-muted">{t("belowCohort")}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      </WorkspacePage>
    </AdminShell>
  );
}
