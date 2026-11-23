import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDemoSession } from "@/lib/demo-session";
import { ClinicianShell } from "@/components/clinician/ClinicianShell";
import { NotesWorkspace } from "@/components/clinician/NotesWorkspace";
import { WorkspacePage } from "@/components/workspace/WorkspacePage";
import { Panel } from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function ClinicianNotesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getDemoSession();
  if (!session) redirect(`/${locale}/login`);
  if (session.role !== "doctor") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("clinicianNotes");

  return (
    <ClinicianShell>
      <WorkspacePage eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <Panel title={t("template")}>
          <NotesWorkspace />
        </Panel>
      </WorkspacePage>
    </ClinicianShell>
  );
}
