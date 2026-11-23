import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { DEMO_PAYMENTS, DEMO_SUBSCRIPTION } from "@/lib/patient/demo-care";
import { PatientShell } from "@/components/patient/PatientShell";
import { PatientPage } from "@/components/patient/PatientPage";
import { Panel } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/workspace/StatusPill";

type Props = { params: Promise<{ locale: string }> };

export default async function PaymentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session || session.role !== "patient") redirect(`/${locale}/login`);

  const t = await getTranslations("patientPayments");
  const sub = DEMO_SUBSCRIPTION;
  const requestsPct = Math.round((sub.requestsLeft / sub.requestsTotal) * 100);
  const minutesPct = Math.round((sub.minutesLeft / sub.minutesDaily) * 100);

  function paymentTone(status: string): "ok" | "warn" | "neutral" {
    if (status === "paid") return "ok";
    if (status === "refunded") return "warn";
    return "neutral";
  }

  return (
    <PatientShell>
      <PatientPage title={t("title")} subtitle={t("subtitle")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel title={t("plans.consultTitle")}>
            <p className="text-[28px] font-semibold text-brand">500 DZD</p>
            <p className="mt-2 text-[14px] text-muted">{t("plans.consultBody")}</p>
            <button
              type="button"
              className="mt-4 min-h-11 bg-brand px-4 text-[14px] font-semibold text-white hover:bg-brand-dark"
            >
              {t("plans.consultCta")}
            </button>
          </Panel>
          <Panel title={t("plans.subTitle")}>
            <p className="text-[28px] font-semibold text-brand">1000 DZD</p>
            <p className="mt-1 text-[12px] font-semibold tracking-wide text-muted uppercase">{t("plans.perMonth")}</p>
            <p className="mt-2 text-[14px] text-muted">{t("plans.subBody")}</p>
            <button
              type="button"
              className="mt-4 min-h-11 border border-brand px-4 text-[14px] font-semibold text-brand hover:bg-brand/5"
            >
              {t("plans.subCta")}
            </button>
          </Panel>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Panel title={t("wallet.title")}>
            <p className="text-[28px] font-semibold text-text">{t("wallet.balance", { amount: sub.walletDzd })}</p>
            <p className="mt-2 text-[14px] text-muted">{t("wallet.hint")}</p>
            <button
              type="button"
              className="mt-4 min-h-11 border border-rule bg-white px-4 text-[14px] font-medium text-text hover:border-brand"
            >
              {t("wallet.topUp")}
            </button>
          </Panel>

          <Panel title={t("meter.title")}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[13px] text-muted">
                  <span>{t("meter.requests")}</span>
                  <span>
                    {sub.requestsLeft}/{sub.requestsTotal}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden bg-panel-head">
                  <div className="h-full bg-brand" style={{ width: `${requestsPct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] text-muted">
                  <span>{t("meter.minutes")}</span>
                  <span>
                    {sub.minutesLeft}/{sub.minutesDaily}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden bg-panel-head">
                  <div className="h-full bg-brand" style={{ width: `${minutesPct}%` }} />
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title={t("invoices.title")} className="mt-6">
          <ul className="space-y-2">
            {DEMO_PAYMENTS.map((pay) => (
              <li
                key={pay.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-rule bg-white px-4 py-3"
              >
                <div>
                  <p className="text-[14px] font-medium text-text">{pay.label}</p>
                  <p className="text-[12px] text-muted">{pay.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-semibold text-text">{pay.amount} DZD</span>
                  <StatusPill label={t(`invoices.status.${pay.status}`)} tone={paymentTone(pay.status)} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </PatientPage>
    </PatientShell>
  );
}
