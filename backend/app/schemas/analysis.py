from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SkillGapOut(BaseModel):
    id: str
    match_id: str
    category: str # Programming, Technical Skills, Frameworks, Databases, Cloud, Tools, Soft Skills, Domain Skills
    skill_name: str
    importance: str # Critical, High, Medium, Low
    why_it_matters: str
    suggested_learning_topic: str
    equivalent_experience_detected: bool = False

    class Config:
        from_attributes = True

class SkillGapSummary(BaseModel):
    match_id: str
    total_gaps: int
    critical_gaps_count: int
    high_gaps_count: int
    categories: Dict[str, List[SkillGapOut]] = Field(default_factory=dict)

class DashboardStatItem(BaseModel):
    label: str
    value: Any
    change: Optional[str] = None
    trend: Optional[str] = None # 'up', 'down', 'neutral'

class RecentMatchItem(BaseModel):
    id: str
    resume_id: str
    candidate_name: Optional[str] = "Candidate"
    job_id: str
    job_title: str
    match_percentage: float
    created_at: str

class DashboardOverviewOut(BaseModel):
    total_resumes: int
    total_job_descriptions: int
    total_matches: int
    average_match_score: float
    top_detected_skills: List[Dict[str, Any]]
    top_missing_skills: List[Dict[str, Any]]
    recent_matches: List[RecentMatchItem]
