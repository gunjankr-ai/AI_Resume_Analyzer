from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ScoreBreakdown(BaseModel):
    technical_skills_score: float = Field(..., description="Technical skills match percentage (35% weight)")
    tools_score: float = Field(..., description="Tools, Cloud & DB match percentage (15% weight)")
    experience_score: float = Field(..., description="Years of experience and seniority match percentage (25% weight)")
    education_score: float = Field(..., description="Education and qualification match percentage (10% weight)")
    keyword_score: float = Field(..., description="Domain keyword & context overlap percentage (15% weight)")
    weights: Dict[str, float] = Field(default_factory=lambda: {
        "technical_skills": 0.35,
        "tools_cloud_db": 0.15,
        "experience": 0.25,
        "education": 0.10,
        "keywords": 0.15
    })
    formula_explanation: str = Field(..., description="Transparent mathematical breakdown formula")

class MatchingExperience(BaseModel):
    years_matched: float = 0.0
    required_years: float = 0.0
    relevant_roles: List[str] = Field(default_factory=list)
    details: str = ""

class RelevantProject(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    match_reason: str = ""

class JobMatchRequest(BaseModel):
    resume_id: str
    job_id: str

class QuickCompareRequest(BaseModel):
    resume_id: str
    job_title: str
    job_text: str
    company: Optional[str] = None

class JobMatchOut(BaseModel):
    id: str
    resume_id: str
    job_id: str
    overall_match_percentage: float
    score_breakdown: ScoreBreakdown
    matching_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    matching_experience: MatchingExperience = Field(default_factory=MatchingExperience)
    missing_keywords: List[str] = Field(default_factory=list)
    relevant_projects: List[RelevantProject] = Field(default_factory=list)
    created_at: datetime

    class Config:
        from_attributes = True
