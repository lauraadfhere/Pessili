"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_PATIENTS } from "@/lib/admin/demo";
import { DemoToast } from "./DemoToast";
import { btnPrimary, btnSecondary, inputClass, tableClass, tdClass, thClass } from "./adminUi";

export function PatientLookup() {
  const t = useTranslations("adminPatients");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(DEMO_PATIENTS);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.email.toLowerCase().includes(q) || r.phone.includes(q));
  }, [query, rows]);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <div className="space-y-4">
      <p className="border border-brand/25 bg-brand/5 px-3 py-2 text-[13px] text-brand">{t("privacyBanner")}</p>
      <div className="flex flex-wrap gap-2">
        <input
          className={`${inputClass} max-w-md`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
        />
        <button type="button" className={btnPrimary}>
          {t("search")}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>{t("cols.email")}</th>
              <th className={thClass}>{t("cols.phone")}</th>
              <th className={thClass}>{t("cols.status")}</th>
              <th className={thClass}>{t("cols.wilaya")}</th>
              <th className={thClass}>{t("cols.subscription")}</th>
              <th className={thClass}>{t("cols.lastLogin")}</th>
              <th className={thClass}>{t("cols.language")}</th>
              <th className={thClass}>{t("cols.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.email}</td>
                <td className={tdClass}>{row.phone}</td>
                <td className={tdClass}>
                  <StatusPill
                    label={t(`statuses.${row.status}` as "statuses.active")}
                    tone={row.status === "active" ? "ok" : row.status === "locked" ? "danger" : "warn"}
                  />
                </td>
                <td className={tdClass}>{row.wilaya}</td>
                <td className={tdClass}>{row.subscription}</td>
                <td className={tdClass}>{row.lastLogin}</td>
                <td className={tdClass}>{row.language}</td>
                <td className={tdClass}>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      className={btnPrimary}
                      onClick={() => {
                        setRows((prev) =>
                          prev.map((p) => (p.id === row.id ? { ...p, status: "active" } : p)),
                        );
                        flash(t("toast.unlock", { email: row.email }));
                      }}
                    >
                      {t("actions.unlock")}
                    </button>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => flash(t("toast.resend", { email: row.email }))}
                    >
                      {t("actions.resend")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DemoToast message={toast} />
    </div>
  );
}
