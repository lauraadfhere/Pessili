export function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`flex items-center gap-2 text-[21px] font-medium leading-tight italic text-text ${className}`}>
      <span className="block h-[18px] w-[6px] shrink-0 bg-text" aria-hidden />
      {children}
    </h2>
  );
}

export function Panel({ title, children, className = "" }: { title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-panel ${className}`}>
      <div className="bg-panel-head px-3 py-2.5">
        <SectionTitle>{title}</SectionTitle>
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}