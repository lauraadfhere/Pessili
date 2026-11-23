"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";

type Template = "soap" | "dap" | "free";

export function NotesWorkspace() {
  const t = useTranslations("clinicianNotes");
  const [template, setTemplate] = useState<Template>("soap");
  const [shared, setShared] = useState(true);
  const [signed, setSigned] = useState(false);
  const [fields, setFields] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    body: "",
    presenting: "",
    scores: "PHQ-9: 12 · GAD-7: 9",
    observations: "",
    recommendations: "",
  });
  const [pdfMsg, setPdfMsg] = useState(false);

  function setField(key: keyof typeof fields, value: string) {
    if (signed) return;
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase text-muted">{t("template")}</span>
        {(["soap", "dap", "free"] as Template[]).map((tpl) => (
          <button
            key={tpl}
            type="button"
            disabled={signed}
            onClick={() => setTemplate(tpl)}
            className={`px-3 py-2 text-[13px] font-semibold disabled:opacity-60 ${
              template === tpl ? "bg-brand text-white" : "border border-rule bg-white"
            }`}
          >
            {t(tpl)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[12px] font-semibold uppercase text-muted">{t("visibility")}</span>
        <button
          type="button"
          disabled={signed}
          onClick={() => setShared(true)}
          className={`px-3 py-2 text-[13px] font-semibold ${shared ? "bg-brand text-white" : "border border-rule bg-white"}`}
        >
          {t("shared")}
        </button>
        <button
          type="button"
          disabled={signed}
          onClick={() => setShared(false)}
          className={`px-3 py-2 text-[13px] font-semibold ${!shared ? "bg-brand text-white" : "border border-rule bg-white"}`}
        >
          {t("private")}
        </button>
        <StatusPill label={t("autosave")} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {template === "free" ? (
          <label className="block text-[13px] lg:col-span-2">
            {t("body")}
            <textarea
              value={fields.body}
              onChange={(e) => setField("body", e.target.value)}
              disabled={signed}
              rows={8}
              className="mt-1 w-full border border-rule px-3 py-2 text-[14px] disabled:bg-panel-head"
            />
          </label>
        ) : (
          <>
            <label className="block text-[13px]">
              {t("subjective")}
              <textarea
                value={fields.subjective}
                onChange={(e) => setField("subjective", e.target.value)}
                disabled={signed}
                rows={4}
                className="mt-1 w-full border border-rule px-3 py-2 text-[14px] disabled:bg-panel-head"
              />
            </label>
            <label className="block text-[13px]">
              {t("objective")}
              <textarea
                value={fields.objective}
                onChange={(e) => setField("objective", e.target.value)}
                disabled={signed}
                rows={4}
                className="mt-1 w-full border border-rule px-3 py-2 text-[14px] disabled:bg-panel-head"
              />
            </label>
            <label className="block text-[13px]">
              {t("assessment")}
              <textarea
                value={fields.assessment}
                onChange={(e) => setField("assessment", e.target.value)}
                disabled={signed}
                rows={4}
                className="mt-1 w-full border border-rule px-3 py-2 text-[14px] disabled:bg-panel-head"
              />
            </label>
            <label className="block text-[13px]">
              {t("plan")}
              <textarea
                value={fields.plan}
                onChange={(e) => setField("plan", e.target.value)}
                disabled={signed}
                rows={4}
                className="mt-1 w-full border border-rule px-3 py-2 text-[14px] disabled:bg-panel-head"
              />
            </label>
          </>
        )}
      </div>

      <div className="border border-rule bg-white p-4">
        <h3 className="text-[15px] font-semibold text-text">{t("report")}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-[13px]">
            {t("presenting")}
            <input
              value={fields.presenting}
              onChange={(e) => setField("presenting", e.target.value)}
              disabled={signed}
              className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px] disabled:bg-panel-head"
            />
          </label>
          <label className="block text-[13px]">
            {t("scores")}
            <input
              value={fields.scores}
              onChange={(e) => setField("scores", e.target.value)}
              disabled={signed}
              className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px] disabled:bg-panel-head"
            />
          </label>
          <label className="block text-[13px] sm:col-span-2">
            {t("observations")}
            <textarea
              value={fields.observations}
              onChange={(e) => setField("observations", e.target.value)}
              disabled={signed}
              rows={3}
              className="mt-1 w-full border border-rule px-2 py-2 text-[14px] disabled:bg-panel-head"
            />
          </label>
          <label className="block text-[13px] sm:col-span-2">
            {t("recommendations")}
            <textarea
              value={fields.recommendations}
              onChange={(e) => setField("recommendations", e.target.value)}
              disabled={signed}
              rows={3}
              className="mt-1 w-full border border-rule px-2 py-2 text-[14px] disabled:bg-panel-head"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPdfMsg(true)}
            className="border border-brand px-4 py-2 text-[13px] font-semibold text-brand hover:bg-brand/5"
          >
            {t("pdf")}
          </button>
          <button
            type="button"
            disabled={signed}
            onClick={() => setSigned(true)}
            className="bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {t("signLock")}
          </button>
        </div>
        {pdfMsg ? <p className="mt-2 text-[13px] text-brand">{t("pdf")}</p> : null}
        {signed ? <p className="mt-2 text-[13px] font-semibold text-edition">{t("signed")}</p> : null}
        <p className="mt-2 text-[12px] text-muted">{t("deadline")}</p>
      </div>
    </div>
  );
}
