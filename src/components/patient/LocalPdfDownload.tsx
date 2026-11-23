"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function LocalPdfDownload({ docId, defaultCode }: { docId: string; defaultCode?: string }) {
  const t = useTranslations("patientRecords");
  const [code, setCode] = useState(defaultCode ?? "");

  function openPdf() {
    if (!code.trim()) return;
    window.open(`/api/patient/records/pdf?doc=${docId}&code=${encodeURIComponent(code.trim())}`, "_blank", "noopener");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={t("accessCodeShort")}
        className="h-9 w-[9.5rem] border border-rule px-2 font-mono text-[11px] uppercase"
        aria-label={t("accessCodeLabel")}
      />
      <button type="button" onClick={openPdf} className="bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark">
        {t("viewSecure")}
      </button>
    </div>
  );
}