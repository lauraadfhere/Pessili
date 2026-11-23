import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { AdminShell } from "@/components/admin/AdminShell";
import { PatientLookup } from "@/components/admin/PatientLookup";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPatientsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("adminPatients");

  return (
    <AdminShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("lookupTitle")}>
          <PatientLookup />
        </Panel>
      </WorkspacePage>
    </AdminShell>
  );
}
