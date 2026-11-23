import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { parseToolParam, SCREENING_TOOLS } from "@/lib/patient/screening";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { DashboardCard } from "@/components/patient/DashboardCard";
import { ScreeningTool } from "@/components/patient/ScreeningTool";
import { Panel } from "@/components/ui/SectionTitle";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tool?: string }>;
};

export default async function ScreeningPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tool: toolParam } = await searchParams;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientScreening");
  const tool = parseToolParam(toolParam ?? null);

  return (
    <PatientShell>
      <PatientPage title={t("title")} subtitle={t("body")}>
        {tool ? (
          <div className="space-y-4">
            <Link href="/patient/screening" className="text-[14px] text-link underline hover:text-link-hover">
              {t("backToList")}
            </Link>
            <ScreeningTool tool={tool} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <DashboardCard
                title={t("tools.phq9.name")}
                description={t("tools.phq9.desc")}
                href="/patient/screening?tool=phq9"
                stat={t("duration", { min: SCREENING_TOOLS.phq9.durationMin })}
              />
              <DashboardCard
                title={t("tools.gad7.name")}
                description={t("tools.gad7.desc")}
                href="/patient/screening?tool=gad7"
                stat={t("duration", { min: SCREENING_TOOLS.gad7.durationMin })}
                accent="calm"
              />
            </div>
            <Panel title={t("history.title")}>
              <p className="text-[14px] text-muted">{t("history.empty")}</p>
              <p className="mt-2 text-[13px] text-muted">{t("history.hint")}</p>
            </Panel>
          </div>
        )}
      </PatientPage>
    </PatientShell>
  );
}
