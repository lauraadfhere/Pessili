"use client";

import type { LogoSettings } from "@/lib/logo-config";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SignOutButton } from "@/components/auth/SignOutButton";

export function AdminHeader({
  logo,
  email,
  roleLabel,
}: {
  logo: LogoSettings;
  email?: string;
  roleLabel: string;
}) {
  return (
    <header className="sticky top-0 z-[60] border-b border-black bg-black text-white lg:border-rule lg:bg-panel-head lg:text-text">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark logo={logo} compact />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold lg:text-text">PeSSiLi Admin</p>
            <p className="truncate text-[11px] text-white/70 lg:text-muted">
              {email} · {roleLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
