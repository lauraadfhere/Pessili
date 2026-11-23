"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function ProfileQrCompact({ token }: { token?: string }) {
  const t = useTranslations("patientProfile");
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch(`/api/patient/qr?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((body: { dataUrl?: string }) => {
        if (!cancelled && body.dataUrl) setDataUrl(body.dataUrl);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) {
    return (
      <p className="text-[13px] text-white/75">
        <Link href="/patient/profile" className="text-white underline">
          {t("qrPending")}
        </Link>
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {dataUrl ? (
        <Image src={dataUrl} alt="" width={88} height={88} className="rounded border border-white/20 bg-white p-1" unoptimized />
      ) : (
        <div className="grid size-[88px] place-items-center rounded border border-white/20 bg-black/30 text-[10px] text-white/70">
          {t("qrLoading")}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-white">{t("qrTitle")}</p>
        <p className="mt-0.5 text-[11px] text-white/75">{t("qrBody")}</p>
        <Link href="/patient/profile#profile-qr" className="mt-1 inline-block text-[11px] text-brand underline">
          {t("qrFull")}
        </Link>
      </div>
    </div>
  );
}