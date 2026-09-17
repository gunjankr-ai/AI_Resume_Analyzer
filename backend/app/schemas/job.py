from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class ExperienceRequirements(BaseModel):
    min_years: Optional[float] = None
    preferred_years: Optional[float] = None
    seniority_level: Optional[str] = "Mid-Level" # Entry, Junior, Mid-Level, Senior, Lead, Executive

class EducationRequirements(BaseModel):
    minimum_degree: Optional[str] = "Bachelor's Degree"
    preferred_fields: List[str] = Field(default_factory=list)

class JobDescriptionCreate(BaseModel):
    title: str = Field(..., example="Senior Full-Stack Engineer")
    company: Optional[str] = Field(None, example="Acme Corp")
    raw_text: str = Field(..., min_length=20, example="We are looking for a Senior Full-Stack Engineer...")

class JobDescriptionOut(BaseModel):
    id: str
    title: str
    company: Optional[str] = None
    raw_text: str
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    experience_requirements: ExperienceRequirements = Field(default_factory=ExperienceRequirements)
    education_requirements: EducationRequirements = Field(default_factory=EducationRequirements)
    important_keywords: List[str] = Field(default_factory=list)
    tools_and_technologies: List[str] = Field(default_factory=list)
    created_at: datetime

    class Config:
        from_attributes = True
