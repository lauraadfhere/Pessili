"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Panel } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/workspace/StatusPill";
import {
  bandForTool,
  hasRiskFlag,
  questionMessageKey,
  scoreAnswers,
  SCREENING_TOOLS,
  type ScreeningToolId,
} from "@/lib/patient/screening";

type Props = {
  tool: ScreeningToolId;
};

type Phase = "questions" | "risk" | "result";

const LIKERT = [0, 1, 2, 3] as const;

export function ScreeningTool({ tool }: Props) {
  const t = useTranslations("patientScreening");
  const def = SCREENING_TOOLS[tool];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(def.questionCount).fill(-1));
  const [phase, setPhase] = useState<Phase>("questions");

  const progress = Math.round(((index + (answers[index] >= 0 ? 1 : 0)) / def.questionCount) * 100);
  const score = useMemo(() => scoreAnswers(answers.map((a) => (a < 0 ? 0 : a))), [answers]);
  const band = bandForTool(tool, score);
  const risk = hasRiskFlag(tool, answers);

  function choose(value: number) {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);

    if (index < def.questionCount - 1) {
      setIndex(index + 1);
      return;
    }

    if (hasRiskFlag(tool, next)) {
      setPhase("risk");
    } else {
      setPhase("result");
    }
  }

  function goBack() {
    if (index > 0) setIndex(index - 1);
  }

  if (phase === "risk") {
    return (
      <Panel title={t("risk.title")}>
        <p className="text-[14px] leading-relaxed text-text">{t("risk.body")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/crisis"
            className="inline-flex min-h-11 items-center bg-new px-5 text-[14px] font-semibold text-white hover:opacity-90"
          >
            {t("risk.crisisCta")}
          </Link>
          <Link
            href="/patient/talk-now"
            className="inline-flex min-h-11 items-center bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark"
          >
            {t("risk.talkNow")}
          </Link>
          <button
            type="button"
            onClick={() => setPhase("result")}
            className="min-h-11 border border-rule bg-white px-4 text-[14px] font-medium text-text hover:border-brand"
          >
            {t("risk.continueScore")}
          </button>
        </div>
      </Panel>
    );
  }

  if (phase === "result") {
    return (
      <Panel title={t("result.title")}>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[28px] font-semibold text-brand">
            {t("result.score", { score, max: def.questionCount * def.maxPerItem })}
          </p>
          <StatusPill label={t(`bands.${band}`)} tone={band === "minimal" || band === "mild" ? "ok" : band === "moderate" ? "warn" : "danger"} />
        </div>
        <p className="mt-2 text-[13px] text-muted">{t("result.disclaimer")}</p>
        <p className="mt-4 text-[14px] leading-relaxed text-text">{t(`guidance.${band}`)}</p>
        {risk ? (
          <p className="mt-3 border-s-4 border-new bg-white px-3 py-2 text-[13px] text-text">{t("result.riskNote")}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/patient/booking"
            className="inline-flex min-h-11 items-center bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark"
          >
            {t("result.book")}
          </Link>
          <Link
            href="/patient/talk-now"
            className="inline-flex min-h-11 items-center border border-brand px-5 text-[14px] font-semibold text-brand hover:bg-brand/5"
          >
            {t("result.talkNow")}
          </Link>
          <button
            type="button"
            onClick={() => {
              setAnswers(Array(def.questionCount).fill(-1));
              setIndex(0);
              setPhase("questions");
            }}
            className="min-h-11 px-4 text-[14px] text-muted underline hover:text-text"
          >
            {t("result.retake")}
          </button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title={t(`tools.${tool}.name`)}>
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 text-[12px] text-muted">
          <span>{t("progress", { current: index + 1, total: def.questionCount })}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden bg-panel-head">
          <div className="h-full bg-brand transition-all" style={{ width: `${Math.max(progress, 4)}%` }} />
        </div>
      </div>
      <p className="text-[15px] font-medium leading-relaxed text-text">{t(questionMessageKey(tool, index))}</p>
      <p className="mt-2 text-[12px] text-muted">{t("likertHint")}</p>
      <div className="mt-4 grid gap-2">
        {LIKERT.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => choose(value)}
            className="min-h-11 border border-rule bg-white px-4 text-start text-[14px] text-text hover:border-brand hover:bg-[#f0f9fb]"
          >
            <span className="font-semibold text-brand">{value}</span>
            <span className="ms-2">{t(`likert.${value}`)}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={index === 0}
          onClick={goBack}
          className="min-h-10 px-3 text-[13px] text-muted underline disabled:opacity-40"
        >
          {t("back")}
        </button>
        <Link href="/patient/screening" className="min-h-10 px-3 text-[13px] text-link underline hover:text-link-hover">
          {t("saveResume")}
        </Link>
      </div>
    </Panel>
  );
}
