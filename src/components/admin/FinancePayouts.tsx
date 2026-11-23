"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_FINANCE, DEMO_PAYOUTS } from "@/lib/admin/demo";
import { DemoToast } from "./DemoToast";
import { btnPrimary, btnSecondary, tableClass, tdClass, thClass } from "./adminUi";

/** Demo session email used for requester ≠ approver check. */
const CURRENT_APPROVER = "admin@pessili.dz";

export function FinancePayouts() {
  const t = useTranslations("adminFinance");
  const [rows, setRows] = useState(DEMO_PAYOUTS);
  const [toast, setToast] = useState<string | null>(null);
  const [holds, setHolds] = useState(DEMO_FINANCE.holds);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  function approve(id: string) {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    if (row.requestedBy === CURRENT_APPROVER) {
      flash(t("toast.blocked", { id }));
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    flash(t("toast.approve", { id }));
  }

  return (
    <div className="space-y-6">
      <p className="border border-promo-accent/30 bg-promo-accent/10 px-3 py-2 text-[13px] text-text">{t("segregationNote")}</p>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>{t("cols.id")}</th>
              <th className={thClass}>{t("cols.clinician")}</th>
              <th className={thClass}>{t("cols.net")}</th>
              <th className={thClass}>{t("cols.requestedBy")}</th>
              <th className={thClass}>{t("cols.status")}</th>
              <th className={thClass}>{t("cols.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.id}</td>
                <td className={tdClass}>{row.clinician}</td>
                <td className={tdClass}>{t("metrics.dzd", { value: row.netDzd.toLocaleString("en-US") })}</td>
                <td className={tdClass}>{row.requestedBy}</td>
                <td className={tdClass}>
                  <StatusPill label={row.status} tone={row.status === "approved" ? "ok" : "warn"} />
                </td>
                <td className={tdClass}>
                  <button
                    type="button"
                    className={btnPrimary}
                    disabled={row.status === "approved"}
                    onClick={() => approve(row.id)}
                  >
                    {t("approve")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <StatusPill label={`${t("metrics.holds")}: ${holds}`} tone="warn" />
        <StatusPill label={`${t("metrics.failed")}: ${DEMO_FINANCE.failedPayments}`} tone="danger" />
        <StatusPill label={`${t("metrics.refunds")}: ${DEMO_FINANCE.refundsPending}`} tone="neutral" />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setHolds((h) => h + 1);
            flash(t("toast.hold"));
          }}
        >
          {t("hold")}
        </button>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => {
            setHolds((h) => Math.max(0, h - 1));
            flash(t("toast.release"));
          }}
        >
          {t("release")}
        </button>
      </div>

      <DemoToast message={toast} />
    </div>
  );
}
