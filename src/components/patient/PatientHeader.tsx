"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { LogoSettings } from "@/lib/logo-config";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { PatientHeaderActions } from "@/components/patient/PatientHeaderActions";
import { PatientHeaderNav } from "@/components/patient/PatientHeaderNav";
import { ProfileQrCompact } from "@/components/patient/ProfileQrCompact";

export type PatientHeaderUser = {
  displayName: string;
  avatarUrl?: string;
  qrToken?: string;
};

function BurgerIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M7 7l10 10M17 7L7 17" />
      </svg>
    );
  }
  return (
    <span className="flex w-[22px] flex-col gap-[5px]" aria-hidden>
      <span className="block h-[2px] w-full rounded-full bg-current" />
      <span className="block h-[2px] w-full rounded-full bg-current" />
      <span className="block h-[2px] w-full rounded-full bg-current" />
    </span>
  );
}

export function PatientHeader({
  logo,
  user,
}: {
  logo: LogoSettings;
  displayName?: string;
  user: PatientHeaderUser;
}) {
  const t = useTranslations("patientNav");
  const tGlobal = useTranslations();
  const resolvedName = user.displayName || "Patient";
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    function onPointer(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[60] border-b border-black bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] lg:border-rule lg:bg-panel-head lg:text-text lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_3px_rgba(0,0,0,0.06)]"
    >
      {/* Mobile — matches public home chrome + bell + avatar */}
      <div className="lg:hidden">
        <div className="grid min-h-[56px] grid-cols-[52px_1fr_auto] items-stretch border-b border-white/15 sm:min-h-[60px]">
          <button
            type="button"
            className="flex touch-manipulation items-center justify-center border-e border-white/20 hover:bg-white/5"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? tGlobal("nav.menuClose") : tGlobal("nav.menuOpen")}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <BurgerIcon open={menuOpen} />
          </button>
          <div className="flex items-center justify-center border-x border-white/20 px-1">
            <BrandMark logo={logo} compact />
          </div>
          <PatientHeaderActions
            user={{ displayName: resolvedName, avatarUrl: user.avatarUrl }}
            layout="mobileChrome"
            theme="dark"
          />
        </div>

        {menuOpen ? (
          <div id={menuId} className="border-b border-white/15 bg-black px-4 py-4">
            <PatientHeaderNav drawer theme="dark" onNavigate={() => setMenuOpen(false)} />
            <div className="mt-4 border-t border-white/10 pt-4">
              <ProfileQrCompact token={user.qrToken} />
            </div>
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              <Link href="/patient/booking" className="block py-2 text-[15px] hover:underline" onClick={() => setMenuOpen(false)}>
                {t("search")}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        ) : null}
      </div>

      {/* Desktop — panel template */}
      <div className="mx-auto hidden max-w-[1200px] lg:block">
        <div className="flex min-h-[62px] items-stretch">
          <div className="flex shrink-0 items-center border-e border-rule bg-panel px-4 py-2">
            <BrandMark logo={logo} tall onLight />
          </div>
          <PatientHeaderNav theme="light" align="end" />
          <PatientHeaderActions
            user={{ displayName: resolvedName, avatarUrl: user.avatarUrl }}
            layout="desktop"
            theme="light"
          />
        </div>
      </div>
    </header>
  );
}