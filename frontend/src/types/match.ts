export interface ScoreBreakdown {
  technical_skills_score: number;
  tools_score: number;
  experience_score: number;
  education_score: number;
  keyword_score: number;
  weights: {
    technical_skills: number;
    tools_cloud_db: number;
    experience: number;
    education: number;
    keywords: number;
  };
  formula_explanation: string;
}

export interface MatchingExperience {
  years_matched: number;
  required_years: number;
  relevant_roles: string[];
  details: string;
}

export interface RelevantProject {
  name: string;
  description?: string | null;
  technologies: string[];
  match_reason: string;
}

export interface JobMatch {
  id: string;
  resume_id: string;
  job_id: string;
  overall_match_percentage: number;
  score_breakdown: ScoreBreakdown;
  matching_skills: string[];
  missing_skills: string[];
  matching_experience: MatchingExperience;
  missing_keywords: string[];
  relevant_projects: RelevantProject[];
  created_at: string;
}

export interface QuickComparePayload {
  resume_id: string;
  job_title: string;
  job_text: string;
  company?: string;
}
