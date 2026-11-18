import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function DoctorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("doctors");

  return (
    <PageShell active="doctors" breadcrumbs={[{ label: t("breadcrumb") }]} hero={{ title: t("title") }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <Panel title={t("comingTitle")}>
          <p className="text-[14px] leading-relaxed">{t("comingBody")}</p>
        </Panel>
      </div>
    </PageShell>
  );
}