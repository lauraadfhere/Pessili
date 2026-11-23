"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DemoToast } from "./DemoToast";
import { btnPrimary, inputClass } from "./adminUi";

export function EligibilityUpload() {
  const t = useTranslations("adminPartnerships");
  const [toast, setToast] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-muted">{t("uploadHint")}</p>
      <div className="flex flex-wrap items-center gap-2">
        <label className={`${btnPrimary} cursor-pointer`}>
          {t("chooseFile")}
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFileName(file?.name ?? null);
            }}
          />
        </label>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => {
            const count = fileName ? 24 : 0;
            setToast(t("uploadToast", { count: count || 12 }));
            window.setTimeout(() => setToast(null), 2800);
          }}
        >
          {t("upload")}
        </button>
        {fileName ? <span className="text-[13px] text-muted">{fileName}</span> : null}
      </div>
      <input className={inputClass} readOnly value="name,id,email" aria-hidden />
      <DemoToast message={toast} />
    </div>
  );
}
