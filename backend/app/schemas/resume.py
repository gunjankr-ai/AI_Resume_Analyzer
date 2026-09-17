from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    location: Optional[str] = None

class EducationItem(BaseModel):
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None

class WorkExperienceItem(BaseModel):
    company: str
    role: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration: Optional[str] = None
    achievements: List[str] = Field(default_factory=list)

class ProjectItem(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    link: Optional[str] = None

class KeywordAnalysis(BaseModel):
    top_keywords: List[str] = Field(default_factory=list)
    density: Dict[str, float] = Field(default_factory=dict)
    industry_terms: List[str] = Field(default_factory=list)

class ResumeAnalysisBase(BaseModel):
    candidate_name: Optional[str] = None
    contact_info: ContactInfo = Field(default_factory=ContactInfo)
    summary: Optional[str] = None
    education: List[EducationItem] = Field(default_factory=list)
    work_experience: List[WorkExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    technical_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    tools_and_technologies: List[str] = Field(default_factory=list)
    
    resume_score: int = 0
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    improvement_suggestions: List[str] = Field(default_factory=list)
    missing_sections: List[str] = Field(default_factory=list)
    keyword_analysis: KeywordAnalysis = Field(default_factory=KeywordAnalysis)

class ResumeAnalysisOut(ResumeAnalysisBase):
    id: str
    resume_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ResumeBase(BaseModel):
    file_name: str
    file_type: str
    file_size_bytes: int

class ResumeOut(ResumeBase):
    id: str
    raw_text: str
    created_at: datetime
    updated_at: datetime
    analysis: Optional[ResumeAnalysisOut] = None

    class Config:
        from_attributes = True

class ResumeListItem(ResumeBase):
    id: str
    candidate_name: Optional[str] = None
    resume_score: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
