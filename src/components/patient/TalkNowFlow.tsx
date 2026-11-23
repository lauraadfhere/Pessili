"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Panel } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/workspace/StatusPill";

type Step = "triage" | "waiting" | "unmatched";

const WILAYAS = [
  { code: "16", name: "Alger" },
  { code: "31", name: "Oran" },
  { code: "09", name: "Blida" },
  { code: "19", name: "Sétif" },
  { code: "25", name: "Constantine" },
  { code: "06", name: "Béjaïa" },
];

const SAFETY_KEYS = ["safetyQ1", "safetyQ2", "safetyQ3"] as const;

export function TalkNowFlow() {
  const t = useTranslations("patientTalkNow");
  const [step, setStep] = useState<Step>("triage");
  const [wilaya, setWilaya] = useState("16");
  const [phone, setPhone] = useState("+213 ");
  const [phoneOk, setPhoneOk] = useState(true);
  const [safety, setSafety] = useState<Record<(typeof SAFETY_KEYS)[number], "yes" | "no" | "">>({
    safetyQ1: "",
    safetyQ2: "",
    safetyQ3: "",
  });
  const [language, setLanguage] = useState<"ar" | "fr" | "en">("ar");
  const [format, setFormat] = useState<"video" | "audio" | "chat">("audio");
  const [waitSeconds, setWaitSeconds] = useState(0);
  const waitTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (waitTimer.current != null) window.clearInterval(waitTimer.current);
    };
  }, []);

  const riskPositive = useMemo(
    () => SAFETY_KEYS.some((k) => safety[k] === "yes"),
    [safety],
  );

  const triageComplete =
    wilaya &&
    phone.trim().length >= 8 &&
    phoneOk &&
    SAFETY_KEYS.every((k) => safety[k] === "yes" || safety[k] === "no") &&
    language &&
    format;

  function clearWaitTimer() {
    if (waitTimer.current != null) {
      window.clearInterval(waitTimer.current);
      waitTimer.current = null;
    }
  }

  function startWaiting() {
    if (!triageComplete) return;
    clearWaitTimer();
    setStep("waiting");
    setWaitSeconds(0);
    const started = Date.now();
    waitTimer.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      setWaitSeconds(elapsed);
      if (elapsed >= 45) {
        clearWaitTimer();
        setStep("unmatched");
      }
    }, 1000);
  }

  function goUnmatched() {
    clearWaitTimer();
    setStep("unmatched");
  }

  function goTriage() {
    clearWaitTimer();
    setStep("triage");
  }

  if (step === "waiting") {
    return (
      <div className="space-y-4">
        <Panel title={t("waiting.title")}>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill label={t("waiting.statusSearching")} tone="brand" />
            <span className="text-[13px] text-muted">{t("waiting.estimate")}</span>
          </div>
          <p className="mt-3 text-[14px] text-text">{t("waiting.elapsed", { seconds: waitSeconds })}</p>
          <div className="mt-4 border border-rule bg-white px-4 py-3">
            <p className="text-[13px] font-semibold text-text">{t("waiting.breathTitle")}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">{t("waiting.breathTip")}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={goUnmatched}
              className="min-h-11 border border-rule bg-white px-4 text-[14px] font-medium text-text hover:border-brand"
            >
              {t("waiting.callback")}
            </button>
            <Link
              href="/patient/booking"
              className="inline-flex min-h-11 items-center border border-rule bg-white px-4 text-[14px] font-medium text-text hover:border-brand"
            >
              {t("waiting.earliest")}
            </Link>
            <button
              type="button"
              onClick={goTriage}
              className="min-h-11 px-4 text-[14px] text-muted underline hover:text-text"
            >
              {t("waiting.cancel")}
            </button>
            <Link
              href="/crisis"
              className="inline-flex min-h-11 items-center bg-new px-4 text-[14px] font-semibold text-white hover:opacity-90"
            >
              {t("waiting.crisis")}
            </Link>
          </div>
          {riskPositive ? (
            <p className="mt-4 border-s-4 border-new bg-white px-3 py-2 text-[13px] text-text">{t("waiting.riskNote")}</p>
          ) : null}
        </Panel>
      </div>
    );
  }

  if (step === "unmatched") {
    return (
      <div className="space-y-4">
        <Panel title={t("unmatched.title")}>
          <p className="text-[14px] leading-relaxed text-muted">{t("unmatched.body")}</p>
          <ul className="mt-4 space-y-3">
            <li className="border border-rule bg-white px-4 py-3">
              <p className="text-[14px] font-semibold text-text">{t("unmatched.callbackTitle")}</p>
              <p className="mt-1 text-[13px] text-muted">{t("unmatched.callbackBody")}</p>
              <button
                type="button"
                className="mt-3 min-h-10 bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-dark"
                onClick={() => alert(t("unmatched.callbackConfirm"))}
              >
                {t("unmatched.callbackCta")}
              </button>
            </li>
            <li className="border border-rule bg-white px-4 py-3">
              <p className="text-[14px] font-semibold text-text">{t("unmatched.slotTitle")}</p>
              <p className="mt-1 text-[13px] text-muted">{t("unmatched.slotBody")}</p>
              <Link
                href="/patient/booking"
                className="mt-3 inline-flex min-h-10 items-center bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-dark"
              >
                {t("unmatched.slotCta")}
              </Link>
            </li>
            <li className="border border-rule bg-white px-4 py-3">
              <p className="text-[14px] font-semibold text-text">{t("unmatched.crisisTitle")}</p>
              <p className="mt-1 text-[13px] text-muted">{t("unmatched.crisisBody")}</p>
              <Link
                href="/crisis"
                className="mt-3 inline-flex min-h-10 items-center bg-new px-4 text-[13px] font-semibold text-white hover:opacity-90"
              >
                {t("unmatched.crisisCta")}
              </Link>
            </li>
          </ul>
          <button
            type="button"
            onClick={goTriage}
            className="mt-4 text-[14px] text-link underline hover:text-link-hover"
          >
            {t("unmatched.retry")}
          </button>
        </Panel>
      </div>
    );
  }

  return (
    <Panel title={t("triage.title")}>
      <p className="mb-4 text-[14px] text-muted">{t("triage.intro")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[14px]">
          <span className="mb-1.5 block font-semibold text-text">{t("triage.wilaya")}</span>
          <select
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            className="min-h-11 w-full border border-rule bg-white px-3 text-[14px] focus:border-brand"
          >
            {WILAYAS.map((w) => (
              <option key={w.code} value={w.code}>
                {w.code} — {w.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          <label className="block text-[14px]">
            <span className="mb-1.5 block font-semibold text-text">{t("triage.phone")}</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="min-h-11 w-full border border-rule bg-white px-3 text-[14px] focus:border-brand"
            />
          </label>
          <label className="mt-2 flex items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" checked={phoneOk} onChange={(e) => setPhoneOk(e.target.checked)} />
            {t("triage.phoneConfirm")}
          </label>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-[14px] font-semibold text-text">{t("triage.safetyTitle")}</p>
        {SAFETY_KEYS.map((key) => (
          <fieldset key={key} className="border border-rule bg-white px-3 py-3">
            <legend className="px-1 text-[13px] font-medium text-text">{t(`triage.${key}`)}</legend>
            <div className="mt-1 flex gap-4 text-[14px]">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={key}
                  checked={safety[key] === "no"}
                  onChange={() => setSafety((s) => ({ ...s, [key]: "no" }))}
                />
                {t("triage.no")}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={key}
                  checked={safety[key] === "yes"}
                  onChange={() => setSafety((s) => ({ ...s, [key]: "yes" }))}
                />
                {t("triage.yes")}
              </label>
            </div>
          </fieldset>
        ))}
        {riskPositive ? (
          <p className="border-s-4 border-new bg-panel px-3 py-2 text-[13px] text-text">
            {t("triage.riskHint")}{" "}
            <Link href="/crisis" className="font-semibold text-link underline">
              {t("triage.crisisLink")}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-[14px]">
          <span className="mb-1.5 block font-semibold text-text">{t("triage.language")}</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="min-h-11 w-full border border-rule bg-white px-3 text-[14px] focus:border-brand"
          >
            <option value="ar">{t("triage.langAr")}</option>
            <option value="fr">{t("triage.langFr")}</option>
            <option value="en">{t("triage.langEn")}</option>
          </select>
        </label>
        <label className="block text-[14px]">
          <span className="mb-1.5 block font-semibold text-text">{t("triage.format")}</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as typeof format)}
            className="min-h-11 w-full border border-rule bg-white px-3 text-[14px] focus:border-brand"
          >
            <option value="video">{t("triage.formatVideo")}</option>
            <option value="audio">{t("triage.formatAudio")}</option>
            <option value="chat">{t("triage.formatChat")}</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        disabled={!triageComplete}
        onClick={startWaiting}
        className="mt-6 min-h-11 bg-brand px-6 text-[14px] font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {t("triage.submit")}
      </button>
    </Panel>
  );
}
