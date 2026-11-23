import { getLogoSettings } from "@/lib/logo";
import type { NavKey } from "@/lib/nav";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FeedbackTab } from "@/components/layout/FeedbackTab";
import { ScrollControls } from "@/components/layout/ScrollControls";
import { CookieConsent } from "@/components/layout/CookieConsent";

type Props = {
  active?: NavKey;
  hero?: { title: string; search?: { action: string; placeholder: string } };
  breadcrumbs: React.ComponentProps<typeof Breadcrumbs>["items"];
  flush?: boolean;
  children: React.ReactNode;
};

export async function PageShell({ active, hero, breadcrumbs, flush = false, children }: Props) {
  const logo = await getLogoSettings();

  return (
    <>
      <SiteChrome active={active} logo={logo} hero={hero} />
      <Breadcrumbs items={breadcrumbs} />
      <main className={`flex-1 ${flush ? "" : "pb-12"}`}>{children}</main>
      <SiteFooter logo={logo} />
      <FeedbackTab />
      <ScrollControls />
      <CookieConsent />
    </>
  );
}