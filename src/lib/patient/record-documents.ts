export type PatientRecordPdf = {
  id: string;
  titleKey: string;
  doctorName?: string;
  createdAt: string;
  type: "consultation" | "prescription" | "lab";
};

export function listPatientRecordPdfs(_patientSerial?: string): PatientRecordPdf[] {
  const base = new Date();
  return [
    {
      id: "summary",
      titleKey: "summary",
      createdAt: new Date(base.getTime() - 86400000 * 7).toISOString(),
      type: "consultation",
    },
    {
      id: "consult",
      titleKey: "consultReport",
      doctorName: "Dr. Karim Mesbah",
      createdAt: new Date(base.getTime() - 86400000 * 3).toISOString(),
      type: "consultation",
    },
    {
      id: "rx",
      titleKey: "prescription",
      doctorName: "Dr. Karim Mesbah",
      createdAt: new Date(base.getTime() - 86400000 * 2).toISOString(),
      type: "prescription",
    },
  ];
}