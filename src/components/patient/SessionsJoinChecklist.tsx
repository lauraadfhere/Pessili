"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Panel } from "@/components/ui/SectionTitle";

type Props = {
  sessionId?: string;
};

export function SessionsJoinChecklist({ sessionId }: Props) {
  const t = useTranslations("patientSessions");
  const [open, setOpen] = useState(Boolean(sessionId));
  const [deviceOk, setDeviceOk] = useState(false);
  const [locationOk, setLocationOk] = useState(false);
  const [discreet, setDiscreet] = useState(false);

  return (
    <Panel title={t("checklist.title")} id="join-checklist">
      <p className="text-[14px] text-muted">{t("checklist.intro")}</p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 min-h-11 bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark"
        >
          {t("checklist.open")}
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 border border-rule bg-white px-3 py-3 text-[14px]">
            <input type="checkbox" checked={deviceOk} onChange={(e) => setDeviceOk(e.target.checked)} className="mt-1" />
            <span>
              <span className="font-semibold text-text">{t("checklist.device")}</span>
              <span className="mt-1 block text-[13px] text-muted">{t("checklist.deviceTip")}</span>
            </span>
          </label>
          <label className="flex items-start gap-3 border border-rule bg-white px-3 py-3 text-[14px]">
            <input
              type="checkbox"
              checked={locationOk}
              onChange={(e) => setLocationOk(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="font-semibold text-text">{t("checklist.location")}</span>
              <span className="mt-1 block text-[13px] text-muted">{t("checklist.locationTip")}</span>
            </span>
          </label>
          <label className="flex items-start gap-3 border border-rule bg-white px-3 py-3 text-[14px]">
            <input type="checkbox" checked={discreet} onChange={(e) => setDiscreet(e.target.checked)} className="mt-1" />
            <span>
              <span className="font-semibold text-text">{t("checklist.discreet")}</span>
              <span className="mt-1 block text-[13px] text-muted">{t("checklist.discreetTip")}</span>
            </span>
          </label>
          <button
            type="button"
            disabled={!deviceOk || !locationOk}
            className="min-h-11 bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            onClick={() => alert(t("checklist.joinDemo"))}
          >
            {t("checklist.join")}
          </button>
        </div>
      )}
    </Panel>
  );
}
