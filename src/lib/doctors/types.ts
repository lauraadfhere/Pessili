export const DOCTOR_CATEGORIES = ["psychologist", "psychiatrist", "child_psychologist"] as const;
export type DoctorCategory = (typeof DOCTOR_CATEGORIES)[number];

export type PublicDoctor = {
  id: string;
  displayName: string;
  specialty: DoctorCategory;
  wilayaCode: string;
  languages: string[];
  consultationPrice?: number;
  verified: boolean;
  onDemandAvailable: boolean;
  bio?: string;
  avatarUrl?: string;
  rating?: number;
};