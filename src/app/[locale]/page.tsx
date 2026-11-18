import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { getActiveWilayas } from "@/lib/appwrite/server";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "", description: t("description") });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const wilayas = await getActiveWilayas();

  return (
    <PageShell
      active="home"
      hero={{
        title: t("heroTitle"),
        search: { action: `/${locale}/doctors`, placeholder: t("searchPlaceholder") },
      }}
      breadcrumbs={[{ label: t("breadcrumb") }]}
    >
      <div className="mx-auto max-w-[1200px] space-y-8 px-6">
        <Panel title={t("welcomeTitle")}>
          <p className="max-w-3xl text-[14px] leading-relaxed md:text-[16px]">{t("welcomeBody")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="bg-link px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-link-hover">
              {t("ctaPatient")}
            </Link>
            <Link href="/doctors" className="border border-text px-4 py-2.5 text-[14px] font-semibold text-text hover:bg-white">
              {t("ctaFindDoctor")}
            </Link>
          </div>
        </Panel>

        <Panel title={t("featuresTitle")}>
          <ul className="grid gap-4 md:grid-cols-2 text-[14px] leading-relaxed">
            <li>{t("feature1")}</li>
            <li>{t("feature2")}</li>
            <li>{t("feature3")}</li>
            <li>{t("feature4")}</li>
          </ul>
        </Panel>

        <Panel title={t("coverageTitle")}>
          <p className="text-[14px] text-muted">{t("coverageBody")}</p>
          <p className="mt-3 text-[13px] font-semibold text-text">
            {wilayas.length > 0 ? t("wilayaCount", { count: wilayas.length }) : t("wilayaPending")}
          </p>
        </Panel>
      </div>
    </PageShell>
  );
}