"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_VERIFICATIONS } from "@/lib/admin/demo";
import { DemoToast } from "./DemoToast";
import { btnDanger, btnPrimary, btnSecondary, tableClass, tdClass, thClass } from "./adminUi";

type Row = (typeof DEMO_VERIFICATIONS)[number] & { decided?: string };

export function VerificationQueue() {
  const t = useTranslations("adminClinicians");
  const [rows, setRows] = useState<Row[]>(DEMO_VERIFICATIONS);
  const [toast, setToast] = useState<string | null>(null);

  function decide(id: string, decision: "approve" | "requestChanges" | "reject") {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const status =
      decision === "approve" ? "Approved" : decision === "requestChanges" ? "Needs changes" : "Rejected";
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status, decided: decision } : r)));
    setToast(t(`toast.${decision}`, { name: row.name }));
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>{t("cols.name")}</th>
              <th className={thClass}>{t("cols.specialty")}</th>
              <th className={thClass}>{t("cols.status")}</th>
              <th className={thClass}>{t("cols.sla")}</th>
              <th className={thClass}>{t("cols.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.name}</td>
                <td className={tdClass}>{row.specialty}</td>
                <td className={tdClass}>
                  <StatusPill
                    label={row.status}
                    tone={
                      row.status === "Approved"
                        ? "ok"
                        : row.status === "Rejected"
                          ? "danger"
                          : row.status === "Needs changes"
                            ? "warn"
                            : "brand"
                    }
                  />
                </td>
                <td className={tdClass}>{t("slaHours", { h: row.slaHours })}</td>
                <td className={tdClass}>
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" className={btnPrimary} onClick={() => decide(row.id, "approve")}>
                      {t("actions.approve")}
                    </button>
                    <button type="button" className={btnSecondary} onClick={() => decide(row.id, "requestChanges")}>
                      {t("actions.requestChanges")}
                    </button>
                    <button type="button" className={btnDanger} onClick={() => decide(row.id, "reject")}>
                      {t("actions.reject")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DemoToast message={toast} />
    </>
  );
}
