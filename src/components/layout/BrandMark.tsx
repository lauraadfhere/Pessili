/* eslint-disable @next/next/no-img-element */
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { LogoSettings } from "@/lib/logo-config";
import { DEFAULT_LOGO_SETTINGS } from "@/lib/logo-config";

export function BrandMark({
  logo = DEFAULT_LOGO_SETTINGS,
  compact = false,
  tall = false,
  onLight = false,
}: {
  logo?: LogoSettings;
  compact?: boolean;
  tall?: boolean;
  onLight?: boolean;
}) {
  const t = useTranslations("brand");

  return (
    <Link href="/" className={`flex items-center ${onLight ? "text-brand" : "text-white"}`} aria-label={t("home")}>
      <img
        src={logo.headerUrl}
        alt="PeSSiLi"
        className={`h-auto w-auto object-contain ${tall ? "max-h-11 md:max-h-[52px]" : compact ? "max-h-8" : "max-h-10"}`}
        style={{ width: logo.headerWidth }}
      />
    </Link>
  );
}