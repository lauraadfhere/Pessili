"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader } from "@/components/ui/Loader";

export type MediaDocRow = {
  $id?: string;
  title: string;
  doctorName?: string;
  format?: string;
  resourceType: string;
  createdAt: string;
};

export function SecureMediaDocuments({
  documents,
  defaultCode,
}: {
  documents: MediaDocRow[];
  defaultCode?: string;
}) {
  const t = useTranslations("patientRecords");
  const [code, setCode] = useState(defaultCode ?? "");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function openDoc(docId: string) {
    if (!code.trim()) {
      setError(t("codeRequired"));
      return;
    }
    setBusyId(docId);
    setError("");
    try {
      const res = await fetch("/api/patient/documents/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId, code: code.trim() }),
      });
      const body = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        setError(t(`gate.${body.error ?? "denied"}` as "gate.denied"));
        return;
      }
      window.open(body.url, "_blank", "noopener,noreferrer");
    } catch {
      setError(t("gate.denied"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-muted">{t("cloudHint")}</p>
      <label className="block max-w-md">
        <span className="text-[13px] font-semibold text-text">{t("accessCodeLabel")}</span>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="PSL-2026-…"
          className="mt-1 h-11 w-full border border-rule px-3 font-mono text-[14px] uppercase focus:border-brand"
          autoComplete="off"
        />
        <span className="mt-1 block text-[11px] text-muted">{t("accessCodeHint")}</span>
      </label>
      {error ? <p className="text-[13px] text-new">{error}</p> : null}
      <ul className="divide-y divide-rule border border-rule">
        {documents.length === 0 ? (
          <li className="px-4 py-4 text-[14px] text-muted">{t("cloudEmpty")}</li>
        ) : (
          documents.map((doc) => (
            <li key={doc.$id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[14px] font-semibold text-text">{doc.title}</p>
                <p className="text-[12px] text-muted">
                  {doc.doctorName ? `${doc.doctorName} · ` : ""}
                  {doc.format?.toUpperCase() ?? doc.resourceType} · {formatWhen(doc.createdAt)}
                </p>
              </div>
              <button
                type="button"
                disabled={busyId === doc.$id}
                onClick={() => void openDoc(doc.$id ?? "")}
                className="inline-flex min-w-[120px] items-center justify-center gap-2 bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark disabled:opacity-80"
              >
                {busyId === doc.$id ? <Loader size={16} className="text-white" /> : null}
                {t("viewSecure")}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}