/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { LogoSettings } from "@/lib/logo-config";
import { DEFAULT_LOGO_SETTINGS } from "@/lib/logo-config";
import { NAV } from "@/lib/nav";
import { CONTACT_EMAIL } from "@/lib/site";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { IconMail } from "@/components/ui/Icons";

export function SiteFooter({ logo = DEFAULT_LOGO_SETTINGS }: { logo?: LogoSettings }) {
  const t = useTranslations();
  const navItems = NAV.filter((item) => item.key !== "home");

  return (
    <footer className="relative mt-auto overflow-hidden bg-chrome text-white">
      <div className="relative mx-auto grid max-w-[1200px] gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <Link href="/" aria-label={t("brand.home")}>
            <img src={logo.footerUrl} alt="PeSSiLi" className="h-auto max-h-11 w-auto object-contain" style={{ width: logo.footerWidth }} />
          </Link>
          <p className="mt-4 text-[12px] leading-relaxed text-white/75">{t("footer.brandBlurb")}</p>
        </div>
        <FooterNavList title={t("footer.explore")} navItems={navItems} t={t} />
        <FooterContact t={t} />
      </div>
      <div className="border-t border-footer-line px-6 py-4 text-center text-[11px] text-white/60">
        © {new Date().getFullYear()} PeSSiLi — {t("footer.rights")}
      </div>
    </footer>
  );
}

function FooterNavList({ title, navItems, t }: { title: string; navItems: typeof NAV; t: ReturnType<typeof useTranslations> }) {
  return (
    <div>
      <h2 className="mb-3 text-[13px] font-bold">{title}</h2>
      <ul className="space-y-1.5 text-[13px]">
        {navItems.map(({ key, href }) => (
          <li key={key}>
            <Link href={href} className="text-white/85 hover:text-white hover:underline">
              {t(`nav.${key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContact({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div>
      <h2 className="mb-3 text-[13px] font-bold">{t("footer.contact")}</h2>
      <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 text-[13px] text-white/85 hover:text-white hover:underline">
        <IconMail className="size-4" />
        {CONTACT_EMAIL}
      </a>
      <div className="mt-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
}