"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";

export function FollowUpBoard() {
  const t = useTranslations("clinicianFollowUp");
  const [homework, setHomework] = useState([t("homework1")]);
  const [draft, setDraft] = useState("");
  const [contacted, setContacted] = useState(false);
  const [reminder, setReminder] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="border border-rule bg-white p-4">
        <h3 className="text-[15px] font-semibold">{t("goals")}</h3>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-[14px] text-text">
          <li>{t("goal1")}</li>
          <li>{t("goal2")}</li>
        </ul>
        <p className="mt-4 text-[12px] uppercase tracking-wide text-muted">{t("nextReview")}</p>
        <p className="text-[14px] font-semibold text-text">{t("nextReviewDate")}</p>
      </section>

      <section className="border border-rule bg-white p-4">
        <h3 className="text-[15px] font-semibold">{t("homework")}</h3>
        <ul className="mt-3 space-y-2 text-[14px]">
          {homework.map((item) => (
            <li key={item} className="border border-rule px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-10 flex-1 border border-rule px-2 text-[13px]"
            placeholder={t("addHomework")}
          />
          <button
            type="button"
            onClick={() => {
              if (!draft.trim()) return;
              setHomework((h) => [...h, draft.trim()]);
              setDraft("");
            }}
            className="bg-brand px-3 py-2 text-[13px] font-semibold text-white"
          >
            {t("addHomework")}
          </button>
        </div>
      </section>

      <section className="border border-rule bg-white p-4">
        <h3 className="text-[15px] font-semibold">{t("rescreen")}</h3>
        <p className="mt-2 text-[14px] text-text">{t("rescreenNote")}</p>
        <p className="mt-4 text-[12px] uppercase tracking-wide text-muted">{t("trend")}</p>
        <div className="mt-2 flex h-16 items-end gap-2">
          {[16, 12, 10].map((v) => (
            <div key={v} className="flex-1 bg-brand/80" style={{ height: `${v * 4}px` }} title={String(v)} />
          ))}
        </div>
        <p className="mt-2 text-[13px] text-muted">{t("trendNote")}</p>
      </section>

      <section className="border border-rule bg-white p-4">
        <h3 className="text-[15px] font-semibold">{t("missed")}</h3>
        <p className="mt-2 text-[14px] text-text">{t("missedNote")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setReminder(true)}
            className="border border-brand px-3 py-2 text-[13px] font-semibold text-brand"
          >
            {t("sendReminder")}
          </button>
          <button
            type="button"
            onClick={() => setContacted(true)}
            className="bg-brand px-3 py-2 text-[13px] font-semibold text-white"
          >
            {t("markContacted")}
          </button>
        </div>
        {reminder ? <p className="mt-2 text-[13px] text-brand">{t("sendReminder")} ✓</p> : null}
        {contacted ? <div className="mt-2"><StatusPill label={t("markContacted")} tone="ok" /></div> : null}
      </section>
    </div>
  );
}
