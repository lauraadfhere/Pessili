"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export type WorkspaceNavItem = { key: string; href: string };

const barClass =
  "sticky top-[var(--sticky-patient-chrome)] z-[55] border-y border-black bg-subnav text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] supports-[backdrop-filter]:bg-[#2e2e2e]/96 supports-[backdrop-filter]:backdrop-blur-sm";

type Props = {
  items: WorkspaceNavItem[];
  namespace: string;
  ariaLabelKey?: string;
};

export function WorkspaceSubNav({ items, namespace, ariaLabelKey = "label" }: Props) {
  const t = useTranslations(namespace);
  const pathname = usePathname();
  const active = items.find((item) => pathname.includes(item.href))?.key;

  return (
    <nav className={barClass} aria-label={t(ariaLabelKey)}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-stretch justify-start gap-x-0.5 overflow-x-auto px-1 sm:px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map(({ key, href }) => {
          const on = key === active;
          return (
            <Link
              key={key}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`block min-h-11 shrink-0 touch-manipulation whitespace-nowrap px-3 py-3 text-[13px] font-medium sm:px-3.5 ${
                on ? "bg-subnav-active text-white" : "text-white/92 hover:bg-white/12"
              }`}
            >
              {t(key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
