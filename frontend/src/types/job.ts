export interface ExperienceRequirements {
  min_years?: number;
  preferred_years?: number;
  seniority_level?: string;
}

export interface EducationRequirements {
  minimum_degree?: string;
  preferred_fields?: string[];
}

export interface JobDescription {
  id: string;
  title: string;
  company?: string | null;
  raw_text: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_requirements: ExperienceRequirements;
  education_requirements: EducationRequirements;
  important_keywords: string[];
  tools_and_technologies: string[];
  created_at: string;
}

export interface JobDescriptionCreate {
  title: string;
  company?: string;
  raw_text: string;
}
