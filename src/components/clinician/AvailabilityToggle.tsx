"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { AvailabilityStatus } from "@/lib/clinician/demo";

const states: AvailabilityStatus[] = ["available", "busy", "offline"];

type Props = {
  /** Controlled value from parent (e.g. layout header). */
  value?: AvailabilityStatus;
  onChange?: (status: AvailabilityStatus) => void;
  compact?: boolean;
};

export function AvailabilityToggle({ value, onChange, compact }: Props) {
  const t = useTranslations("clinicianNav");
  const [status, setStatus] = useState<AvailabilityStatus>(value ?? "available");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) setStatus(value);
  }, [value]);

  const persist = useCallback(
    async (next: AvailabilityStatus) => {
      setStatus(next);
      onChange?.(next);
      setSaving(true);
      setError(null);
      try {
        const res = await fetch("/api/clinician/status", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(data?.error || "Failed");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      } finally {
        setSaving(false);
      }
    },
    [onChange],
  );

  return (
    <label className="flex items-center gap-2 text-[12px]">
      {!compact ? <span className="hidden font-medium text-muted sm:inline">{t("availableNow")}</span> : null}
      <select
        value={status}
        disabled={saving}
        onChange={(e) => void persist(e.target.value as AvailabilityStatus)}
        className="min-h-9 rounded-md border border-rule bg-white px-2 text-[12px] text-text disabled:opacity-60"
        aria-label={t("availableNow")}
        aria-busy={saving}
      >
        {states.map((s) => (
          <option key={s} value={s}>
            {t(`status.${s}`)}
          </option>
        ))}
      </select>
      {error ? <span className="sr-only">{error}</span> : null}
    </label>
  );
}
