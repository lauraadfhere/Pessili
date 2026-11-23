"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { PATIENT_NAV, type PatientNavKey } from "@/lib/patient/nav";

function pathToActive(pathname: string): PatientNavKey | undefined {
  const hit = PATIENT_NAV.find((item) => pathname.includes(item.href));
  return hit?.key;
}

const barClass =
  "sticky top-[var(--sticky-patient-chrome)] z-[55] border-y border-black bg-subnav text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] supports-[backdrop-filter]:bg-[#2e2e2e]/96 supports-[backdrop-filter]:backdrop-blur-sm";

function TabLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`block min-h-11 shrink-0 touch-manipulation px-3 py-3 text-[13px] font-medium sm:px-3.5 ${
        active ? "bg-subnav-active text-white" : "text-white/92 hover:bg-white/12"
      }`}
    >
      {label}
    </Link>
  );
}

export function PatientSubNav() {
  const t = useTranslations("patientNav");
  const pathname = usePathname();
  const active = pathToActive(pathname);

  return (
    <nav className={barClass} aria-label={t("label")}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-stretch justify-start gap-x-0.5 overflow-x-auto px-1 sm:px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PATIENT_NAV.map(({ key, href }) => (
          <TabLink key={key} href={href} active={key === active} label={t(key)} />
        ))}
      </div>
    </nav>
  );
}