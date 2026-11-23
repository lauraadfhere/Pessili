"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatusPill } from "@/components/workspace/StatusPill";
import type { UrgentOffer } from "@/lib/clinician/demo";

type HistoryItem = {
  id: string;
  label: string;
  status: "accepted" | "declined" | "missed";
  reason?: string;
};

const seedHistory: HistoryItem[] = [
  { id: "h1", label: "18–24 · fr · Sleep crisis", status: "accepted" },
  { id: "h2", label: "35–44 · ar · Family conflict", status: "declined", reason: "busy" },
  { id: "h3", label: "25–34 · ar · Panic", status: "missed" },
];

export function UrgentBoard({ offers }: { offers: UrgentOffer[] }) {
  const t = useTranslations("clinicianUrgent");
  const [open, setOpen] = useState(offers);
  const [history, setHistory] = useState(seedHistory);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [reason, setReason] = useState<"busy" | "fatigue" | "language" | "other">("busy");
  const [acceptedMsg, setAcceptedMsg] = useState<string | null>(null);
  const [urgentCount, setUrgentCount] = useState(1);

  const reasons = useMemo(
    () => ({ busy: t("reasons.busy"), fatigue: t("reasons.fatigue"), language: t("reasons.language"), other: t("reasons.other") }),
    [t],
  );

  function accept(offer: UrgentOffer) {
    setOpen((prev) => prev.filter((o) => o.id !== offer.id));
    setHistory((prev) => [
      { id: offer.id, label: `${offer.ageBand} · ${offer.language} · ${offer.reason}`, status: "accepted" },
      ...prev,
    ]);
    setUrgentCount((n) => n + 1);
    setAcceptedMsg(t("acceptedUnlock"));
  }

  function decline(offer: UrgentOffer) {
    setOpen((prev) => prev.filter((o) => o.id !== offer.id));
    setHistory((prev) => [
      {
        id: offer.id,
        label: `${offer.ageBand} · ${offer.language} · ${offer.reason}`,
        status: "declined",
        reason,
      },
      ...prev,
    ]);
    setDeclineId(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-rule bg-white p-4">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("shift")}</p>
          <p className="mt-2 text-[14px] text-text">{t("shiftTimer")}</p>
          <p className="mt-3 text-[12px] text-muted">{t("earningsNote")}</p>
        </div>
        <div className="border border-rule bg-white p-4">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("onDemandHours")}</p>
          <p className="mt-2 text-[14px] text-text">{t("onDemandNote")}</p>
          <button type="button" className="mt-3 border border-text px-3 py-2 text-[13px] font-semibold hover:bg-panel-head">
            {t("editHours")}
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[16px] font-semibold text-text">{t("offers")}</h3>
        {acceptedMsg ? (
          <p className="mb-3 border border-brand/30 bg-brand/5 px-3 py-2 text-[13px] text-brand">
            {acceptedMsg}{" "}
            <Link href="/clinician/session" className="font-semibold underline">
              →
            </Link>
          </p>
        ) : null}
        {open.length === 0 ? (
          <p className="text-[14px] text-muted">{t("noOffers")}</p>
        ) : (
          <ul className="space-y-3">
            {open.map((offer) => (
              <li key={offer.id} className="border border-new/30 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <StatusPill label={`R${offer.riskLevel}`} tone={offer.riskLevel >= 3 ? "danger" : "warn"} />
                    <p className="mt-2 text-[15px] font-semibold text-text">
                      {offer.ageBand} · {offer.language} · {offer.reason}
                    </p>
                    <dl className="mt-2 grid gap-1 text-[13px] text-muted sm:grid-cols-2">
                      <div>
                        {t("wait")}: {t("minutes", { n: offer.waitMinutes })}
                      </div>
                      <div>
                        {t("wilaya")}: {offer.wilaya}
                      </div>
                      <div>
                        {t("format")}: {offer.format}
                      </div>
                      <div className="font-semibold text-new">
                        {t("countdown")}: {t("seconds", { n: offer.secondsLeft })}
                      </div>
                    </dl>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => accept(offer)}
                      className="bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark"
                    >
                      {t("accept")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeclineId(offer.id)}
                      className="border border-text px-4 py-2 text-[13px] font-semibold hover:bg-panel-head"
                    >
                      {t("decline")}
                    </button>
                  </div>
                </div>
                {declineId === offer.id ? (
                  <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-rule pt-3">
                    <label className="text-[12px] text-muted">
                      {t("declineReason")}
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value as typeof reason)}
                        className="mt-1 block min-h-10 border border-rule bg-white px-2 text-[13px] text-text"
                      >
                        {Object.entries(reasons).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => decline(offer)}
                      className="bg-new px-4 py-2 text-[13px] font-semibold text-white"
                    >
                      {t("decline")}
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border border-rule bg-white p-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("fatigue")}</p>
        <p className="mt-2 text-[14px] text-text">{t("fatigueNote", { count: urgentCount })}</p>
      </div>

      <div>
        <h3 className="mb-3 text-[16px] font-semibold text-text">{t("history")}</h3>
        {history.length === 0 ? (
          <p className="text-[14px] text-muted">{t("historyEmpty")}</p>
        ) : (
          <ul className="divide-y divide-rule border border-rule bg-white">
            {history.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[14px]">
                <span>{item.label}</span>
                <StatusPill
                  label={t(`historyStatus.${item.status}`)}
                  tone={item.status === "accepted" ? "ok" : item.status === "missed" ? "danger" : "neutral"}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
