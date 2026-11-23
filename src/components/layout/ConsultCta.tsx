"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ConsultCta() {
  const t = useTranslations("cta");

  return (
    <Link
      href="/register"
      className="inline-flex h-8 items-center bg-white/20 px-3 text-[13px] font-semibold text-white ring-1 ring-white/30 hover:bg-white/30"
    >
      {t("consultNow")}
    </Link>
  );
}