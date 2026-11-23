"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_CLINICIAN_DIRECTORY } from "@/lib/admin/demo";
import { DemoToast } from "./DemoToast";
import { btnSecondary, inputClass, tableClass, tdClass, thClass } from "./adminUi";

export function ClinicianDirectory() {
  const t = useTranslations("adminClinicians");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEMO_CLINICIAN_DIRECTORY;
    return DEMO_CLINICIAN_DIRECTORY.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.wilaya.includes(q) ||
        r.language.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          className={`${inputClass} max-w-md`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
        />
      </div>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>{t("cols.name")}</th>
              <th className={thClass}>{t("cols.status")}</th>
              <th className={thClass}>{t("cols.language")}</th>
              <th className={thClass}>{t("cols.wilaya")}</th>
              <th className={thClass}>{t("cols.load")}</th>
              <th className={thClass}>{t("cols.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.name}</td>
                <td className={tdClass}>
                  <StatusPill label={row.status} tone={row.status === "online" ? "ok" : "neutral"} />
                </td>
                <td className={tdClass}>{row.language}</td>
                <td className={tdClass}>{row.wilaya}</td>
                <td className={tdClass}>{row.load}</td>
                <td className={tdClass}>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() => {
                      setToast(`${t("forceOffline")}: ${row.name}`);
                      window.setTimeout(() => setToast(null), 2800);
                    }}
                  >
                    {t("forceOffline")}
                  </button>
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
