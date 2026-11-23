"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader } from "@/components/ui/Loader";

export function DoctorDocumentUpload() {
  const t = useTranslations("doctorDocuments");
  const [patientEmail, setPatientEmail] = useState("patient@demo.pessili.dz");
  const [patientSerial, setPatientSerial] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function resolveSerial() {
    const email = patientEmail.trim().toLowerCase();
    if (!email) return;
    setLookupBusy(true);
    try {
      const res = await fetch(`/api/doctor/patient-serial?email=${encodeURIComponent(email)}`);
      const body = (await res.json()) as { serial?: string };
      if (res.ok && body.serial) setPatientSerial(body.serial);
    } finally {
      setLookupBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const data = new FormData();
      data.set("file", file);
      data.set("patientEmail", patientEmail);
      data.set("patientSerial", patientSerial);
      data.set("title", title || file.name);
      const res = await fetch("/api/doctor/documents/upload", { method: "POST", body: data });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMsg(body.error ?? t("error"));
        return;
      }
      setMsg(t("saved"));
      form.reset();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 text-[14px]">
      <label className="block">
        <span className="font-semibold">{t("patientEmail")}</span>
        <input
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
          onBlur={() => void resolveSerial()}
          required
          className="mt-1 h-11 w-full border border-rule px-3"
        />
      </label>
      <label className="block">
        <span className="font-semibold">{t("patientSerial")}</span>
        <input
          value={patientSerial}
          onChange={(e) => setPatientSerial(e.target.value)}
          placeholder={lookupBusy ? "…" : "PSL-2026-…"}
          className="mt-1 h-11 w-full border border-rule px-3 font-mono uppercase"
          readOnly={lookupBusy}
        />
      </label>
      <label className="block">
        <span className="font-semibold">{t("title")}</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 h-11 w-full border border-rule px-3" />
      </label>
      <label className="block">
        <span className="font-semibold">{t("file")}</span>
        <input name="file" type="file" accept="image/*,application/pdf" required className="mt-1 block w-full text-[13px]" />
      </label>
      {msg ? <p className="text-[13px] text-brand">{msg}</p> : null}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-80">
        {busy && <Loader size={18} className="text-white" />}
        {busy ? t("uploading") : t("upload")}
      </button>
    </form>
  );
}