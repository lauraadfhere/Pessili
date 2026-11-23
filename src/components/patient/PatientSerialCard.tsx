"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function PatientSerialCard({ serial }: { serial: string }) {
  const t = useTranslations("patientProfile");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(serial);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border-s-4 border-brand bg-panel px-4 py-4 sm:px-5">
      <p className="text-[12px] font-semibold tracking-wide text-muted uppercase">{t("serialTitle")}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-text">{t("serialHint")}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="bg-white px-3 py-2 font-mono text-[15px] font-semibold tracking-wide text-brand select-all">{serial}</code>
        <button
          type="button"
          onClick={() => void copy()}
          className="bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark"
        >
          {copied ? t("serialCopied") : t("serialCopy")}
        </button>
      </div>
    </div>
  );
}