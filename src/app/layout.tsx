import type { Metadata, Viewport } from "next";
import { Fira_Sans, Noto_Sans_Arabic } from "next/font/google";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const fira = Fira_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  applicationName: SITE_NAME,
  icons: { icon: "/logo/icon.png" },
};

export const viewport: Viewport = { themeColor: "#000000" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerStore = await headers();
  const raw = headerStore.get("x-next-intl-locale");
  const locale =
    raw && (routing.locales as readonly string[]).includes(raw) ? raw : routing.defaultLocale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${fira.variable} ${arabic.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
