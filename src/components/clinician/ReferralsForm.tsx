"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DEMO_PATIENTS } from "@/lib/clinician/demo";

export function ReferralsForm() {
  const t = useTranslations("clinicianReferrals");
  const [type, setType] = useState<"psychiatrist" | "external">("psychiatrist");
  const [patientId, setPatientId] = useState(DEMO_PATIENTS[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [share, setShare] = useState({ intake: true, screening: true, notes: false });
  const [sent, setSent] = useState(false);

  return (
    <form
      className="max-w-2xl space-y-4 border border-rule bg-white p-4 sm:p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <fieldset>
        <legend className="text-[12px] font-semibold uppercase text-muted">{t("type")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setType("psychiatrist")}
            className={`px-3 py-2 text-[13px] font-semibold ${type === "psychiatrist" ? "bg-brand text-white" : "border border-rule"}`}
          >
            {t("psychiatrist")}
          </button>
          <button
            type="button"
            onClick={() => setType("external")}
            className={`px-3 py-2 text-[13px] font-semibold ${type === "external" ? "bg-brand text-white" : "border border-rule"}`}
          >
            {t("external")}
          </button>
        </div>
      </fieldset>

      <label className="block text-[13px]">
        {t("patient")}
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px]"
        >
          {DEMO_PATIENTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-[13px]">
        {t("reason")}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={4}
          className="mt-1 w-full border border-rule px-2 py-2 text-[14px]"
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold uppercase text-muted">{t("consent")}</legend>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={share.intake} onChange={(e) => setShare((s) => ({ ...s, intake: e.target.checked }))} />
          {t("shareIntake")}
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={share.screening}
            onChange={(e) => setShare((s) => ({ ...s, screening: e.target.checked }))}
          />
          {t("shareScreening")}
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={share.notes} onChange={(e) => setShare((s) => ({ ...s, notes: e.target.checked }))} />
          {t("shareNotes")}
        </label>
        <p className="text-[12px] text-muted">{t("sharePrivate")}</p>
      </fieldset>

      <button type="submit" className="bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
        {t("submit")}
      </button>
      {sent ? <p className="text-[13px] text-brand">{t("sent")}</p> : null}
    </form>
  );
}
