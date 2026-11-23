"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_CRISIS_ALERTS, DEMO_URGENT_QUEUE } from "@/lib/admin/demo";
import { DemoToast } from "./DemoToast";
import { btnPrimary, btnSecondary, tableClass, tdClass, thClass } from "./adminUi";

type Filter = "all" | "waiting" | "offered" | "accepted" | "missed";

function statusTone(status: string): "neutral" | "ok" | "warn" | "danger" | "brand" {
  if (status === "accepted" || status === "Acknowledged" || status === "In progress") return "ok";
  if (status === "waiting" || status === "New") return "warn";
  if (status === "missed") return "danger";
  return "brand";
}

export function UrgentQueuePanel() {
  const t = useTranslations("adminUrgent");
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<string | null>(null);

  const queue = useMemo(
    () => (filter === "all" ? DEMO_URGENT_QUEUE : DEMO_URGENT_QUEUE.filter((q) => q.status === filter)),
    [filter],
  );

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  const filters: Filter[] = ["all", "waiting", "offered", "accepted", "missed"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={filter === f ? btnPrimary : btnSecondary}
          >
            {t(`filters.${f}`)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>{t("cols.id")}</th>
              <th className={thClass}>{t("cols.status")}</th>
              <th className={thClass}>{t("cols.wait")}</th>
              <th className={thClass}>{t("cols.lang")}</th>
              <th className={thClass}>{t("cols.wilaya")}</th>
              <th className={thClass}>{t("cols.risk")}</th>
              <th className={thClass}>{t("cols.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.id}</td>
                <td className={tdClass}>
                  <StatusPill label={row.status} tone={statusTone(row.status)} />
                </td>
                <td className={tdClass}>{t("waitMin", { min: row.waitMin })}</td>
                <td className={tdClass}>{row.language}</td>
                <td className={tdClass}>{row.wilaya}</td>
                <td className={tdClass}>{row.risk}</td>
                <td className={tdClass}>
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" className={btnSecondary} onClick={() => flash(t("toast.reOffer", { id: row.id }))}>
                      {t("actions.reOffer")}
                    </button>
                    <button type="button" className={btnPrimary} onClick={() => flash(t("toast.pageOnCall", { id: row.id }))}>
                      {t("actions.pageOnCall")}
                    </button>
                    <button type="button" className={btnSecondary} onClick={() => flash(t("toast.callback", { id: row.id }))}>
                      {t("actions.callback")}
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

export function CrisisAlertsBoard() {
  const t = useTranslations("adminUrgent");
  const [crisis, setCrisis] = useState(DEMO_CRISIS_ALERTS);
  const [toast, setToast] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>{t("cols.id")}</th>
              <th className={thClass}>{t("cols.source")}</th>
              <th className={thClass}>{t("cols.severity")}</th>
              <th className={thClass}>{t("cols.status")}</th>
              <th className={thClass}>{t("cols.sla")}</th>
              <th className={thClass}>{t("cols.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {crisis.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.id}</td>
                <td className={tdClass}>{t(`sources.${row.source}` as "sources.screening")}</td>
                <td className={tdClass}>
                  <StatusPill label={String(row.severity)} tone={row.severity >= 3 ? "danger" : "warn"} />
                </td>
                <td className={tdClass}>
                  <StatusPill label={row.status} tone={statusTone(row.status)} />
                </td>
                <td className={tdClass}>{row.slaSec > 0 ? t("slaSec", { sec: row.slaSec }) : t("slaOk")}</td>
                <td className={tdClass}>
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => {
                      setCrisis((prev) =>
                        prev.map((c) => (c.id === row.id ? { ...c, status: "Acknowledged", slaSec: 0 } : c)),
                      );
                      flash(t("toast.ack", { id: row.id }));
                    }}
                  >
                    {t("actions.ack")}
                  </button>
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
