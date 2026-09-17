import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    raw_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")
    matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, unique=True)
    candidate_name = Column(String(255), nullable=True)
    contact_info = Column(JSON, default=dict)       # email, phone, linkedin, github, portfolio, location
    summary = Column(Text, nullable=True)
    education = Column(JSON, default=list)          # list of {institution, degree, field, graduation_year, gpa}
    work_experience = Column(JSON, default=list)    # list of {company, role, start_date, end_date, duration, achievements}
    projects = Column(JSON, default=list)           # list of {name, description, technologies, link}
    certifications = Column(JSON, default=list)     # list of strings/objects
    technical_skills = Column(JSON, default=list)   # list of strings
    soft_skills = Column(JSON, default=list)        # list of strings
    tools_and_technologies = Column(JSON, default=list) # list of strings
    
    # Generated Insights
    resume_score = Column(Integer, default=0)       # 0-100
    strengths = Column(JSON, default=list)          # list of strings
    weaknesses = Column(JSON, default=list)         # list of strings
    improvement_suggestions = Column(JSON, default=list) # list of strings
    missing_sections = Column(JSON, default=list)   # list of strings
    keyword_analysis = Column(JSON, default=dict)   # {top_keywords, density, industry_terms}
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="analysis")
