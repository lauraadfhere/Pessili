"use client";

import { useTranslations } from "next-intl";
import { BrandMark } from "@/components/layout/BrandMark";
import { Loader } from "@/components/ui/Loader";

export function PageLoader() {
  const t = useTranslations();

  return (
    <>
      <div className="bg-chrome md:hidden">
        <div className="flex min-h-[48px] items-center justify-center border-b border-white/15 py-2">
          <BrandMark compact />
        </div>
      </div>
      <div className="hidden min-h-[100px] bg-brand md:block" aria-hidden />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
        <Loader size={56} label={t("loading")} />
        <p className="text-[14px] italic text-muted" aria-hidden>
          {t("loading")}
        </p>
      </div>
    </>
  );
}