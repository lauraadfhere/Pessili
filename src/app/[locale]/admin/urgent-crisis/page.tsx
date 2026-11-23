import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_HOTLINES, DEMO_ON_CALL_ROTA } from "@/lib/admin/demo";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrisisAlertsBoard, UrgentQueuePanel } from "@/components/admin/UrgentQueuePanel";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { Panel } from "@/components/ui/SectionTitle";
import { tableClass, tdClass, thClass } from "@/components/admin/adminUi";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminUrgentCrisisPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminUrgent");

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("queueTitle")}>
          <UrgentQueuePanel />
        </Panel>

        <Panel title={t("crisisTitle")} className="mt-6">
          <CrisisAlertsBoard />
        </Panel>

        <Panel title={t("rotaTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.name")}</th>
                  <th className={thClass}>{t("cols.shift")}</th>
                  <th className={thClass}>{t("cols.backup")}</th>
                  <th className={thClass}>{t("cols.phone")}</th>
                  <th className={thClass}>{t("cols.wilaya")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ON_CALL_ROTA.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{row.shift}</td>
                    <td className={tdClass}>{row.backup}</td>
                    <td className={tdClass}>{row.phone}</td>
                    <td className={tdClass}>{row.wilaya}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("resourcesTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.hotline")}</th>
                  <th className={thClass}>{t("cols.number")}</th>
                  <th className={thClass}>{t("cols.region")}</th>
                  <th className={thClass}>{t("cols.updated")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_HOTLINES.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{row.number}</td>
                    <td className={tdClass}>{row.region}</td>
                    <td className={tdClass}>{row.updated}</td>
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
