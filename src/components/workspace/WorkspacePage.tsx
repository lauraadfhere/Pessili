type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

/** Shared inner layout for patient / clinician / admin workspace routes. */
export function WorkspacePage({ eyebrow, title, subtitle, actions, children }: Props) {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
        <div className="min-w-0">
          {eyebrow ? <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">{eyebrow}</p> : null}
          <h1 className={`font-semibold leading-tight text-text ${eyebrow ? "mt-1 text-[24px] sm:text-[28px]" : "text-[24px] sm:text-[28px]"}`}>
            {title}
          </h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </header>
      {children}
    </div>
  );
}
