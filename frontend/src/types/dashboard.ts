export interface RecentMatchItem {
  id: string;
  resume_id: string;
  candidate_name?: string;
  job_id: string;
  job_title: string;
  match_percentage: number;
  created_at: string;
}

export interface SkillCountItem {
  skill: string;
  count: number;
}

export interface DashboardOverview {
  total_resumes: number;
  total_job_descriptions: number;
  total_matches: number;
  average_match_score: number;
  top_detected_skills: SkillCountItem[];
  top_missing_skills: SkillCountItem[];
  recent_matches: RecentMatchItem[];
}

export interface SampleData {
  sample_resume: string;
  sample_job: string;
  job_title: string;
  company: string;
}
