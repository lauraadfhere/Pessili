type Props = { className?: string; title?: string };

/** Small brand-blue verified badge for clinicians. */
export function IconVerified({ className = "size-4", title }: Props) {
  return (
    <svg
      className={`shrink-0 text-brand ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      role="img"
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.78-9.72a.75.75 0 0 0-1.06-1.06l-3.22 3.22-1.72-1.72a.75.75 0 1 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l3.75-3.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}