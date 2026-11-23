import { getTranslations } from "next-intl/server";
import { PatientAvatar } from "@/components/ui/PatientAvatar";
import { IconVerified } from "@/components/ui/IconVerified";
import { SectionTitle, Panel } from "@/components/ui/SectionTitle";
import { DOCTOR_CATEGORIES, type DoctorCategory, type PublicDoctor } from "@/lib/doctors/types";
import { groupDoctorsByCategory } from "@/lib/doctors/list";

type Props = {
  doctors: PublicDoctor[];
  emptyQuery?: boolean;
};

export async function DoctorsByCategory({ doctors, emptyQuery }: Props) {
  const t = await getTranslations("patientDoctors");
  const grouped = groupDoctorsByCategory(doctors);

  if (!doctors.length) {
    return (
      <Panel title={t("directoryTitle")}>
        <p className="text-[14px] text-muted">{emptyQuery ? t("noResults") : t("empty")}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      {DOCTOR_CATEGORIES.map((category) => (
        <CategorySection key={category} category={category} doctors={grouped[category]} />
      ))}
    </div>
  );
}

async function CategorySection({ category, doctors }: { category: DoctorCategory; doctors: PublicDoctor[] }) {
  const t = await getTranslations("patientDoctors");
  if (!doctors.length) return null;

  return (
    <section className="bg-panel">
      <div className="bg-panel-head px-3 py-2.5">
        <SectionTitle className="!text-[17px] sm:!text-[19px]">{t(`categories.${category}`)}</SectionTitle>
        <p className="mt-1 text-[12px] text-muted">{t(`categoryDesc.${category}`)}</p>
      </div>
      <ul className="divide-y divide-rule">
        {doctors.map((doc) => (
          <li key={doc.id} className="flex flex-wrap gap-4 px-4 py-4 sm:px-6 sm:py-5">
            <PatientAvatar name={doc.displayName} avatarUrl={doc.avatarUrl} size={52} className="!border-rule !bg-panel-head !text-brand" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="flex items-center gap-1.5 text-[16px] font-semibold text-text">
                    {doc.displayName}
                    {doc.verified ? <IconVerified title={t("verified")} className="size-[18px]" /> : null}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {t("wilaya", { code: doc.wilayaCode })} · {doc.languages.map((l) => l.toUpperCase()).join(", ")}
                  </p>
                </div>
                <div className="text-end text-[12px]">
                  {doc.verified ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-brand">
                      <IconVerified title={t("verified")} className="size-3.5" />
                      {t("verified")}
                    </span>
                  ) : null}
                  {doc.consultationPrice ? (
                    <p className="mt-0.5 font-semibold text-text">{t("price", { amount: doc.consultationPrice })}</p>
                  ) : null}
                </div>
              </div>
              {doc.bio ? <p className="mt-2 text-[14px] leading-relaxed text-text">{doc.bio}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide">
                {doc.onDemandAvailable ? (
                  <span className="bg-[#e8f4f7] px-2 py-0.5 text-brand">{t("onDemand")}</span>
                ) : (
                  <span className="bg-panel-head px-2 py-0.5 text-muted">{t("byAppointment")}</span>
                )}
                {doc.rating ? <span className="bg-panel-head px-2 py-0.5 text-muted">{t("rating", { value: doc.rating })}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
