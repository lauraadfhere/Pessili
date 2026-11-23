type Props = {
  label: string;
  tone?: "neutral" | "ok" | "warn" | "danger" | "brand";
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "bg-panel-head text-muted",
  ok: "bg-edition/15 text-edition",
  warn: "bg-promo-accent/15 text-promo-accent",
  danger: "bg-new/10 text-new",
  brand: "bg-brand/10 text-brand",
};

export function StatusPill({ label, tone = "neutral" }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${tones[tone]}`}>
      {label}
    </span>
  );
}
