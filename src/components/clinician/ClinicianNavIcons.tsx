type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

export function ClinicianNavIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  switch (name) {
    case "today":
      return (
        <Svg className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </Svg>
      );
    case "urgent":
      return (
        <Svg className={className}>
          <path d="M12 3 3 20h18L12 3z" />
          <path d="M12 10v4M12 17h.01" />
        </Svg>
      );
    case "schedule":
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </Svg>
      );
    case "requests":
      return (
        <Svg className={className}>
          <path d="M4 5h16v14H4z" />
          <path d="M8 9h8M8 13h5" />
        </Svg>
      );
    case "patients":
      return (
        <Svg className={className}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M21 19c0-2.2-1.5-3.8-4-4.2" />
        </Svg>
      );
    case "session":
      return (
        <Svg className={className}>
          <path d="M15 10l4.5-2.5v9L15 14" />
          <rect x="3" y="7" width="12" height="10" rx="1.5" />
        </Svg>
      );
    case "notes":
      return (
        <Svg className={className}>
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v4h4M9 12h6M9 16h4" />
        </Svg>
      );
    case "followUp":
      return (
        <Svg className={className}>
          <path d="M4 12a8 8 0 1 0 2.3-5.7" />
          <path d="M4 4v5h5" />
        </Svg>
      );
    case "referrals":
      return (
        <Svg className={className}>
          <path d="M7 17l10-10M12 7h5v5" />
          <path d="M5 12v7h7" />
        </Svg>
      );
    case "earnings":
      return (
        <Svg className={className}>
          <path d="M12 3v18M17 8c0-1.7-2.2-3-5-3s-5 1.3-5 3 2.2 3 5 3 5 1.3 5 3-2.2 3-5 3-5-1.3-5-3" />
        </Svg>
      );
    case "profile":
      return (
        <Svg className={className}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
        </Svg>
      );
    case "support":
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.3 1-1.3 2M12 17h.01" />
        </Svg>
      );
    case "prescriptions":
      return (
        <Svg className={className}>
          <path d="M9 3h6v4H9z" />
          <path d="M8 7h8l1 14H7L8 7z" />
          <path d="M10 12h4M12 10v4" />
        </Svg>
      );
    default:
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="8" />
        </Svg>
      );
  }
}
