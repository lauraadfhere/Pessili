"use client";

import type { LogoSettings } from "@/lib/logo-config";
import type { NavKey } from "@/lib/nav";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { MergedHeaderHero } from "@/components/layout/MergedHeaderHero";

type HeroProps = {
  title: string;
  search?: { action: string; placeholder: string };
};

export function SiteChrome({
  active,
  logo,
  hero,
}: {
  active?: NavKey;
  logo?: LogoSettings;
  hero?: HeroProps;
}) {
  return (
    <>
      <SiteHeader logo={logo} />
      {hero ? (
        <>
          <div className="md:hidden">
            <HeroBanner {...hero} />
          </div>
          <MergedHeaderHero active={active} logo={logo} hero={hero} />
        </>
      ) : (
        <MergedHeaderHero active={active} logo={logo} compact />
      )}
    </>
  );
}