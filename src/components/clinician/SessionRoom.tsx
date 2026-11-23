"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";

type Format = "video" | "audio" | "chat";

export function SessionRoom() {
  const t = useTranslations("clinicianSession");
  const [format, setFormat] = useState<Format>("video");
  const [seconds, setSeconds] = useState(45 * 60);
  const [running, setRunning] = useState(true);
  const [admitted, setAdmitted] = useState(false);
  const [crisisMsg, setCrisisMsg] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [lowBw, setLowBw] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function crisis(action: string) {
    setCrisisMsg(`${t("crisisDone")}: ${action}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold uppercase text-muted">{t("format")}</span>
          {(["video", "audio", "chat"] as Format[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={`px-3 py-2 text-[13px] font-semibold ${format === f ? "bg-brand text-white" : "border border-rule bg-white"}`}
            >
              {t(f)}
            </button>
          ))}
          <label className="ms-auto flex items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" checked={lowBw} onChange={(e) => setLowBw(e.target.checked)} />
            {t("lowBandwidth")}
          </label>
        </div>

        <div className="grid min-h-[220px] place-items-center border border-rule bg-[#0f1c1f] text-white">
          <div className="text-center">
            <p className="text-[13px] uppercase tracking-wide text-white/70">{t("timer")}</p>
            <p className="mt-2 font-mono text-[36px] font-semibold">
              {mm}:{ss}
            </p>
            <p className="mt-2 text-[13px] text-white/80">
              {format.toUpperCase()}
              {lowBw ? " · LB" : ""}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => setRunning((r) => !r)} className="border border-white/40 px-3 py-2 text-[12px]">
                {running ? "Pause" : "Resume"}
              </button>
              <button type="button" className="bg-brand px-3 py-2 text-[12px] font-semibold">
                {t("extend")}
              </button>
              <button type="button" className="border border-white/40 px-3 py-2 text-[12px]">
                {t("callFallback")}
              </button>
            </div>
          </div>
        </div>

        <div className="border border-rule bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[12px] font-semibold uppercase text-muted">{t("waiting")}</p>
              <p className="mt-1 text-[14px] text-text">{admitted ? t("admitted") : t("waitingNote")}</p>
            </div>
            {!admitted ? (
              <button type="button" onClick={() => setAdmitted(true)} className="bg-brand px-4 py-2 text-[13px] font-semibold text-white">
                {t("admit")}
              </button>
            ) : (
              <StatusPill label={t("admitted")} tone="ok" />
            )}
          </div>
        </div>

        <div className="border border-new/30 bg-white p-4">
          <p className="text-[12px] font-semibold uppercase text-new">{t("crisis")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => crisis(t("escalate"))} className="bg-new px-3 py-2 text-[12px] font-semibold text-white">
              {t("escalate")}
            </button>
            <button type="button" onClick={() => crisis(t("confirmLocation"))} className="border border-text px-3 py-2 text-[12px] font-semibold">
              {t("confirmLocation")}
            </button>
            <button type="button" onClick={() => crisis(t("emergencyNumbers"))} className="border border-text px-3 py-2 text-[12px] font-semibold">
              {t("emergencyNumbers")}
            </button>
            <button type="button" onClick={() => crisis(t("secondClinician"))} className="border border-text px-3 py-2 text-[12px] font-semibold">
              {t("secondClinician")}
            </button>
          </div>
          {crisisMsg ? <p className="mt-3 text-[13px] text-brand">{crisisMsg}</p> : null}
        </div>

        <div className="border border-rule bg-panel-head/40 p-4 text-[13px] text-muted">
          <p className="font-semibold text-text">{t("wrapUp")}</p>
          <p className="mt-1">{t("wrapUpNote")}</p>
        </div>
      </div>

      <aside className="space-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">{t("sidePanels")}</p>
        <div className="border border-rule bg-white p-3">
          <h4 className="text-[13px] font-semibold">{t("intake")}</h4>
          <p className="mt-1 text-[13px] text-muted">{t("intakeBody")}</p>
        </div>
        <div className="border border-rule bg-white p-3">
          <h4 className="text-[13px] font-semibold">{t("screening")}</h4>
          <p className="mt-1 text-[13px] text-muted">{t("screeningBody")}</p>
        </div>
        <div className="border border-rule bg-white p-3">
          <h4 className="text-[13px] font-semibold">{t("prevNotes")}</h4>
          <p className="mt-1 text-[13px] text-muted">{t("prevNotesBody")}</p>
        </div>
        <div className="border border-rule bg-white p-3">
          <h4 className="text-[13px] font-semibold">{t("notesPad")}</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("notesPlaceholder")}
            rows={5}
            className="mt-2 w-full border border-rule px-2 py-2 text-[13px]"
          />
        </div>
      </aside>
    </div>
  );
}
