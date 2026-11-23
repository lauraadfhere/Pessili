/* eslint-disable @next/next/no-img-element */

type Props = {
  name: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function PatientAvatar({ name, avatarUrl, size = 36, className = "" }: Props) {
  const px = `${size}px`;
  if (avatarUrl?.trim()) {
    return (
      <img
        src={avatarUrl}
        alt=""
        width={size}
        height={size}
        className={`rounded-full border border-white/25 object-cover ${className}`}
        style={{ width: px, height: px }}
      />
    );
  }
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full border border-white/25 bg-brand text-[12px] font-bold text-white ${className}`}
      style={{ width: px, height: px }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}