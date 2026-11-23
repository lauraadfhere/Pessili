"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { PatientAvatar } from "@/components/ui/PatientAvatar";
import { IconBell, IconMore, IconSearch } from "@/components/ui/Icons";
import { SignOutButton } from "@/components/auth/SignOutButton";

type HeaderUser = {
  displayName: string;
  avatarUrl?: string;
};

type NotificationRow = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

type Layout = "desktop" | "mobileAvatar" | "mobileChrome";

export function PatientHeaderActions({
  user,
  layout = "desktop",
  theme = "light",
}: {
  user: HeaderUser;
  layout?: Layout;
  theme?: "light" | "dark";
}) {
  const t = useTranslations("patientNav");
  const locale = useLocale();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unread, setUnread] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const profileMenuId = useId();
  const notifMenuId = useId();
  const moreMenuId = useId();

  const closeAll = useCallback(() => {
    setProfileOpen(false);
    setNotifOpen(false);
    setMoreOpen(false);
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) closeAll();
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [closeAll]);

  useEffect(() => {
    if (!notifOpen) return;
    void fetch("/api/patient/notifications")
      .then(async (res) => {
        const data = (await res.json()) as { notifications?: NotificationRow[]; unread?: number };
        if (res.ok) {
          setNotifications(data.notifications ?? []);
          setUnread(data.unread ?? 0);
        }
      })
      .catch(() => undefined);
  }, [notifOpen]);

  useEffect(() => {
    void fetch("/api/patient/notifications")
      .then(async (res) => {
        const data = (await res.json()) as { unread?: number };
        if (res.ok) setUnread(data.unread ?? 0);
      })
      .catch(() => undefined);
  }, []);

  const light = theme === "light";
  const divider = light ? "border-rule" : "border-white/10";
  const chromeBtn = light
    ? "relative grid min-h-11 min-w-11 place-items-center border-s border-rule text-text hover:bg-black/[0.05] touch-manipulation"
    : "relative grid min-h-11 min-w-11 place-items-center border-s border-white/10 text-white hover:bg-white/5 touch-manipulation";
  const hoverChip = light ? "hover:bg-black/[0.05]" : "hover:bg-white/5";

  const compactAvatar = layout === "mobileAvatar" || layout === "mobileChrome";
  const profileControl = (
    <div className={compactAvatar ? "relative flex h-full w-full items-stretch justify-center" : `relative flex items-stretch border-s ${divider}`}>
      <button
        type="button"
        className={`flex items-center justify-center ${hoverChip} ${compactAvatar ? "h-full w-full px-2" : "min-h-11 gap-2 px-2 sm:px-3"}`}
        aria-expanded={profileOpen}
        aria-controls={profileMenuId}
        aria-label={t("myProfile")}
        onClick={() => {
          setNotifOpen(false);
          setMoreOpen(false);
          setProfileOpen((v) => !v);
        }}
      >
        <PatientAvatar name={user.displayName} avatarUrl={user.avatarUrl} size={compactAvatar ? 32 : 34} />
        {layout === "desktop" ? (
          <span className={`hidden max-w-[8rem] truncate text-[13px] font-medium lg:inline ${light ? "text-text" : "text-white"}`}>
            {user.displayName}
          </span>
        ) : null}
      </button>
      {profileOpen ? (
        <ul
          id={profileMenuId}
          className="absolute end-0 top-full z-[70] min-w-[12rem] border border-black bg-[#2a2a2a] py-1 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          role="menu"
        >
          <li role="none">
            <Link role="menuitem" href="/patient/profile" className="block px-4 py-2.5 text-[13px] text-white hover:bg-white/10" onClick={closeAll}>
              {t("myProfile")}
            </Link>
          </li>
          <li role="none">
            <Link role="menuitem" href="/patient/dashboard" className="block px-4 py-2.5 text-[13px] text-white hover:bg-white/10" onClick={closeAll}>
              {t("dashboard")}
            </Link>
          </li>
          <li role="none" className="border-t border-white/10 px-4 py-3">
            <SignOutButton className="w-full" />
          </li>
        </ul>
      ) : null}
    </div>
  );

  if (layout === "mobileAvatar") {
    return <div ref={rootRef}>{profileControl}</div>;
  }

  if (layout === "mobileChrome") {
    return (
      <div ref={rootRef} className="flex h-full items-stretch">
        <div className="relative flex items-stretch border-s border-white/20">
          <button
            type="button"
            className="relative grid min-h-full min-w-11 place-items-center text-white hover:bg-white/5"
            aria-expanded={notifOpen}
            aria-controls={notifMenuId}
            aria-label={t("notifications")}
            onClick={() => {
              setProfileOpen(false);
              setNotifOpen((v) => !v);
            }}
          >
            <IconBell className="size-[18px]" />
            {unread > 0 ? (
              <span className="absolute end-1 top-1 grid min-w-[15px] place-items-center rounded-full bg-new px-1 text-[9px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </button>
          {notifOpen ? (
            <div
              id={notifMenuId}
              className="absolute end-0 top-full z-[70] mt-0 w-[min(100vw-1.25rem,22rem)] border border-black bg-[#2a2a2a] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            >
              <p className="border-b border-white/10 px-4 py-2.5 text-[12px] font-semibold tracking-wide text-white/80 uppercase">{t("notifications")}</p>
              <ul className="max-h-[min(50vh,320px)] overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-4 text-[13px] text-white/75">{t("notificationsEmpty")}</li>
                ) : (
                  notifications.map((n) => (
                    <li key={n.id} className={`border-b border-white/8 px-4 py-3 last:border-b-0 ${n.read ? "opacity-80" : "bg-white/6"}`}>
                      <p className="text-[13px] font-semibold text-white">
                        {n.id === "welcome" ? t("welcomeNotifTitle") : n.id.startsWith("ai-") ? t("aiTitle") : n.title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-white/75">{n.id === "welcome" ? t("welcomeNotifBody") : n.body}</p>
                    </li>
                  ))
                )}
              </ul>
              <Link href="/patient/messages" className="block border-t border-white/10 px-4 py-2.5 text-[12px] text-white/90 hover:bg-white/10" onClick={closeAll}>
                {t("viewMessages")}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="border-s border-white/20">{profileControl}</div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex shrink-0 items-stretch text-[13px]">
      <div className="hidden items-stretch md:flex">
        {searchOpen ? (
          <form
            action={`/${locale}/patient/booking`}
            method="get"
            className={`flex h-11 items-stretch border-s ${divider}`}
            role="search"
            onSubmit={() => setSearchOpen(false)}
          >
            <label className="sr-only" htmlFor="patient-header-search">
              {t("search")}
            </label>
            <input
              id="patient-header-search"
              name="q"
              type="search"
              autoFocus
              placeholder={t("searchPlaceholder")}
              className={
                light
                  ? "w-[min(14rem,38vw)] border border-rule bg-white px-2 text-[13px] text-text outline-none placeholder:text-muted"
                  : "w-[min(14rem,38vw)] bg-chrome-field px-2 text-[13px] text-white outline-none placeholder:text-white/70"
              }
            />
            <button
              type="submit"
              className={light ? "grid w-11 place-items-center bg-brand text-white hover:bg-brand-dark" : "grid w-11 place-items-center bg-chrome-button hover:bg-[#6a6a6a]"}
              aria-label={t("searchSubmit")}
            >
              <IconSearch className="size-4" />
            </button>
          </form>
        ) : (
          <button type="button" className={chromeBtn} aria-label={t("search")} onClick={() => setSearchOpen(true)}>
            <IconSearch className="size-[18px]" />
          </button>
        )}
      </div>

      <div className="relative flex items-stretch">
        <button
          type="button"
          className={chromeBtn}
          aria-expanded={notifOpen}
          aria-controls={notifMenuId}
          aria-label={t("notifications")}
          onClick={() => {
            setMoreOpen(false);
            setProfileOpen(false);
            setNotifOpen((v) => !v);
          }}
        >
          <IconBell className="size-[18px]" />
          {unread > 0 ? (
            <span className="absolute end-1.5 top-1.5 grid min-w-[16px] place-items-center rounded-full bg-new px-1 text-[10px] font-bold leading-none text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </button>
        {notifOpen ? (
          <div
            id={notifMenuId}
            className="absolute end-0 top-full z-[70] mt-0 w-[min(100vw-1rem,22rem)] border border-black bg-[#2a2a2a] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          >
            <p className="border-b border-white/10 px-4 py-2.5 text-[12px] font-semibold tracking-wide text-white/80 uppercase">{t("notifications")}</p>
            <ul className="max-h-[min(50vh,320px)] overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="px-4 py-4 text-[13px] text-white/75">{t("notificationsEmpty")}</li>
              ) : (
                notifications.map((n) => (
                  <li key={n.id} className={`border-b border-white/8 px-4 py-3 last:border-b-0 ${n.read ? "opacity-80" : "bg-white/6"}`}>
                    <p className="text-[13px] font-semibold text-white">
                      {n.id === "welcome" ? t("welcomeNotifTitle") : n.id.startsWith("ai-") ? t("aiTitle") : n.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-white/75">{n.id === "welcome" ? t("welcomeNotifBody") : n.body}</p>
                  </li>
                ))
              )}
            </ul>
            <Link href="/patient/messages" className="block border-t border-white/10 px-4 py-2.5 text-[12px] text-white/90 hover:bg-white/10" onClick={closeAll}>
              {t("viewMessages")}
            </Link>
            <Link href="/patient/cases" className="block px-4 py-2.5 text-[12px] text-white/90 hover:bg-white/10" onClick={closeAll}>
              {t("viewCases")}
            </Link>
          </div>
        ) : null}
      </div>

      <div className={`hidden items-center border-s ${divider} px-3 lg:flex`}>
        <LanguageSwitcher variant={light ? "light" : "dark"} />
      </div>

      {profileControl}

      <div className="relative flex items-stretch">
        <button
          type="button"
          className={chromeBtn}
          aria-expanded={moreOpen}
          aria-controls={moreMenuId}
          aria-label={t("moreMenu")}
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
            setMoreOpen((v) => !v);
          }}
        >
          <IconMore className="size-5" />
        </button>
        {moreOpen ? (
          <ul id={moreMenuId} className="absolute end-0 top-full z-[70] min-w-[11rem] border border-black bg-[#2a2a2a] py-1 shadow-[0_8px_24px_rgba(0,0,0,0.35)]" role="menu">
            <li role="none">
              <Link role="menuitem" href="/" className="block px-4 py-2.5 text-[13px] text-white hover:bg-white/10" onClick={closeAll}>
                {t("publicSite")}
              </Link>
            </li>
            <li role="none">
              <Link role="menuitem" href="/crisis" className="block px-4 py-2.5 text-[13px] font-medium text-new hover:bg-white/10" onClick={closeAll}>
                {t("crisis")}
              </Link>
            </li>
            <li role="none">
              <Link role="menuitem" href="/patient/records" className="block px-4 py-2.5 text-[13px] text-white hover:bg-white/10" onClick={closeAll}>
                {t("records")}
              </Link>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
}
