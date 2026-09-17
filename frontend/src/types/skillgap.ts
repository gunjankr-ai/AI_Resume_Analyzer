export type SkillCategory =
  | "Programming"
  | "Technical Skills"
  | "Frameworks"
  | "Databases"
  | "Cloud"
  | "Tools"
  | "Soft Skills"
  | "Domain Skills";

export type SkillImportance = "Critical" | "High" | "Medium" | "Low";

export interface SkillGapItem {
  id: string;
  match_id: string;
  category: string;
  skill_name: string;
  importance: SkillImportance;
  why_it_matters: string;
  suggested_learning_topic: string;
  equivalent_experience_detected: boolean;
}

export interface SkillGapSummary {
  match_id: string;
  total_gaps: number;
  critical_gaps_count: number;
  high_gaps_count: number;
  categories: Record<string, SkillGapItem[]>;
}
