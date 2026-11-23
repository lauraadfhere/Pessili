"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { LogoSettings } from "@/lib/logo-config";
import { NAV, type NavKey } from "@/lib/nav";

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

export function SiteHeader({ logo }: { active?: NavKey; logo?: LogoSettings }) {
  const t = useTranslations();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const navItems = NAV.filter((item) => item.key !== "home");

  return (
    <header ref={headerRef} className="sticky top-0 z-[60] bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] md:hidden">
      <div className="grid min-h-[48px] grid-cols-[52px_1fr_52px] items-stretch border-b border-white/15 md:hidden">
        <button
          type="button"
          className="flex touch-manipulation items-center justify-center border-e border-white/20 hover:bg-white/5"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <BurgerIcon open={menuOpen} />
        </button>
        <div className="flex items-center justify-center border-x border-white/20 px-1">
          <BrandMark logo={logo} compact />
        </div>
        <Link href="/login" className="flex items-center justify-center border-s border-white/20 text-[11px] font-semibold hover:bg-white/5">
          {t("auth.signIn")}
        </Link>
      </div>

      {menuOpen && (
        <div id={menuId} className="border-b border-white/15 bg-black px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2 text-[16px] font-medium">
            {navItems.map(({ key, href }) => (
              <Link key={key} href={href} onClick={() => setMenuOpen(false)} className="py-2 hover:underline">
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-white/10 pt-4">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}