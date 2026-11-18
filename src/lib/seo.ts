import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "./site";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export function localeUrl(locale: string, path = "") {
  return `${SITE_URL}/${locale}${path}`;
}

export function pageMetadata({
  locale,
  path,
  description,
  title,
}: {
  locale: string;
  path: string;
  description: string;
  title?: string;
}): Metadata {
  const canonical = localeUrl(locale, path);
  const languages = Object.fromEntries(routing.locales.map((loc) => [loc, localeUrl(loc, path)]));
  return {
    title,
    description,
    alternates: { canonical, languages: { ...languages, "x-default": localeUrl(routing.defaultLocale, path) } },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: title ?? SITE_NAME,
      description,
      url: canonical,
    },
  };
}