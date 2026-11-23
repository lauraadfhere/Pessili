"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Loader } from "@/components/ui/Loader";
import { Client } from "appwrite";
import { Panel } from "@/components/ui/SectionTitle";

type CaseRow = {
  $id: string;
  title: string;
  status: string;
  statusNote?: string;
  updatedAt?: string;
  createdAt?: string;
};

const POLL_MS = 4000;

const statusColor: Record<string, string> = {
  submitted: "bg-panel-head text-text",
  triage: "bg-[#e8f4f7] text-brand",
  assigned: "bg-[#e8f4f7] text-brand",
  in_consultation: "bg-[#fff8e6] text-[#8a6d00]",
  report_ready: "bg-[#e8f8ec] text-[#1a6b2e]",
  closed: "bg-panel text-muted",
};

export function CaseTracker() {
  const t = useTranslations("patientCases");
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncedAt, setSyncedAt] = useState("");
  const [live, setLive] = useState(false);

  const fetchCases = useCallback(async () => {
    try {
      const res = await fetch("/api/patient/cases");
      const body = (await res.json()) as { cases?: CaseRow[]; syncedAt?: string };
      if (res.ok && body.cases) {
        setCases(body.cases);
        setSyncedAt(body.syncedAt ?? new Date().toISOString());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCases();
    const poll = window.setInterval(() => void fetchCases(), POLL_MS);
    return () => window.clearInterval(poll);
  }, [fetchCases]);

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    if (!endpoint || !project || !databaseId) return;

    const client = new Client().setEndpoint(endpoint).setProject(project);
    const channel = `databases.${databaseId}.tables.patient_cases.rows`;
    try {
      const unsub = client.subscribe(channel, () => void fetchCases());
      setLive(true);
      return () => unsub();
    } catch {
      return undefined;
    }
  }, [fetchCases]);

  return (
    <Panel title={t("trackerTitle")}>
      <TrackerBody loading={loading} cases={cases} syncedAt={syncedAt} live={live} t={t} />
    </Panel>
  );
}

function TrackerBody({
  loading,
  cases,
  syncedAt,
  live,
  t,
}: {
  loading: boolean;
  cases: CaseRow[];
  syncedAt: string;
  live: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader size={40} label={t("loading")} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted">
        <span>
          {live ? t("liveOn") : t("livePoll")} · {t("lastSync")} {formatWhen(syncedAt)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${live ? "animate-pulse bg-brand" : "bg-muted"}`} aria-hidden />
          {t("tracking")}
        </span>
      </div>

      {cases.length === 0 ? (
        <p className="border-s-4 border-brand bg-panel px-4 py-3 text-[14px]">{t("empty")}</p>
      ) : (
        <ul className="divide-y divide-rule border border-rule bg-white">
          {cases.map((c) => (
            <li key={c.$id} className="px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-[15px] font-semibold">{c.title}</h3>
                  <p className="mt-1 text-[12px] text-muted">
                    {t("updated")} {formatWhen(c.updatedAt ?? c.createdAt)}
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase ${statusColor[c.status] ?? statusColor.submitted}`}>
                  {t(`status.${c.status}` as "status.submitted")}
                </span>
              </div>
              {c.statusNote ? <p className="mt-2 text-[13px] text-muted">{c.statusNote}</p> : null}
              <CaseTimeline status={c.status} t={t} />
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-rule pt-3 text-end">
        <Link href="/patient/cases/new" className="text-[14px] font-semibold text-link hover:underline">
          {t("newCase")}
        </Link>
      </div>
    </div>
  );
}

function CaseTimeline({ status, t }: { status: string; t: ReturnType<typeof useTranslations> }) {
  const steps = ["submitted", "triage", "assigned", "in_consultation", "report_ready", "closed"];
  const idx = Math.max(0, steps.indexOf(status));
  return (
    <ol className="mt-3 flex gap-1" aria-label={t("timeline")}>
      {steps.map((step, i) => (
        <li key={step} className={`h-1.5 flex-1 ${i <= idx ? "bg-brand" : "bg-rule"}`} title={t(`status.${step}` as "status.submitted")} />
      ))}
    </ol>
  );
}

function formatWhen(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}