export type ScreeningToolId = "phq9" | "gad7";

export type ScreeningBand = "minimal" | "mild" | "moderate" | "moderatelySevere" | "severe";

export type ScreeningToolDef = {
  id: ScreeningToolId;
  questionCount: number;
  durationMin: number;
  /** Answer options 0–3 (standard PHQ/GAD Likert). */
  maxPerItem: number;
  /** Item index (0-based) that triggers crisis gate when > 0. PHQ-9 item 9. */
  riskItemIndex?: number;
};

export const SCREENING_TOOLS: Record<ScreeningToolId, ScreeningToolDef> = {
  phq9: {
    id: "phq9",
    questionCount: 9,
    durationMin: 5,
    maxPerItem: 3,
    riskItemIndex: 8,
  },
  gad7: {
    id: "gad7",
    questionCount: 7,
    durationMin: 4,
    maxPerItem: 3,
  },
};

/** Message keys under patientScreening.questions.{tool}.qN */
export function questionMessageKey(tool: ScreeningToolId, index: number): string {
  return `questions.${tool}.q${index + 1}`;
}

export function scoreAnswers(answers: number[]): number {
  return answers.reduce((sum, n) => sum + (Number.isFinite(n) ? n : 0), 0);
}

export function bandForPhq9(score: number): ScreeningBand {
  if (score <= 4) return "minimal";
  if (score <= 9) return "mild";
  if (score <= 14) return "moderate";
  if (score <= 19) return "moderatelySevere";
  return "severe";
}

export function bandForGad7(score: number): ScreeningBand {
  if (score <= 4) return "minimal";
  if (score <= 9) return "mild";
  if (score <= 14) return "moderate";
  return "severe";
}

export function bandForTool(tool: ScreeningToolId, score: number): ScreeningBand {
  return tool === "phq9" ? bandForPhq9(score) : bandForGad7(score);
}

export function hasRiskFlag(tool: ScreeningToolId, answers: number[]): boolean {
  const def = SCREENING_TOOLS[tool];
  if (def.riskItemIndex == null) return false;
  return (answers[def.riskItemIndex] ?? 0) > 0;
}

export function parseToolParam(value: string | null | undefined): ScreeningToolId | null {
  if (value === "phq9" || value === "gad7") return value;
  return null;
}
