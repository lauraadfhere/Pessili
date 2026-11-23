import { getLogoSettings } from "@/lib/logo";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile } from "@/lib/patient/profile";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { ScrollControls } from "@/components/layout/ScrollControls";
import { CookieConsent } from "@/components/layout/CookieConsent";

type Props = {
  displayName?: string;
  children: React.ReactNode;
};

export async function PatientShell({ displayName, children }: Props) {
  const logoBase = await getLogoSettings();
  const logo = { ...logoBase, headerUrl: logoBase.footerUrl || "/logo/footer.png", mode: "image" as const };

  const session = await getDemoSession();
  const profile = session?.role === "patient" ? await getPatientProfile(session.email) : null;
  const name =
    displayName ||
    profile?.nickname ||
    profile?.fullName ||
    (session?.email ? session.email.split("@")[0] : "Patient");

  return (
    <div className="flex min-h-screen flex-col bg-[#f7fafb]">
      <PatientHeader
        logo={logo}
        displayName={name}
        user={{ displayName: name, avatarUrl: profile?.avatarUrl, qrToken: profile?.quickLoginToken }}
      />
      <main className="flex-1 pb-20 pt-4 sm:pb-12">{children}</main>
      <footer className="border-t border-rule bg-white px-4 py-4 text-center text-[11px] text-muted sm:px-6">
        PeSSiLi · {new Date().getFullYear()}
      </footer>
      <ScrollControls />
      <CookieConsent />
    </div>
  );
}