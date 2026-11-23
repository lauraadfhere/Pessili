"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function QuickLoginQr({ initialToken }: { initialToken?: string }) {
  const t = useTranslations("patientProfile");
  const [token, setToken] = useState(initialToken ?? "");
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ token?: string }>).detail;
      if (detail?.token) setToken(detail.token);
    };
    window.addEventListener("pessili-profile-updated", handler);
    return () => window.removeEventListener("pessili-profile-updated", handler);
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch(`/api/patient/qr?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((body: { dataUrl?: string }) => {
        if (!cancelled && body.dataUrl) setDataUrl(body.dataUrl);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) {
    return <p className="text-[13px] text-muted">{t("qrPending")}</p>;
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      {dataUrl ? (
        <Image src={dataUrl} alt="" width={160} height={160} className="rounded-lg border border-rule bg-white p-2" unoptimized />
      ) : (
        <div className="grid size-40 place-items-center rounded-lg border border-rule bg-panel text-[12px] text-muted">{t("qrLoading")}</div>
      )}
      <div className="max-w-sm text-[12px] leading-relaxed text-muted">
        <p className="font-semibold text-text">{t("qrTitle")}</p>
        <p className="mt-1">{t("qrBody")}</p>
        <p className="mt-2 break-all font-mono text-[10px] opacity-70">{token.slice(0, 16)}…</p>
      </div>
    </div>
  );
}