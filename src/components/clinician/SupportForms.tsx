"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Kind = "tech" | "safety" | "abuse";

export function SupportForms() {
  const t = useTranslations("clinicianSupport");
  const [kind, setKind] = useState<Kind>("tech");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <form
        className="space-y-4 border border-rule bg-white p-4 sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="flex flex-wrap gap-2">
          {(["tech", "safety", "abuse"] as Kind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`px-3 py-2 text-[13px] font-semibold ${kind === k ? "bg-brand text-white" : "border border-rule"}`}
            >
              {t(k)}
            </button>
          ))}
        </div>
        <label className="block text-[13px]">
          {t("subject")}
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px]"
          />
        </label>
        <label className="block text-[13px]">
          {t("details")}
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
            rows={5}
            className="mt-1 w-full border border-rule px-2 py-2 text-[14px]"
          />
        </label>
        <button type="submit" className="bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
          {t("submit")}
        </button>
        {submitted ? <p className="text-[13px] text-brand">{t("submitted")}</p> : null}
      </form>

      <aside className="border border-rule bg-white p-4">
        <h3 className="text-[15px] font-semibold">{t("help")}</h3>
        <ul className="mt-3 space-y-2 text-[14px]">
          <li className="border-b border-rule pb-2">{t("help1")}</li>
          <li className="border-b border-rule pb-2">{t("help2")}</li>
          <li className="border-b border-rule pb-2">{t("help3")}</li>
        </ul>
        <a href="mailto:support@pessili.dz" className="mt-4 inline-block text-[13px] font-semibold text-brand underline">
          {t("contact")}
        </a>
      </aside>
    </div>
  );
}
