"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/layout/BrandMark";
import { ConsultCta } from "@/components/layout/ConsultCta";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { IconSearch } from "@/components/ui/Icons";
import type { LogoSettings } from "@/lib/logo-config";
import { NAV, type NavKey } from "@/lib/nav";

type HeroProps = {
  title: string;
  search?: { action: string; placeholder: string };
};

export function MergedHeaderHero({
  active,
  logo,
  hero,
  compact = false,
}: {
  active?: NavKey;
  logo?: LogoSettings;
  hero?: HeroProps;
  compact?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const navItems = NAV.filter((item) => item.key !== "home");

  return (
    <div className="sticky top-0 z-[60] hidden bg-brand text-white shadow-[0_2px_12px_rgba(0,60,70,0.35)] md:block">
      <div className="border-b border-white/15">
        <div className="mx-auto flex max-w-[1200px] min-h-[52px] items-stretch justify-between px-3">
          <div className="flex items-center py-2">
            <BrandMark logo={logo} />
          </div>
          <div className="flex items-stretch text-[13px]">
            <div className="flex items-center px-3">
              <ConsultCta />
            </div>
            <div className="flex items-center border-s border-white/15 px-3 [&_select]:text-white">
              <LanguageSwitcher />
            </div>
            <Link href="/login" className="flex items-center border-s border-white/15 px-4 font-medium hover:underline">
              {t("auth.signIn")}
            </Link>
            <div className="flex items-center border-s border-white/15 px-3">
              <Link href="/register" className="flex h-8 items-center bg-white/15 px-3 font-semibold text-white hover:bg-white/25">
                {t("auth.register")}
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t border-white/10 px-3 py-2">
          <nav aria-label={t("nav.label")} className="flex flex-wrap gap-x-6 gap-y-1 text-[15px] font-medium">
            {navItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                aria-current={active === key ? "page" : undefined}
                className={`py-1.5 hover:underline ${active === key ? "underline decoration-2 underline-offset-[10px]" : ""}`}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>
          <form action={`/${locale}/doctors`} className="flex h-[30px]" role="search">
            <label className="sr-only" htmlFor="merged-global-search">
              {t("search.placeholder")}
            </label>
            <input
              id="merged-global-search"
              name="q"
              type="search"
              placeholder={t("search.placeholder")}
              className="w-[200px] bg-[#006a7d] px-2 text-[13px] text-white outline-none placeholder:text-white/80 focus:bg-[#005f70]"
            />
            <button type="submit" className="grid w-[34px] place-items-center bg-[#005566] hover:bg-[#004958]" aria-label={t("search.submit")}>
              <IconSearch className="size-4" />
            </button>
          </form>
        </div>
      </div>

      {!compact && hero?.title ? (
        <div className="relative overflow-hidden border-b border-[#006a7d]">
          <HeroPattern />
          <div className="relative mx-auto flex max-w-[1200px] flex-col gap-5 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="max-w-3xl text-[36px] font-semibold leading-tight tracking-[0.01em] [text-shadow:0_1px_3px_rgba(0,0,0,0.25)] lg:text-[42px]">
              {hero.title}
            </h1>
            {hero.search && (
              <form action={hero.search.action} role="search" className="flex h-[44px] w-full max-w-[520px] shrink-0 items-center bg-white shadow-md">
                <label className="sr-only" htmlFor="merged-hero-search">
                  {hero.search.placeholder}
                </label>
                <input
                  id="merged-hero-search"
                  name="q"
                  type="search"
                  placeholder={hero.search.placeholder}
                  className="h-full flex-1 bg-transparent px-3 text-[15px] text-text outline-none placeholder:italic placeholder:text-[#9a9a9a]"
                />
                <button type="submit" className="grid h-full w-12 place-items-center text-brand hover:bg-panel" aria-label={hero.search.placeholder}>
                  <IconSearch className="size-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HeroPattern() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M-40 230 L230 -40" strokeWidth="70" />
        <path d="M120 230 L330 20 L540 230" strokeWidth="46" />
        <path d="M760 240 L980 20 L1200 240" strokeWidth="64" />
      </g>
    </svg>
  );
}