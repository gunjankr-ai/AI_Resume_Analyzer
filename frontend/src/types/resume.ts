export interface ContactInfo {
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  location?: string | null;
}

export interface EducationItem {
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  graduation_year?: string | null;
  gpa?: string | null;
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  start_date?: string | null;
  end_date?: string | null;
  duration?: string | null;
  achievements: string[];
}

export interface ProjectItem {
  name: string;
  description?: string | null;
  technologies: string[];
  link?: string | null;
}

export interface KeywordAnalysis {
  top_keywords: string[];
  density: Record<string, number>;
  industry_terms: string[];
}

export interface ResumeAnalysis {
  id: string;
  resume_id: string;
  candidate_name?: string | null;
  contact_info: ContactInfo;
  summary?: string | null;
  education: EducationItem[];
  work_experience: WorkExperienceItem[];
  projects: ProjectItem[];
  certifications: string[];
  technical_skills: string[];
  soft_skills: string[];
  tools_and_technologies: string[];
  resume_score: number;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  missing_sections: string[];
  keyword_analysis: KeywordAnalysis;
  created_at: string;
}

export interface Resume {
  id: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  raw_text: string;
  created_at: string;
  updated_at: string;
  analysis?: ResumeAnalysis | null;
}

export interface ResumeListItem {
  id: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  candidate_name?: string | null;
  resume_score?: number | null;
  created_at: string;
}
