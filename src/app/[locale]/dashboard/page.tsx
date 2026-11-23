import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/SectionTitle";
import { SignOutButton } from "@/components/auth/SignOutButton";

type Props = { params: Promise<{ locale: string }> };

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role === "patient") redirect(`/${locale}/patient/dashboard`);
  if (session.role === "doctor") redirect(`/${locale}/clinician/today`);
  if (session.role === "admin") redirect(`/${locale}/admin/overview`);

  const t = await getTranslations("dashboard");
  const roleLabels = {
    patient: t("roles.patient"),
    doctor: t("roles.doctor"),
    admin: t("roles.admin"),
  } as const;
  const roleLabel = roleLabels[session.role] ?? session.role;

  return (
    <PageShell breadcrumbs={[{ label: t("breadcrumb") }]} hero={{ title: t("title") }}>
      <div className="mx-auto max-w-[1200px] space-y-6 px-6">
        <Panel title={t("welcome", { role: roleLabel })}>
          <p className="text-[14px] leading-relaxed">{t("body")}</p>
          <p className="mt-2 font-mono text-[13px] text-muted">{session.email}</p>
          <div className="mt-4">
            <SignOutButton />
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
