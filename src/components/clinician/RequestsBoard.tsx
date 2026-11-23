"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_REQUESTS } from "@/lib/clinician/demo";

type Req = (typeof DEMO_REQUESTS)[number] & { outcome?: "accepted" | "declined" | "proposed" };

export function RequestsBoard({ requests }: { requests: typeof DEMO_REQUESTS }) {
  const t = useTranslations("clinicianRequests");
  const [items, setItems] = useState<Req[]>(requests);
  const [proposeId, setProposeId] = useState<string | null>(null);
  const [proposeSlot, setProposeSlot] = useState("");
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  function setOutcome(id: string, outcome: Req["outcome"]) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, outcome } : r)));
    setProposeId(null);
    setDeclineId(null);
  }

  const pending = items.filter((r) => !r.outcome);

  return (
    <div className="space-y-4">
      <h3 className="text-[16px] font-semibold text-text">{t("incoming")}</h3>
      {pending.length === 0 && items.every((r) => r.outcome) ? (
        <p className="text-[14px] text-muted">{t("empty")}</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((req) => (
          <li key={req.id} className="border border-rule bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-text">{req.patient}</p>
                <p className="mt-1 text-[13px] text-muted">
                  {t("slot")}: {req.slot} · {t("format")}: {req.format}
                </p>
                <div className="mt-2">
                  <StatusPill
                    label={req.sharedScreening ? t("screeningShared") : t("screeningPrivate")}
                    tone={req.sharedScreening ? "ok" : "neutral"}
                  />
                </div>
              </div>
              {req.outcome ? (
                <StatusPill
                  label={
                    req.outcome === "accepted" ? t("doneAccept") : req.outcome === "declined" ? t("doneDecline") : t("donePropose")
                  }
                  tone={req.outcome === "accepted" ? "ok" : "brand"}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setOutcome(req.id, "accepted")}
                    className="bg-brand px-3 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark"
                  >
                    {t("accept")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeclineId(req.id);
                      setProposeId(null);
                    }}
                    className="border border-text px-3 py-2 text-[13px] font-semibold hover:bg-panel-head"
                  >
                    {t("decline")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProposeId(req.id);
                      setDeclineId(null);
                    }}
                    className="border border-brand px-3 py-2 text-[13px] font-semibold text-brand hover:bg-brand/5"
                  >
                    {t("propose")}
                  </button>
                </div>
              )}
            </div>
            {proposeId === req.id ? (
              <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-rule pt-3">
                <label className="text-[12px] text-muted">
                  {t("propose")}
                  <input
                    value={proposeSlot}
                    onChange={(e) => setProposeSlot(e.target.value)}
                    placeholder={t("proposePlaceholder")}
                    className="mt-1 block min-h-10 w-48 border border-rule px-2 text-[13px]"
                  />
                </label>
                <button
                  type="button"
                  disabled={!proposeSlot.trim()}
                  onClick={() => setOutcome(req.id, "proposed")}
                  className="bg-brand px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
                >
                  {t("sendPropose")}
                </button>
              </div>
            ) : null}
            {declineId === req.id ? (
              <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-rule pt-3">
                <label className="text-[12px] text-muted">
                  {t("reasonPlaceholder")}
                  <input
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder={t("reasonPlaceholder")}
                    className="mt-1 block min-h-10 w-56 border border-rule px-2 text-[13px]"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setOutcome(req.id, "declined")}
                  className="bg-new px-3 py-2 text-[13px] font-semibold text-white"
                >
                  {t("decline")}
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
