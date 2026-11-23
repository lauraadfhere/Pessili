type IconProps = { className?: string };

function Svg({ className, children, strokeWidth = 2 }: IconProps & { children: React.ReactNode; strokeWidth?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <Svg className={className} strokeWidth={2.4}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.6-4.6" />
    </Svg>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  );
}

export function IconMessage({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </Svg>
  );
}

export function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M0 6h26M21 1l5 5-5 5" />
    </svg>
  );
}

export function IconBell({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

export function IconMore({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

export function IconInfo({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" strokeLinecap="round" />
    </svg>
  );
}