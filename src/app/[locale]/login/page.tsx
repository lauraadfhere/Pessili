import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Loader } from "@/components/ui/Loader";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return { title: t("heroTitle"), robots: { index: false } };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (session) redirect(`/${locale}/dashboard`);

  const t = await getTranslations("login");
  const tCommon = await getTranslations("breadcrumb");

  return (
    <PageShell hero={{ title: t("heroTitle") }} breadcrumbs={[{ label: tCommon("home"), href: "/" }, { label: t("heroTitle") }]}>
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 md:grid-cols-[minmax(0,460px)_1fr]">
        <Panel title={t("panelTitle")}>
          <Suspense fallback={<div className="flex justify-center py-8"><Loader size={40} /></div>}>
            <LoginForm />
          </Suspense>
        </Panel>
        <div className="space-y-3 pt-2 text-[14px] leading-[1.6]">
          <h2 className="text-[17px] font-semibold">{t("asideTitle")}</h2>
          <p>{t("asideBody")}</p>
        </div>
      </div>
    </PageShell>
  );
}