import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(String(36), ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False)
    overall_match_percentage = Column(Float, default=0.0)
    score_breakdown = Column(JSON, default=dict)        # {technical_skills_score, experience_score, ...}
    matching_skills = Column(JSON, default=list)        # list of strings
    missing_skills = Column(JSON, default=list)         # list of strings
    matching_experience = Column(JSON, default=dict)    # {years_matched, relevant_roles, details}
    missing_keywords = Column(JSON, default=list)       # list of strings
    relevant_projects = Column(JSON, default=list)      # list of matched projects
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="matches")
    job = relationship("JobDescription", back_populates="matches")
    skill_gaps = relationship("SkillGap", back_populates="match", cascade="all, delete-orphan")
