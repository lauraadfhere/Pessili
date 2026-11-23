import { Link } from "@/i18n/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { IconArrowRight } from "@/components/ui/Icons";

type Props = {
  title: string;
  children: React.ReactNode;
  href: string;
  linkLabel: string;
  meta?: string;
};

/** Home-page `Panel` styling — gray head band, italic title bar, body block. */
export function DashboardPanelTile({ title, children, href, linkLabel, meta }: Props) {
  return (
    <section className="flex h-full flex-col bg-panel">
      <div className="bg-panel-head px-3 py-2.5">
        <SectionTitle className="!text-[17px] sm:!text-[19px]">{title}</SectionTitle>
      </div>
      <div className="flex flex-1 flex-col px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex-1 text-[14px] leading-relaxed text-text">{children}</div>
        {meta ? <p className="mt-3 text-[12px] font-semibold tracking-wide text-muted uppercase">{meta}</p> : null}
        <div className="mt-4 border-t border-rule pt-3 text-end">
          <Link href={href} className="inline-flex items-center gap-2 text-[14px] text-link hover:text-link-hover hover:underline">
            {linkLabel}
            <IconArrowRight className="h-3 w-7 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}