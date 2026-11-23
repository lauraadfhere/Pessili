"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_SESSIONS, DEMO_TECH_DIAGNOSTICS } from "@/lib/admin/demo";
import { DemoToast } from "./DemoToast";
import { btnDanger, btnPrimary, btnSecondary, inputClass, tableClass, tdClass, thClass } from "./adminUi";

type ModeFilter = "all" | "live" | "past";

export function SessionOps() {
  const t = useTranslations("adminSessions");
  const [filter, setFilter] = useState<ModeFilter>("all");
  const [sessionId, setSessionId] = useState("");
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(
    () => (filter === "all" ? DEMO_SESSIONS : DEMO_SESSIONS.filter((s) => s.mode === filter)),
    [filter],
  );

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  function act(kind: "reschedule" | "cancel") {
    const id = sessionId.trim() || rows[0]?.id || "s1";
    if (!reason.trim()) return;
    flash(t(`toast.${kind}`, { id }));
    setReason("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1.5">
        {(["all", "live", "past"] as ModeFilter[]).map((f) => (
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
              <th className={thClass}>{t("cols.mode")}</th>
              <th className={thClass}>{t("cols.patient")}</th>
              <th className={thClass}>{t("cols.clinician")}</th>
              <th className={thClass}>{t("cols.duration")}</th>
              <th className={thClass}>{t("cols.quality")}</th>
              <th className={thClass}>{t("cols.outcome")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.id}</td>
                <td className={tdClass}>
                  <StatusPill label={row.mode} tone={row.mode === "live" ? "brand" : "neutral"} />
                </td>
                <td className={tdClass}>{row.patient}</td>
                <td className={tdClass}>{row.clinician}</td>
                <td className={tdClass}>{t("durationMin", { min: row.durationMin })}</td>
                <td className={tdClass}>
                  <StatusPill
                    label={row.quality}
                    tone={row.quality === "good" ? "ok" : row.quality === "fair" ? "warn" : "danger"}
                  />
                </td>
                <td className={tdClass}>{row.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DiagStat label={t("dropRate")} value={`${DEMO_TECH_DIAGNOSTICS.dropRatePct}%`} />
        <DiagStat label={t("fallback")} value={`${DEMO_TECH_DIAGNOSTICS.fallbackUsagePct}%`} />
        <DiagStat label={t("provider")} value={t("operational")} />
        <div className="border border-rule bg-white px-4 py-3">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{t("regionIssues")}</p>
          <ul className="mt-2 space-y-1 text-[13px] text-text">
            {DEMO_TECH_DIAGNOSTICS.regionIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <label className="block text-[12px] font-semibold text-muted">
          {t("sessionIdPlaceholder")}
          <input className={`${inputClass} mt-1`} value={sessionId} onChange={(e) => setSessionId(e.target.value)} placeholder="s1" />
        </label>
        <label className="block text-[12px] font-semibold text-muted">
          {t("reasonPlaceholder")}
          <input className={`${inputClass} mt-1`} value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <button type="button" className={btnPrimary} disabled={!reason.trim()} onClick={() => act("reschedule")}>
          {t("actions.reschedule")}
        </button>
        <button type="button" className={btnDanger} disabled={!reason.trim()} onClick={() => act("cancel")}>
          {t("actions.cancel")}
        </button>
      </div>

      <DemoToast message={toast} />
    </div>
  );
}

function DiagStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-rule bg-white px-4 py-3">
      <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 text-[22px] font-semibold text-brand">{value}</p>
    </div>
  );
}
