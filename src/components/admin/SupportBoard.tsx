"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_SUPPORT_TEMPLATES, DEMO_SUPPORT_TICKETS } from "@/lib/admin/demo";
import { DemoToast } from "./DemoToast";
import { btnDanger, btnPrimary, btnSecondary, tableClass, tdClass, thClass } from "./adminUi";

type StatusFilter = "all" | "open" | "assigned" | "resolved";

export function SupportBoard() {
  const t = useTranslations("adminSupport");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const rows = useMemo(
    () => (filter === "all" ? DEMO_SUPPORT_TICKETS : DEMO_SUPPORT_TICKETS.filter((tk) => tk.status === filter)),
    [filter],
  );

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <div className="space-y-6">
      <p className="border border-brand/25 bg-brand/5 px-3 py-2 text-[13px] text-brand">{t("privacyNote")}</p>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "open", "assigned", "resolved"] as StatusFilter[]).map((f) => (
          <button key={f} type="button" className={filter === f ? btnPrimary : btnSecondary} onClick={() => setFilter(f)}>
            {t(`filters.${f}`)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>{t("cols.id")}</th>
              <th className={thClass}>{t("cols.category")}</th>
              <th className={thClass}>{t("cols.subject")}</th>
              <th className={thClass}>{t("cols.status")}</th>
              <th className={thClass}>{t("cols.lang")}</th>
              <th className={thClass}>{t("cols.sla")}</th>
              <th className={thClass}>{t("cols.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.id}</td>
                <td className={tdClass}>{t(`categories.${row.category}` as "categories.technical")}</td>
                <td className={tdClass}>{row.subject}</td>
                <td className={tdClass}>
                  <StatusPill
                    label={row.status}
                    tone={row.status === "resolved" ? "ok" : row.status === "assigned" ? "brand" : "warn"}
                  />
                </td>
                <td className={tdClass}>{row.lang}</td>
                <td className={tdClass}>{row.slaMin > 0 ? t("slaMin", { min: row.slaMin }) : "—"}</td>
                <td className={tdClass}>
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" className={btnDanger} onClick={() => flash(t("toast.crisis", { id: row.id }))}>
                      {t("escalate.crisis")}
                    </button>
                    <button type="button" className={btnSecondary} onClick={() => flash(t("toast.compliance", { id: row.id }))}>
                      {t("escalate.compliance")}
                    </button>
                    <button type="button" className={btnPrimary} onClick={() => flash(t("toast.finance", { id: row.id }))}>
                      {t("escalate.finance")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {DEMO_SUPPORT_TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="border border-rule bg-white px-4 py-3">
            <p className="text-[13px] font-semibold text-text">{t(`templates.${tpl.titleKey}` as "templates.joinSession")}</p>
            <p className="mt-1 text-[12px] text-muted">{tpl.lang.toUpperCase()}</p>
            <button
              type="button"
              className={`${btnSecondary} mt-3`}
              onClick={() => setDraft(t(`templates.${tpl.titleKey}` as "templates.joinSession"))}
            >
              {t("useTemplate")}
            </button>
          </div>
        ))}
      </div>

      {draft ? (
        <div className="border border-rule bg-panel-head/40 px-4 py-3 text-[13px] text-text">
          <p className="font-semibold">{draft}</p>
        </div>
      ) : null}

      <DemoToast message={toast} />
    </div>
  );
}
