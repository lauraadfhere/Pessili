"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import type { CarePatient } from "@/lib/clinician/demo";

type Filter = "all" | "active" | "paused" | "discharged";

export function PatientsBoard({ patients }: { patients: CarePatient[] }) {
  const t = useTranslations("clinicianPatients");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<CarePatient | null>(patients[0] ?? null);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (q && !p.firstName.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [patients, filter, q]);

  const filters: Filter[] = ["all", "active", "paused", "discharged"];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search")}
          className="min-h-11 w-full border border-rule bg-white px-3 text-[14px]"
        />
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-[12px] font-semibold ${
                filter === f ? "bg-brand text-white" : "border border-rule bg-white text-text hover:bg-panel-head"
              }`}
            >
              {t(`filter${f[0].toUpperCase()}${f.slice(1)}` as "filterAll")}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-[14px] text-muted">{t("empty")}</p>
        ) : (
          <ul className="divide-y divide-rule border border-rule bg-white">
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className={`flex w-full items-start justify-between gap-2 px-4 py-3 text-start hover:bg-panel-head ${
                    selected?.id === p.id ? "bg-brand/5" : ""
                  }`}
                >
                  <div>
                    <p className="text-[15px] font-semibold text-text">{p.firstName}</p>
                    <p className="text-[12px] text-muted">{t("wilaya", { code: p.wilaya })}</p>
                    <p className="mt-1 text-[12px] text-muted">
                      {p.nextSession ? t("nextSession", { when: p.nextSession }) : t("noNext")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusPill label={p.status} tone={p.status === "active" ? "ok" : "neutral"} />
                    <StatusPill label={p.unpaid ? t("paymentUnpaid") : t("paymentPaid")} tone={p.unpaid ? "warn" : "ok"} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected ? (
        <div className="space-y-4 border border-rule bg-white p-4 sm:p-5">
          <h3 className="text-[16px] font-semibold text-text">
            {t("file")} — {selected.firstName}
          </h3>
          <section>
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("identity")}</h4>
            <p className="mt-1 text-[14px] text-text">
              {selected.firstName} · {t("wilaya", { code: selected.wilaya })}
            </p>
          </section>
          <section>
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("intake")}</h4>
            <p className="mt-1 text-[14px] text-muted">{t("intakePlaceholder")}</p>
          </section>
          <section>
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("screening")}</h4>
            <p className="mt-1">
              <StatusPill label={selected.status === "paused" ? t("screeningLocked") : t("screeningShared")} tone={selected.status === "paused" ? "neutral" : "ok"} />
            </p>
          </section>
          <section>
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("history")}</h4>
            <p className="mt-1 text-[14px] text-muted">{t("historyNote")}</p>
          </section>
          <section>
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("emergency")}</h4>
            <p className="mt-1 text-[14px] text-muted">{t("emergencyLocked")}</p>
          </section>
          <section>
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("payment")}</h4>
            <p className="mt-1">
              <StatusPill label={selected.unpaid ? t("paymentUnpaid") : t("paymentPaid")} tone={selected.unpaid ? "warn" : "ok"} />
            </p>
            <p className="mt-1 text-[12px] text-muted">{t("paymentNote")}</p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
