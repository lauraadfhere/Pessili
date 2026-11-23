"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function DoctorMarkForm() {
  const t = useTranslations("doctorMarks");
  const [patientEmail, setPatientEmail] = useState("patient@demo.pessili.dz");
  const [patientSerial, setPatientSerial] = useState("");
  const [score, setScore] = useState(7);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/doctor/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientEmail, patientSerial: patientSerial || undefined, score, note }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMsg(body.error ?? t("error"));
        return;
      }
      setMsg(t("saved"));
      setNote("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-[14px]">
      <label className="block">
        <span className="font-semibold">{t("patientEmail")}</span>
        <input value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} required className="mt-1 h-11 w-full border border-rule px-3" />
      </label>
      <label className="block">
        <span className="font-semibold">{t("patientSerial")}</span>
        <input value={patientSerial} onChange={(e) => setPatientSerial(e.target.value)} placeholder="PSL-2026-…" className="mt-1 h-11 w-full border border-rule px-3" />
      </label>
      <label className="block">
        <span className="font-semibold">{t("score", { max: 10 })}</span>
        <input type="range" min={1} max={10} value={score} onChange={(e) => setScore(Number(e.target.value))} className="mt-2 w-full" />
        <span className="text-muted">{score}/10</span>
      </label>
      <label className="block">
        <span className="font-semibold">{t("note")}</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} required rows={3} className="mt-1 w-full border border-rule px-3 py-2" />
      </label>
      {msg ? <p className="text-[13px] text-brand">{msg}</p> : null}
      <button type="submit" disabled={busy} className="bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-80">
        {busy ? t("saving") : t("submit")}
      </button>
    </form>
  );
}