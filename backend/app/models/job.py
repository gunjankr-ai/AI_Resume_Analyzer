import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)            # list of strings
    preferred_skills = Column(JSON, default=list)           # list of strings
    experience_requirements = Column(JSON, default=dict)    # {min_years, preferred_years, seniority_level}
    education_requirements = Column(JSON, default=dict)     # {minimum_degree, preferred_fields}
    important_keywords = Column(JSON, default=list)         # list of strings
    tools_and_technologies = Column(JSON, default=list)     # list of strings
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    matches = relationship("JobMatch", back_populates="job", cascade="all, delete-orphan")
