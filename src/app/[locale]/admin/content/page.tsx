import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import {
  DEMO_AWARENESS_CMS,
  DEMO_GROUNDING,
  DEMO_RISK_RULES,
  DEMO_SCREENING_TOOLS,
  DEMO_TRANSLATIONS,
} from "@/lib/admin/demo";
import { AdminShell } from "@/components/admin/AdminShell";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Panel } from "@/components/ui/SectionTitle";
import { btnPrimary, btnSecondary, tableClass, tdClass, thClass } from "@/components/admin/adminUi";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminContentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminContent");

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("toolsTitle")}>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.name")}</th>
                  <th className={thClass}>{t("cols.version")}</th>
                  <th className={thClass}>{t("cols.languages")}</th>
                  <th className={thClass}>{t("cols.licence")}</th>
                  <th className={thClass}>{t("cols.signedOff")}</th>
                  <th className={thClass}>{t("cols.status")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_SCREENING_TOOLS.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{row.version}</td>
                    <td className={tdClass}>{row.languages}</td>
                    <td className={tdClass}>
                      <StatusPill label={row.licence} tone="ok" />
                    </td>
                    <td className={tdClass}>{row.signedOff}</td>
                    <td className={tdClass}>
                      <span className={btnSecondary}>{t("publish")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("riskTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.tool")}</th>
                  <th className={thClass}>{t("cols.trigger")}</th>
                  <th className={thClass}>{t("cols.action")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_RISK_RULES.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.tool}</td>
                    <td className={tdClass}>{row.trigger}</td>
                    <td className={tdClass}>
                      <StatusPill label={row.action} tone={row.action === "crisis_protocol" ? "danger" : "warn"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("translationTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.key")}</th>
                  <th className={thClass}>{t("cols.ar")}</th>
                  <th className={thClass}>{t("cols.fr")}</th>
                  <th className={thClass}>{t("cols.status")}</th>
                  <th className={thClass}>{t("cols.action")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_TRANSLATIONS.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>
                      <code className="font-mono text-[12px]">{row.key}</code>
                    </td>
                    <td className={tdClass} dir="rtl">
                      {row.ar}
                    </td>
                    <td className={tdClass}>{row.fr}</td>
                    <td className={tdClass}>
                      <StatusPill label={row.status} tone={row.status === "approved" ? "ok" : "warn"} />
                    </td>
                    <td className={tdClass}>
                      <span className={btnPrimary}>{t("approveTranslation")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("groundingTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.title")}</th>
                  <th className={thClass}>{t("cols.duration")}</th>
                  <th className={thClass}>{t("cols.usedOn")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_GROUNDING.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.title}</td>
                    <td className={tdClass}>{t("durationSec", { sec: row.durationSec })}</td>
                    <td className={tdClass}>{row.usedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t("cmsTitle")} className="mt-6">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>{t("cols.title")}</th>
                  <th className={thClass}>{t("cols.status")}</th>
                  <th className={thClass}>{t("cols.lang")}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_AWARENESS_CMS.map((row) => (
                  <tr key={row.id}>
                    <td className={tdClass}>{row.title}</td>
                    <td className={tdClass}>
                      <StatusPill
                        label={row.status}
                        tone={row.status === "published" ? "ok" : row.status === "review" ? "warn" : "neutral"}
                      />
                    </td>
                    <td className={tdClass}>{row.lang}</td>
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
