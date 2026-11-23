"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, routing, type AppLocale } from "@/i18n/routing";

export function LanguageSwitcher({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const selectClass =
    variant === "light"
      ? "cursor-pointer bg-transparent py-1 text-[13px] font-medium text-text outline-none hover:underline"
      : "cursor-pointer bg-black py-1 text-[13px] font-medium text-white outline-none hover:underline";

  return (
    <label className="flex items-center">
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(event) => router.replace(pathname, { locale: event.target.value as AppLocale })}
        className={selectClass}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}