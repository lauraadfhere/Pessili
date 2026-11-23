import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("authPages");

  return (
    <PageShell breadcrumbs={[{ label: t("registerBreadcrumb") }]} hero={{ title: t("registerTitle") }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <Panel title={t("registerPanel")}>
          <p className="text-[14px] leading-relaxed">{t("registerBody")}</p>
        </Panel>
      </div>
    </PageShell>
  );
}