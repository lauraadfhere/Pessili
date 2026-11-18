"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ConsultCta() {
  const t = useTranslations("cta");

  return (
    <Link
      href="/register"
      className="inline-flex h-8 items-center bg-register px-3 text-[13px] font-semibold text-register-text hover:brightness-110"
    >
      {t("consultNow")}
    </Link>
  );
}