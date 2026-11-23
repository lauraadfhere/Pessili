"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_PATIENTS } from "@/lib/clinician/demo";

type Rx = { id: string; patient: string; med: string; status: "active" | "stopped" };

export function PrescriptionsBoard() {
  const t = useTranslations("clinicianPrescriptions");
  const [form, setForm] = useState({
    patientId: DEMO_PATIENTS[0]?.id ?? "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    refills: "0",
  });
  const [history, setHistory] = useState<Rx[]>([]);
  const [issued, setIssued] = useState(false);

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-muted">{t("gateNote")}</p>

      <form
        className="grid gap-3 border border-rule bg-white p-4 sm:grid-cols-2 sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const patient = DEMO_PATIENTS.find((p) => p.id === form.patientId)?.firstName ?? "Patient";
          setHistory((h) => [
            { id: `rx-${Date.now()}`, patient, med: `${form.medication} ${form.dosage}`, status: "active" },
            ...h,
          ]);
          setIssued(true);
        }}
      >
        <label className="block text-[13px] sm:col-span-2">
          Patient
          <select
            value={form.patientId}
            onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
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
          {t("medication")}
          <input
            required
            value={form.medication}
            onChange={(e) => setForm((f) => ({ ...f, medication: e.target.value }))}
            className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px]"
          />
        </label>
        <label className="block text-[13px]">
          {t("dosage")}
          <input
            required
            value={form.dosage}
            onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
            className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px]"
          />
        </label>
        <label className="block text-[13px]">
          {t("frequency")}
          <input
            required
            value={form.frequency}
            onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
            className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px]"
          />
        </label>
        <label className="block text-[13px]">
          {t("duration")}
          <input
            required
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px]"
          />
        </label>
        <label className="block text-[13px] sm:col-span-2">
          {t("instructions")}
          <textarea
            value={form.instructions}
            onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
            rows={3}
            className="mt-1 w-full border border-rule px-2 py-2 text-[14px]"
          />
        </label>
        <label className="block text-[13px]">
          {t("refills")}
          <input
            type="number"
            min={0}
            value={form.refills}
            onChange={(e) => setForm((f) => ({ ...f, refills: e.target.value }))}
            className="mt-1 min-h-10 w-full border border-rule px-2 text-[14px]"
          />
        </label>

        <div className="sm:col-span-2 border border-promo-accent/30 bg-panel-head/50 p-3 text-[13px] text-muted">
          <p className="font-semibold text-text">{t("allergy")}</p>
          <p className="mt-1">{t("allergyNote")}</p>
        </div>

        <button type="submit" className="bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark sm:col-span-2 sm:w-fit">
          {t("sign")}
        </button>
        {issued ? <p className="text-[13px] text-brand sm:col-span-2">{t("issued")}</p> : null}
      </form>

      <section>
        <h3 className="mb-3 text-[15px] font-semibold">{t("history")}</h3>
        {history.length === 0 ? (
          <p className="text-[14px] text-muted">{t("historyEmpty")}</p>
        ) : (
          <ul className="divide-y divide-rule border border-rule bg-white">
            {history.map((rx) => (
              <li key={rx.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[14px]">
                <span>
                  {rx.patient} · {rx.med}
                </span>
                <div className="flex items-center gap-2">
                  <StatusPill label={rx.status} tone={rx.status === "active" ? "ok" : "neutral"} />
                  <button
                    type="button"
                    onClick={() => setHistory((h) => h.map((x) => (x.id === rx.id ? { ...x, status: "stopped" } : x)))}
                    className="text-[12px] font-semibold text-new underline"
                  >
                    {t("discontinue")}
                  </button>
                  <button type="button" className="text-[12px] font-semibold text-brand underline">
                    {t("renew")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
