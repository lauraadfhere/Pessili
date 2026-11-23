import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_FINANCE } from "@/lib/admin/demo";
import { AdminShell } from "@/components/admin/AdminShell";
import { FinancePayouts } from "@/components/admin/FinancePayouts";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminFinancePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminFinance");
  const f = DEMO_FINANCE;

  const metrics = [
    { label: t("metrics.consultations"), value: t("metrics.dzd", { value: f.consultationsDzd.toLocaleString("en-US") }) },
    { label: t("metrics.subscriptions"), value: t("metrics.dzd", { value: f.subscriptionsDzd.toLocaleString("en-US") }) },
    { label: t("metrics.institutional"), value: t("metrics.dzd", { value: f.institutionalDzd.toLocaleString("en-US") }) },
    { label: t("metrics.payoutsPending"), value: t("metrics.dzd", { value: f.payoutsPendingDzd.toLocaleString("en-US") }) },
  ];

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("revenueTitle")}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="border border-rule bg-white px-4 py-4">
                <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{m.label}</p>
                <p className="mt-1 text-[22px] font-semibold text-brand">{m.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={t("payoutsTitle")} className="mt-6">
          <FinancePayouts />
        </Panel>
      </WorkspacePage>
    </AdminShell>
  );
}
