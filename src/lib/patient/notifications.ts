import { listPatientCases } from "@/lib/patient/cases";
import { listPatientMessages } from "@/lib/patient/messages";
import { latestAiInsight, listPatientMarks } from "@/lib/patient/marks";

export type PatientNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  kind: "case" | "system" | "mark" | "ai";
};

export async function getPatientNotifications(patientId: string): Promise<PatientNotification[]> {
  const [cases, messages, marks] = await Promise.all([
    listPatientCases(patientId),
    listPatientMessages(patientId),
    listPatientMarks(patientId),
  ]);

  const fromMessages: PatientNotification[] = messages
    .filter((m) => m.fromRole === "doctor" && !m.read)
    .map((m) => ({
      id: `msg-${m.$id}`,
      title: m.doctorName,
      body: m.body,
      read: false,
      createdAt: m.createdAt,
      kind: "system" as const,
    }));
  const fromCases: PatientNotification[] = cases.map((c) => ({
    id: `case-${c.$id}`,
    title: c.title,
    body: c.statusNote ?? c.status,
    read: c.status === "closed",
    createdAt: c.updatedAt ?? c.createdAt ?? new Date().toISOString(),
    kind: "case",
  }));

  const fromMarks: PatientNotification[] = marks.map((m) => ({
    id: `mark-${m.$id}`,
    title: `${m.doctorName} · ${m.score}/10`,
    body: m.note ?? "",
    read: m.read,
    createdAt: m.createdAt,
    kind: "mark" as const,
  }));

  const aiText = latestAiInsight(marks);
  const fromAi: PatientNotification[] = aiText
    ? [
        {
          id: "ai-latest",
          title: "PeSSiLi AI",
          body: aiText,
          read: false,
          createdAt: marks[0]?.createdAt ?? new Date().toISOString(),
          kind: "ai" as const,
        },
      ]
    : [];

  const system: PatientNotification[] = [
    {
      id: "welcome",
      title: "PeSSiLi",
      body: "Your patient space is ready. Complete your profile and browse verified clinicians.",
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      kind: "system",
    },
  ];

  return [...fromAi, ...fromMarks, ...fromMessages, ...fromCases, ...system].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}