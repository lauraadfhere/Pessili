"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DEMO_CLINICIAN } from "@/lib/clinician/demo";

export function EarningsPanel() {
  const t = useTranslations("clinicianEarnings");
  const [downloaded, setDownloaded] = useState(false);

  const gross = DEMO_CLINICIAN.monthEarningsDzd;
  const fee = Math.round(gross * 0.15);
  const premium = 6000;
  const net = gross - fee + premium;

  const rows = [
    { label: t("scheduled"), value: "9" },
    { label: t("urgent"), value: "3" },
    { label: t("gross"), value: t("dzd", { amount: gross.toLocaleString() }) },
    { label: t("fee"), value: t("dzd", { amount: fee.toLocaleString() }) },
    { label: t("premium"), value: t("dzd", { amount: premium.toLocaleString() }) },
    { label: t("net"), value: t("dzd", { amount: net.toLocaleString() }) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-[15px] font-semibold">{t("delivered")}</h3>
        <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div key={row.label} className="border border-rule bg-white px-4 py-3">
              <dt className="text-[12px] uppercase tracking-wide text-muted">{row.label}</dt>
              <dd className="mt-1 text-[18px] font-semibold text-text">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border border-rule bg-white p-4">
        <h3 className="text-[15px] font-semibold">{t("schedule")}</h3>
        <p className="mt-2 text-[14px] text-text">{t("scheduleNote")}</p>
        <button
          type="button"
          onClick={() => setDownloaded(true)}
          className="mt-4 bg-brand px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-brand-dark"
        >
          {t("statement")}
        </button>
        {downloaded ? <p className="mt-2 text-[13px] text-brand">{t("statementDone")}</p> : null}
        <p className="mt-3 text-[12px] text-muted">{t("tax")}</p>
      </div>
    </div>
  );
}
