"use client";

type WeekPoint = { label: string; sessions: number; urgent: number; earnings: number };
type MixPoint = { format: string; count: number };

export function SessionsBarChart({
  data,
  title,
  sessionsLabel,
  urgentLabel,
}: {
  data: WeekPoint[];
  title: string;
  sessionsLabel: string;
  urgentLabel: string;
}) {
  const max = Math.max(...data.map((d) => d.sessions + d.urgent), 1);
  const h = 140;
  const gap = 10;
  const barW = 28;
  const width = data.length * (barW + gap) + 20;

  return (
    <div>
      <p className="text-[13px] font-semibold text-text">{title}</p>
      <div className="mt-3 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${h + 28}`} className="min-w-full" role="img" aria-label={title}>
          {data.map((d, i) => {
            const x = 10 + i * (barW + gap);
            const sessionsH = (d.sessions / max) * h;
            const urgentH = (d.urgent / max) * h;
            return (
              <g key={d.label}>
                <rect x={x} y={h - sessionsH} width={barW} height={sessionsH} fill="#007e94" rx="2" />
                <rect x={x} y={h - sessionsH - urgentH} width={barW} height={urgentH} fill="#f08a24" rx="2" />
                <text x={x + barW / 2} y={h + 16} textAnchor="middle" className="fill-muted" fontSize="10">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 bg-brand" /> {sessionsLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 bg-promo-accent" /> {urgentLabel}
        </span>
      </div>
    </div>
  );
}

export function FormatDonut({
  data,
  title,
  labels,
}: {
  data: MixPoint[];
  title: string;
  labels: Record<string, string>;
}) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const colors = ["#007e94", "#5fb236", "#59626b"];
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div>
      <p className="text-[13px] font-semibold text-text">{title}</p>
      <div className="mt-3 flex flex-wrap items-center gap-5">
        <svg width="110" height="110" viewBox="0 0 110 110" role="img" aria-label={title}>
          <g transform="translate(55,55) rotate(-90)">
            {data.map((d, i) => {
              const len = (d.count / total) * c;
              const el = (
                <circle
                  key={d.format}
                  r={r}
                  fill="transparent"
                  stroke={colors[i % colors.length]}
                  strokeWidth="16"
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
          </g>
          <text x="55" y="52" textAnchor="middle" className="fill-text" fontSize="16" fontWeight="600">
            {total}
          </text>
          <text x="55" y="68" textAnchor="middle" className="fill-muted" fontSize="10">
            total
          </text>
        </svg>
        <ul className="space-y-1.5 text-[13px]">
          {data.map((d, i) => (
            <li key={d.format} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5" style={{ background: colors[i % colors.length] }} />
              <span className="text-text">{labels[d.format] ?? d.format}</span>
              <span className="tabular-nums text-muted">{d.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function EarningsSparkline({
  data,
  title,
  totalLabel,
}: {
  data: WeekPoint[];
  title: string;
  totalLabel: string;
}) {
  const values = data.map((d) => d.earnings);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const w = 280;
  const h = 72;
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  const total = values.reduce((s, v) => s + v, 0);

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[13px] font-semibold text-text">{title}</p>
        <p className="text-[12px] tabular-nums text-muted">
          {totalLabel}: <span className="font-semibold text-text">{total.toLocaleString()} DZD</span>
        </p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" role="img" aria-label={title}>
        <polyline fill="none" stroke="#007e94" strokeWidth="2.5" points={pts} />
        {values.map((v, i) => {
          const x = (i / Math.max(values.length - 1, 1)) * w;
          const y = h - ((v - min) / (max - min || 1)) * (h - 8) - 4;
          return <circle key={i} cx={x} cy={y} r="3" fill="#007e94" />;
        })}
      </svg>
    </div>
  );
}
