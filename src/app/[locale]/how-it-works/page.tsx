import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howItWorks");

  return (
    <PageShell active="howItWorks" breadcrumbs={[{ label: t("breadcrumb") }]} hero={{ title: t("title") }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <Panel title={t("stepsTitle")}>
          <ol className="list-decimal space-y-2 ps-5 text-[14px] leading-relaxed">
            <li>{t("step1")}</li>
            <li>{t("step2")}</li>
            <li>{t("step3")}</li>
            <li>{t("step4")}</li>
            <li>{t("step5")}</li>
          </ol>
        </Panel>
      </div>
    </PageShell>
  );
}