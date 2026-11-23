import { getTranslations } from "next-intl/server";
import { listPatientRecordPdfs } from "@/lib/patient/record-documents";
import { Panel } from "@/components/ui/SectionTitle";
import { LocalPdfDownload } from "@/components/patient/LocalPdfDownload";

export async function PatientRecordsPdfList({
  patientSerial,
  patientCode,
}: {
  patientSerial?: string;
  patientCode?: string;
}) {
  const t = await getTranslations("patientRecords");
  const docs = listPatientRecordPdfs(patientSerial);

  return (
    <Panel title={t("pdfTitle")}>
      <p className="mb-4 text-[13px] text-muted">{t("pdfHint")}</p>
      <ul className="divide-y divide-rule border border-rule">
        {docs.map((doc) => (
          <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <div>
              <p className="text-[14px] font-semibold text-text">{t(`pdf.${doc.titleKey}`)}</p>
              <p className="text-[12px] text-muted">
                {doc.doctorName ? `${doc.doctorName} · ` : ""}
                {formatWhen(doc.createdAt)}
              </p>
            </div>
            <LocalPdfDownload docId={doc.id} defaultCode={patientCode} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}