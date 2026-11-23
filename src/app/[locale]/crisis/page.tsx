import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function CrisisPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("crisis");

  return (
    <PageShell active="crisis" breadcrumbs={[{ label: t("breadcrumb") }]} hero={{ title: t("title") }}>
      <div className="mx-auto max-w-[1200px] space-y-6 px-6">
        <Panel title={t("urgentTitle")}>
          <p className="text-[14px] leading-relaxed">{t("urgentBody")}</p>
        </Panel>
        <Panel title={t("disclaimerTitle")}>
          <p className="text-[14px] leading-relaxed">{t("disclaimerBody")}</p>
        </Panel>
      </div>
    </PageShell>
  );
}