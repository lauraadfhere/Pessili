import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_AUDIT_LOG, DEMO_CONSENT_VERSIONS, DEMO_DSR_QUEUE, DEMO_INCIDENTS } from "@/lib/admin/demo";
import { AdminShell } from "@/components/admin/AdminShell";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Panel } from "@/components/ui/SectionTitle";
import { tableClass, tdClass, thClass } from "@/components/admin/adminUi";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminCompliancePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminCompliance");

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("consentTitle")}>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.name")}</th>
                  <th className={thClass}>{t("cols.version")}</th>
                  <th className={thClass}>{t("cols.published")}</th>
                  <th className={thClass}>{t("cols.acceptances")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_CONSENT_VERSIONS.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{row.version}</td>
                    <td className={tdClass}>{row.published}</td>
                    <td className={tdClass}>{row.acceptances}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("dsrTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.type")}</th>
                  <th className={thClass}>{t("cols.requester")}</th>
                  <th className={thClass}>{t("cols.status")}</th>
                  <th className={thClass}>{t("cols.due")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_DSR_QUEUE.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.type}</td>
                    <td className={tdClass}>{row.requester}</td>
                    <td className={tdClass}>
                      <StatusPill
                        label={row.status}
                        tone={row.status === "closed" ? "ok" : row.status === "in_progress" ? "brand" : "warn"}
                      />
                    </td>
                    <td className={tdClass}>{row.dueDays > 0 ? t("dueDays", { d: row.dueDays }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("incidentsTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.title")}</th>
                  <th className={thClass}>{t("cols.severity")}</th>
                  <th className={thClass}>{t("cols.status")}</th>
                  <th className={thClass}>{t("cols.deadline")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_INCIDENTS.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.title}</td>
                    <td className={tdClass}>
                      <StatusPill label={row.severity} tone={row.severity === "high" ? "danger" : "warn"} />
                    </td>
                    <td className={tdClass}>
                      <StatusPill label={row.status} tone={row.status === "resolved" ? "ok" : "brand"} />
                    </td>
                    <td className={tdClass}>{row.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("auditTitle")} className="mt-6">
          <p className="mb-3 text-[13px] text-muted">{t("auditImmutable")}</p>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.actor")}</th>
                  <th className={thClass}>{t("cols.action")}</th>
                  <th className={thClass}>{t("cols.resource")}</th>
                  <th className={thClass}>{t("cols.at")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_AUDIT_LOG.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.actor}</td>
                    <td className={tdClass}>
                      <code className="font-mono text-[12px]">{row.action}</code>
                    </td>
                    <td className={tdClass}>{row.resource}</td>
                    <td className={tdClass}>{row.at}</td>
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
