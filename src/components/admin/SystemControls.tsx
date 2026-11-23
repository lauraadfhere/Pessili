"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_FEATURE_FLAGS } from "@/lib/admin/demo";
import { btnPrimary, btnSecondary, tableClass, tdClass, thClass } from "./adminUi";

export function SystemControls() {
  const t = useTranslations("adminSystem");
  const [flags, setFlags] = useState(DEMO_FEATURE_FLAGS);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>{t("cols.key")}</th>
              <th className={thClass}>{t("cols.enabled")}</th>
              <th className={thClass}>{t("cols.status")}</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((flag) => (
              <tr key={flag.id}>
                <td className={tdClass}>
                  <code className="font-mono text-[12px]">{flag.key}</code>
                </td>
                <td className={tdClass}>
                  <StatusPill label={flag.enabled ? "ON" : "OFF"} tone={flag.enabled ? "ok" : "neutral"} />
                </td>
                <td className={tdClass}>
                  <button
                    type="button"
                    className={flag.enabled ? btnSecondary : btnPrimary}
                    onClick={() =>
                      setFlags((prev) =>
                        prev.map((f) => (f.id === flag.id ? { ...f, enabled: !f.enabled } : f)),
                      )
                    }
                  >
                    {flag.enabled ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-rule bg-white px-4 py-4">
        <p className="text-[14px] font-semibold text-text">{t("maintenance")}</p>
        <p className="mt-1 text-[13px] text-muted">{maintenance ? t("maintenanceOn") : t("maintenanceOff")}</p>
        <button
          type="button"
          className={`mt-3 ${maintenance ? btnSecondary : btnPrimary}`}
          onClick={() => setMaintenance((v) => !v)}
        >
          {maintenance ? t("toggleOff") : t("toggleOn")}
        </button>
      </div>
    </div>
  );
}
