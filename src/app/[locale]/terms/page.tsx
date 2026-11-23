import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <PageShell breadcrumbs={[{ label: t("termsBreadcrumb") }]} hero={{ title: t("termsTitle") }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <Panel title={t("termsTitle")}>
          <p className="text-[14px] leading-relaxed">{t("termsBody")}</p>
        </Panel>
      </div>
    </PageShell>
  );
}