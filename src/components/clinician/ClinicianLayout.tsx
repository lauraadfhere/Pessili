"use client";

import { useCallback, useEffect, useState } from "react";
import type { LogoSettings } from "@/lib/logo-config";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AvailabilityToggle } from "@/components/clinician/AvailabilityToggle";
import { ClinicianNavIcon } from "@/components/clinician/ClinicianNavIcons";
import { StatusPill } from "@/components/workspace/StatusPill";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { AvailabilityStatus } from "@/lib/clinician/demo";

export type ClinicianNavItem = { key: string; href: string };

type HeaderDensity = "full" | "compact";

const SIDEBAR_KEY = "pessili_clinician_sidebar_collapsed";
const HEADER_KEY = "pessili_clinician_header_density";

type Props = {
  sidebarLogo: LogoSettings;
  displayName: string;
  email?: string;
  items: ClinicianNavItem[];
  children: React.ReactNode;
};

export function ClinicianLayout({ sidebarLogo, displayName: initialName, email, items, children }: Props) {
  const t = useTranslations("clinicianNav");
  const tChrome = useTranslations("clinicianChrome");
  const pathname = usePathname();
  const active = items.find((item) => pathname.includes(item.href))?.key;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerDensity, setHeaderDensity] = useState<HeaderDensity>("full");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [displayName, setDisplayName] = useState(initialName);
  const [status, setStatus] = useState<AvailabilityStatus>("available");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [statusLoaded, setStatusLoaded] = useState(false);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/clinician/status");
      if (!res.ok) return;
      const data = (await res.json()) as {
        status: AvailabilityStatus;
        displayName?: string;
        avatarDataUrl?: string | null;
      };
      setStatus(data.status);
      if (data.displayName) setDisplayName(data.displayName);
      setAvatarUrl(data.avatarDataUrl ?? null);
      setStatusLoaded(true);
    } catch {
      setStatusLoaded(true);
    }
  }, []);

  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
      const density = localStorage.getItem(HEADER_KEY);
      if (density === "compact" || density === "full") setHeaderDensity(density);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed ? "1" : "0");
      localStorage.setItem(HEADER_KEY, headerDensity);
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed, headerDensity, ready]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    void refreshStatus();
    const onProfile = () => void refreshStatus();
    window.addEventListener("pessili:clinician-profile", onProfile);
    const id = window.setInterval(() => void refreshStatus(), 60_000);
    return () => {
      window.removeEventListener("pessili:clinician-profile", onProfile);
      window.clearInterval(id);
    };
  }, [refreshStatus]);

  const headerPad = headerDensity === "compact" ? "py-2" : "py-3.5";
  const sidebarWidth = sidebarCollapsed ? "lg:w-[4.5rem]" : "lg:w-[15.5rem]";
  const statusTone = status === "available" ? "ok" : status === "busy" ? "warn" : "neutral";
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex min-h-screen bg-[#eef3f5]">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[70] bg-black/45 lg:hidden"
          aria-label={tChrome("closeMenu")}
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 start-0 z-[80] flex w-[16.5rem] flex-col border-e border-black/10 bg-[#13262c] text-white transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 ${sidebarWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:rtl:translate-x-0"
        }`}
        aria-label={t("label")}
      >
        <div className={`flex items-center gap-3 border-b border-white/10 px-3 ${headerPad}`}>
          {sidebarCollapsed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/logo/white-square.png"
              alt="PeSSiLi"
              className="mx-auto h-8 w-8 object-contain"
            />
          ) : (
            <BrandMark
              logo={{ ...sidebarLogo, headerUrl: "/logo/white.png", headerWidth: 118 }}
              compact
            />
          )}
          {!sidebarCollapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold tracking-wide">{tChrome("workspace")}</p>
              <p className="truncate text-[11px] text-white/65">{tChrome("licensedCare")}</p>
            </div>
          ) : null}
          <button
            type="button"
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white lg:inline-flex"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-pressed={sidebarCollapsed}
            aria-label={sidebarCollapsed ? tChrome("expandSidebar") : tChrome("collapseSidebar")}
            title={sidebarCollapsed ? tChrome("expandSidebar") : tChrome("collapseSidebar")}
          >
            <SidebarToggleIcon collapsed={sidebarCollapsed} />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label={tChrome("closeMenu")}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {items.map(({ key, href }) => {
              const on = key === active;
              return (
                <li key={key}>
                  <Link
                    href={href}
                    title={t(key)}
                    aria-current={on ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-md px-2.5 py-2.5 text-[13px] font-medium transition-colors ${
                      on ? "bg-brand text-white" : "text-white/82 hover:bg-white/10 hover:text-white"
                    } ${sidebarCollapsed ? "lg:justify-center lg:px-2" : ""}`}
                  >
                    <ClinicianNavIcon
                      name={key}
                      className={`h-[1.15rem] w-[1.15rem] shrink-0 ${on ? "text-white" : "text-white/75 group-hover:text-white"}`}
                    />
                    <span className={sidebarCollapsed ? "lg:hidden" : ""}>{t(key)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`border-t border-white/10 px-3 ${headerPad}`}>
          <div className={`flex items-center gap-2 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <AvatarBubble src={avatarUrl} initials={initials} size="sm" />
            {!sidebarCollapsed ? (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{displayName}</p>
                {email ? <p className="truncate text-[11px] text-white/60">{email}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-[60] border-b border-rule bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90">
          <div className={`flex items-center justify-between gap-3 px-3 sm:px-5 ${headerPad}`}>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rule bg-panel text-text hover:bg-panel-head lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label={tChrome("openMenu")}
              >
                <MenuIcon />
              </button>
              <button
                type="button"
                className="hidden h-9 w-9 items-center justify-center rounded-md border border-rule bg-panel text-text hover:bg-panel-head lg:inline-flex"
                onClick={() => setSidebarCollapsed((v) => !v)}
                aria-pressed={sidebarCollapsed}
                aria-label={sidebarCollapsed ? tChrome("expandSidebar") : tChrome("collapseSidebar")}
                title={sidebarCollapsed ? tChrome("expandSidebar") : tChrome("collapseSidebar")}
              >
                <SidebarToggleIcon collapsed={sidebarCollapsed} />
              </button>
              <Link href="/clinician/profile" className="shrink-0" title={t("profile")}>
                <AvatarBubble src={avatarUrl} initials={initials} size="md" />
              </Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`truncate font-semibold text-text ${headerDensity === "compact" ? "text-[14px]" : "text-[16px]"}`}>
                    {displayName}
                  </p>
                  {statusLoaded ? (
                    <StatusPill label={t(`status.${status}`)} tone={statusTone} />
                  ) : (
                    <span className="text-[11px] text-muted">{tChrome("statusLoading")}</span>
                  )}
                </div>
                {headerDensity === "full" && email ? (
                  <p className="truncate text-[12px] text-muted">{email}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
              <div
                className="hidden items-center rounded-md border border-rule bg-panel p-0.5 sm:inline-flex"
                role="group"
                aria-label={tChrome("headerDensity")}
              >
                <DensityButton
                  active={headerDensity === "compact"}
                  onClick={() => setHeaderDensity("compact")}
                  label={tChrome("compact")}
                />
                <DensityButton
                  active={headerDensity === "full"}
                  onClick={() => setHeaderDensity("full")}
                  label={tChrome("full")}
                />
              </div>
              <AvailabilityToggle value={status} onChange={setStatus} />
              <LanguageSwitcher />
              <Link
                href="/crisis"
                className="hidden rounded-md border border-new/30 bg-new/5 px-2.5 py-1.5 text-[12px] font-semibold text-new md:inline"
              >
                {t("crisisTools")}
              </Link>
              <SignOutButton className="rounded-md px-3 py-1.5 text-[12px]" />
            </div>
          </div>
        </header>

        <main className="flex-1 pb-16 pt-5 sm:pb-10 sm:pt-6">{children}</main>

        <footer className="border-t border-rule bg-white px-4 py-3 text-center text-[11px] text-muted sm:px-6">
          PeSSiLi clinician · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}

function AvatarBubble({
  src,
  initials,
  size,
}: {
  src: string | null;
  initials: string;
  size: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-[11px]" : "h-9 w-9 text-[12px]";
  return (
    <span className={`inline-flex ${dim} items-center justify-center overflow-hidden rounded-full border border-rule bg-panel font-semibold text-brand`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}

function DensityButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-8 rounded px-2.5 text-[11px] font-semibold tracking-wide uppercase transition-colors ${
        active ? "bg-brand text-white" : "text-muted hover:bg-white hover:text-text"
      }`}
    >
      {label}
    </button>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function SidebarToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d={collapsed ? "M9 4v16M13 9l3 3-3 3" : "M9 4v16M14 9l-3 3 3 3"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
