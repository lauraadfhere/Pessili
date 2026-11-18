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