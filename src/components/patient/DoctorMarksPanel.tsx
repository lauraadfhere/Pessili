import { getTranslations } from "next-intl/server";
import { listPatientMarks } from "@/lib/patient/marks";
import { Panel } from "@/components/ui/SectionTitle";

export async function DoctorMarksPanel({ patientId }: { patientId: string }) {
  const t = await getTranslations("patientMarks");
  const marks = await listPatientMarks(patientId);

  return (
    <Panel title={t("title")}>
      {marks.length === 0 ? (
        <p className="text-[14px] text-muted">{t("empty")}</p>
      ) : (
        <ul className="divide-y divide-rule border border-rule">
          {marks.map((m) => (
            <li key={m.$id} className="px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[14px] font-semibold text-text">{m.doctorName}</span>
                <span className="text-[13px] font-bold text-brand">{m.score}/10</span>
              </div>
              {m.note ? <p className="mt-1 text-[13px] text-text">{m.note}</p> : null}
              {m.aiSummary ? (
                <p className="mt-2 border-s-4 border-brand bg-panel px-3 py-2 text-[12px] text-muted">{m.aiSummary}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}