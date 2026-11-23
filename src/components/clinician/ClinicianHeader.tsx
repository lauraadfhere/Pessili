"use client";

import type { LogoSettings } from "@/lib/logo-config";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AvailabilityToggle } from "@/components/clinician/AvailabilityToggle";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function ClinicianHeader({
  logo,
  displayName,
  email,
}: {
  logo: LogoSettings;
  displayName: string;
  email?: string;
}) {
  const t = useTranslations("clinicianNav");

  return (
    <header className="sticky top-0 z-[60] border-b border-black bg-black text-white lg:border-rule lg:bg-panel-head lg:text-text">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark logo={logo} compact />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold lg:text-text">{displayName}</p>
            {email ? <p className="truncate text-[11px] text-white/70 lg:text-muted">{email}</p> : null}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <AvailabilityToggle />
          <LanguageSwitcher />
          <Link href="/crisis" className="hidden text-[12px] font-semibold text-new sm:inline">
            {t("crisisTools")}
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
