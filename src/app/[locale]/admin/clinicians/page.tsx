import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_LICENCE_MONITOR } from "@/lib/admin/demo";
import { AdminShell } from "@/components/admin/AdminShell";
import { VerificationQueue } from "@/components/admin/VerificationQueue";
import { ClinicianDirectory } from "@/components/admin/ClinicianDirectory";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Panel } from "@/components/ui/SectionTitle";
import { tableClass, tdClass, thClass } from "@/components/admin/adminUi";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminCliniciansPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminClinicians");

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("queueTitle")}>
          <VerificationQueue />
        </Panel>

        <Panel title={t("licenceTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.name")}</th>
                  <th className={thClass}>{t("cols.expires")}</th>
                  <th className={thClass}>{t("cols.status")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_LICENCE_MONITOR.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{t("expiresDays", { d: row.expiresInDays })}</td>
                    <td className={tdClass}>
                      <StatusPill
                        label={row.status}
                        tone={row.status === "critical" ? "danger" : row.status === "warn" ? "warn" : "ok"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("directoryTitle")} className="mt-6">
          <ClinicianDirectory />
        </Panel>
      </WorkspacePage>
    </AdminShell>
  );
}
