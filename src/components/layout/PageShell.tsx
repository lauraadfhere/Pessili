import { getLogoSettings } from "@/lib/logo";
import type { NavKey } from "@/lib/nav";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";

type Props = {
  active?: NavKey;
  hero?: React.ComponentProps<typeof HeroBanner>;
  breadcrumbs: React.ComponentProps<typeof Breadcrumbs>["items"];
  flush?: boolean;
  children: React.ReactNode;
};

export async function PageShell({ active, hero, breadcrumbs, flush = false, children }: Props) {
  const logo = await getLogoSettings();

  return (
    <>
      <SiteHeader active={active} logo={logo} />
      {hero && <HeroBanner {...hero} />}
      <Breadcrumbs items={breadcrumbs} />
      <main className={`flex-1 ${flush ? "" : "pb-12"}`}>{children}</main>
      <SiteFooter logo={logo} />
    </>
  );
}