type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

/** Shared inner layout for all patient routes — same spacing and typography. */
export function PatientPage({ eyebrow, title, subtitle, children }: Props) {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 sm:px-6">
      <header className="border-b border-rule pb-4">
        {eyebrow ? <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">{eyebrow}</p> : null}
        <h1 className={`font-semibold leading-tight text-text ${eyebrow ? "mt-1 text-[24px] sm:text-[28px]" : "text-[24px] sm:text-[28px]"}`}>
          {title}
        </h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted">{subtitle}</p> : null}
      </header>
      {children}
    </div>
  );
}