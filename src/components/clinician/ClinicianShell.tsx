import { getLogoSettings } from "@/lib/logo";
import { getDemoSession } from "@/lib/demo-session";
import { CLINICIAN_NAV, CLINICIAN_PSYCHIATRIST_EXTRA } from "@/lib/clinician/nav";
import { DEMO_CLINICIAN } from "@/lib/clinician/demo";
import { getClinicianProfile } from "@/lib/clinician/store";
import { ClinicianLayout } from "@/components/clinician/ClinicianLayout";
import { ScrollControls } from "@/components/layout/ScrollControls";
import { CookieConsent } from "@/components/layout/CookieConsent";

type Props = { children: React.ReactNode; showPrescriptions?: boolean };

export async function ClinicianShell({ children, showPrescriptions }: Props) {
  const logoBase = await getLogoSettings();
  const sidebarLogo = {
    ...logoBase,
    headerUrl: "/logo/white.png",
    headerWidth: 118,
    mode: "image" as const,
  };
  const session = await getDemoSession();
  const profile = session?.role === "doctor" ? getClinicianProfile(session.email) : null;
  const items =
    showPrescriptions || DEMO_CLINICIAN.type === "psychiatrist"
      ? [...CLINICIAN_NAV, CLINICIAN_PSYCHIATRIST_EXTRA]
      : CLINICIAN_NAV;

  return (
    <>
      <ClinicianLayout
        sidebarLogo={sidebarLogo}
        displayName={profile?.displayName ?? DEMO_CLINICIAN.displayName}
        email={session?.email}
        items={items}
      >
        {children}
      </ClinicianLayout>
      <ScrollControls />
      <CookieConsent />
    </>
  );
}
