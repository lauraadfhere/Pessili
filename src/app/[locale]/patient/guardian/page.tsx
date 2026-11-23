import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_DEPENDENTS } from "@/lib/patient/demo-care";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { Panel } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function GuardianPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientGuardian");

  return (
    <PatientShell>
      <PatientPage title={t("title")} subtitle={t("subtitle")}>
        <p className="mb-4 text-[13px] text-muted">{t("visibilityNote")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {DEMO_DEPENDENTS.map((dep) => (
            <Panel key={dep.id} title={dep.name}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill label={t(`ageBand.${dep.ageBand === "adult" ? "adult" : "minor"}`)} tone="neutral" />
                <StatusPill
                  label={t(`consent.${dep.consent}`)}
                  tone={dep.consent === "guardian" ? "brand" : "ok"}
                />
              </div>
              <p className="mt-3 text-[14px] text-muted">
                {dep.nextSession ? t("nextSession", { when: dep.nextSession }) : t("noSession")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/patient/booking"
                  className="inline-flex min-h-10 items-center bg-brand px-3 text-[13px] font-semibold text-white hover:bg-brand-dark"
                >
                  {t("cta.book")}
                </Link>
                <Link
                  href="/patient/payments"
                  className="inline-flex min-h-10 items-center border border-rule bg-white px-3 text-[13px] font-medium text-text hover:border-brand"
                >
                  {t("cta.pay")}
                </Link>
                <Link
                  href="/patient/talk-now"
                  className="inline-flex min-h-10 items-center border border-new px-3 text-[13px] font-semibold text-new hover:bg-new/5"
                >
                  {t("cta.urgent")}
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      </PatientPage>
    </PatientShell>
  );
}
