"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CompactRichTextEditor } from "@/components/patient/CompactRichTextEditor";
import { Loader } from "@/components/ui/Loader";
import { Panel } from "@/components/ui/SectionTitle";

export function CaseSubmitForm() {
  const t = useTranslations("patientCases");
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/patient/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bodyHtml }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? t("submitError"));
        return;
      }
      router.replace("/patient/cases");
      router.refresh();
    } catch {
      setError(t("submitError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel title={t("formTitle")}>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-semibold">{t("caseTitle")}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-11 w-full border border-rule px-3 text-[15px] focus:border-brand"
            placeholder={t("caseTitlePlaceholder")}
          />
        </label>
        <CompactRichTextEditor id="case-body" label={t("caseBody")} placeholder={t("caseBodyPlaceholder")} value={bodyHtml} onChange={setBodyHtml} />
        {error ? <p className="text-[14px] text-new">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="flex h-11 min-w-[180px] items-center justify-center gap-2 bg-brand px-4 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-80"
        >
          {busy && <Loader size={18} className="text-white" />}
          {busy ? t("submitting") : t("submit")}
        </button>
      </form>
    </Panel>
  );
}