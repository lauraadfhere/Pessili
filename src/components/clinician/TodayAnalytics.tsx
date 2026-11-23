"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Panel } from "@/components/ui/SectionTitle";
import { EarningsSparkline, FormatDonut, SessionsBarChart } from "@/components/clinician/ClinicianCharts";

type AnalyticsPayload = {
  week: { label: string; sessions: number; urgent: number; earnings: number }[];
  formatMix: { format: string; count: number }[];
  totals: {
    weekSessions: number;
    acceptanceRate: number;
    avgResponseSec: number;
    monthEarningsDzd: number;
    rating: number;
  };
};

export function TodayAnalytics() {
  const t = useTranslations("clinicianAnalytics");
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/clinician/analytics");
        if (!res.ok) throw new Error("Failed to load analytics");
        const json = (await res.json()) as { analytics: AnalyticsPayload };
        if (!cancelled) setData(json.analytics);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <Panel title={t("title")}>
        <p className="text-[14px] text-new">{error}</p>
      </Panel>
    );
  }

  if (!data) {
    return (
      <Panel title={t("title")}>
        <p className="text-[14px] text-muted">{t("loading")}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("weekSessions")} value={String(data.totals.weekSessions)} />
        <StatCard label={t("acceptanceRate")} value={`${data.totals.acceptanceRate}%`} />
        <StatCard label={t("responseTime")} value={`${data.totals.avgResponseSec} s`} />
        <StatCard label={t("monthEarnings")} value={`${data.totals.monthEarningsDzd.toLocaleString()} DZD`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t("sessionsChart")}>
          <SessionsBarChart
            data={data.week}
            title={t("sessionsChartHint")}
            sessionsLabel={t("legendSessions")}
            urgentLabel={t("legendUrgent")}
          />
        </Panel>
        <Panel title={t("formatChart")}>
          <FormatDonut
            data={data.formatMix}
            title={t("formatChartHint")}
            labels={{ video: t("video"), audio: t("audio"), chat: t("chat") }}
          />
        </Panel>
      </div>

      <Panel title={t("earningsChart")}>
        <EarningsSparkline data={data.week} title={t("earningsChartHint")} totalLabel={t("weekEarnings")} />
      </Panel>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-rule bg-white px-4 py-3.5">
      <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 text-[22px] font-semibold tabular-nums text-text">{value}</p>
    </div>
  );
}
