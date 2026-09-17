import uuid
from typing import Optional, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.job import JobDescription
from app.ai.llm_client import analyze_job_ai

def create_and_analyze_job(title: str, raw_text: str, company: Optional[str], db: Session) -> JobDescription:
    """Parses requirements from job text and persists to database."""
    if len(raw_text.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job description text is too short. Please provide at least 20 characters of requirements."
        )

    analyzed = analyze_job_ai(raw_text, title)

    job = JobDescription(
        id=str(uuid.uuid4()),
        title=title.strip(),
        company=company.strip() if company else None,
        raw_text=raw_text.strip(),
        required_skills=analyzed.get("required_skills", []),
        preferred_skills=analyzed.get("preferred_skills", []),
        experience_requirements=analyzed.get("experience_requirements", {}),
        education_requirements=analyzed.get("education_requirements", {}),
        important_keywords=analyzed.get("important_keywords", []),
        tools_and_technologies=analyzed.get("tools_and_technologies", [])
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

def get_job_by_id(job_id: str, db: Session) -> Optional[JobDescription]:
    return db.query(JobDescription).filter(JobDescription.id == job_id).first()

def list_all_jobs(db: Session, skip: int = 0, limit: int = 50) -> List[JobDescription]:
    return db.query(JobDescription).order_by(JobDescription.created_at.desc()).offset(skip).limit(limit).all()

def delete_job(job_id: str, db: Session) -> bool:
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found.")
    db.delete(job)
    db.commit()
    return True
