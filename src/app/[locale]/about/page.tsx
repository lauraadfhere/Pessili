import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <PageShell active="about" breadcrumbs={[{ label: t("breadcrumb") }]} hero={{ title: t("title") }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <Panel title={t("missionTitle")}>
          <p className="text-[14px] leading-relaxed">{t("missionBody")}</p>
        </Panel>
      </div>
    </PageShell>
  );
}