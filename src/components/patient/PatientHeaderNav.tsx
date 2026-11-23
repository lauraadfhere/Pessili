"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { PATIENT_NAV, type PatientNavKey } from "@/lib/patient/nav";

function pathToActive(pathname: string): PatientNavKey | undefined {
  return PATIENT_NAV.find((item) => pathname.includes(item.href))?.key;
}

type Props = {
  theme?: "light" | "dark";
  align?: "start" | "end";
  drawer?: boolean;
  onNavigate?: () => void;
};

export function PatientHeaderNav({ theme = "light", align = "end", drawer, onNavigate }: Props) {
  const t = useTranslations("patientNav");
  const pathname = usePathname();
  const active = pathToActive(pathname);
  const light = theme === "light";

  const linkBase = drawer
    ? `block border-b py-3.5 text-[16px] font-medium last:border-b-0 ${light ? "border-rule" : "border-white/10"}`
    : "block shrink-0 touch-manipulation whitespace-nowrap px-2.5 text-[13px] font-medium sm:px-3 lg:text-[14px]";

  const linkIdle = drawer
    ? light
      ? "text-text hover:text-link hover:underline"
      : "text-white/90 hover:underline"
    : light
      ? "text-text hover:bg-black/[0.04] hover:text-link"
      : "text-white/90 hover:bg-white/10 hover:text-white";

  const linkOn = drawer
    ? light
      ? "font-semibold text-brand underline decoration-brand decoration-2 underline-offset-4"
      : "font-semibold text-white underline decoration-brand decoration-2 underline-offset-4"
    : light
      ? "bg-panel font-semibold text-brand underline decoration-brand decoration-2 underline-offset-[8px]"
      : "bg-white/12 text-white underline decoration-brand decoration-2 underline-offset-[8px]";

  const navShell = drawer
    ? "flex flex-col"
    : `flex min-w-0 flex-1 items-center ${align === "end" ? "justify-end" : "justify-start"} border-s border-rule`;

  const listClass = drawer
    ? "flex flex-col"
    : `flex items-center gap-0.5 overflow-x-auto py-1 ${align === "end" ? "pe-1" : "ps-2"} [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`;

  return (
    <nav className={navShell} aria-label={t("label")}>
      <div className={listClass}>
        {PATIENT_NAV.map(({ key, href }) => (
          <Link
            key={key}
            href={href}
            onClick={onNavigate}
            aria-current={active === key ? "page" : undefined}
            className={`${linkBase} ${drawer ? "py-3.5" : "py-2"} ${active === key ? linkOn : linkIdle}`}
          >
            {t(key)}
          </Link>
        ))}
      </div>
    </nav>
  );
}