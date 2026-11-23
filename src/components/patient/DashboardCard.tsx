import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  description: string;
  href: string;
  stat?: string;
  accent?: "brand" | "calm" | "alert" | "neutral";
};

const accentMap = {
  brand: "border-rule bg-white",
  calm: "border-rule bg-white",
  alert: "border-rule bg-white",
  neutral: "border-rule bg-white",
};

export function DashboardCard({ title, description, href, stat, accent = "brand" }: Props) {
  return (
    <Link
      href={href}
      className={`flex min-h-[148px] flex-col justify-between border border-rule bg-white p-4 transition hover:border-brand/40 sm:min-h-[160px] sm:p-5 ${accentMap[accent]}`}
    >
      <div>
        <h3 className="text-[16px] font-semibold text-text sm:text-[17px]">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{description}</p>
      </div>
      {stat ? <p className="mt-3 text-[12px] font-semibold tracking-wide text-brand uppercase">{stat}</p> : null}
    </Link>
  );
}