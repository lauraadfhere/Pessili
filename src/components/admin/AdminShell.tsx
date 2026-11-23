import { getLogoSettings } from "@/lib/logo";
import { getDemoSession } from "@/lib/demo-session";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { WorkspaceSubNav } from "@/components/workspace/WorkspaceSubNav";
import { ScrollControls } from "@/components/layout/ScrollControls";
import { CookieConsent } from "@/components/layout/CookieConsent";

type Props = { children: React.ReactNode };

export async function AdminShell({ children }: Props) {
  const logoBase = await getLogoSettings();
  const logo = { ...logoBase, headerUrl: logoBase.footerUrl || "/logo/footer.png", mode: "image" as const };
  const session = await getDemoSession();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7fafb]">
      <AdminHeader logo={logo} email={session?.email} roleLabel="Super Admin" />
      <WorkspaceSubNav items={ADMIN_NAV} namespace="adminNav" />
      <main className="flex-1 pb-20 pt-4 sm:pb-12">{children}</main>
      <footer className="border-t border-rule bg-white px-4 py-4 text-center text-[11px] text-muted sm:px-6">
        PeSSiLi admin · {new Date().getFullYear()}
      </footer>
      <ScrollControls />
      <CookieConsent />
    </div>
  );
}
