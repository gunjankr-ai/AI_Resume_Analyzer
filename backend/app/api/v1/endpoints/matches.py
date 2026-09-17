import uuid
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.resume import Resume, ResumeAnalysis
from app.models.job import JobDescription
from app.models.match import JobMatch
from app.models.skill import SkillGap
from app.schemas.common import ResponseEnvelope
from app.schemas.match import JobMatchOut, JobMatchRequest, QuickCompareRequest
from app.schemas.analysis import SkillGapOut, SkillGapSummary
from app.services.scoring_service import match_resume_to_job
from app.services.skill_gap_service import generate_skill_gaps_for_match
from app.services.job_service import create_and_analyze_job
from app.services.resume_service import analyze_and_store_resume

router = APIRouter(prefix="/matches", tags=["Job Matching"])

def run_and_persist_match(resume: Resume, job: JobDescription, db: Session) -> JobMatch:
    """Executes transparent match scoring and creates JobMatch + SkillGaps."""
    if not resume.analysis:
        resume.analysis = analyze_and_store_resume(resume.id, db)

    analysis_dict = {
        "technical_skills": resume.analysis.technical_skills or [],
        "tools_and_technologies": resume.analysis.tools_and_technologies or [],
        "soft_skills": resume.analysis.soft_skills or [],
        "work_experience": resume.analysis.work_experience or [],
        "education": resume.analysis.education or [],
        "projects": resume.analysis.projects or []
    }

    job_dict = {
        "required_skills": job.required_skills or [],
        "preferred_skills": job.preferred_skills or [],
        "tools_and_technologies": job.tools_and_technologies or [],
        "important_keywords": job.important_keywords or [],
        "experience_requirements": job.experience_requirements or {}
    }

    match_result = match_resume_to_job(
        resume_analysis=analysis_dict,
        job_description=job_dict,
        resume_raw_text=resume.raw_text
    )

    match_id = str(uuid.uuid4())
    job_match = JobMatch(
        id=match_id,
        resume_id=resume.id,
        job_id=job.id,
        overall_match_percentage=match_result["overall_match_percentage"],
        score_breakdown=match_result["score_breakdown"],
        matching_skills=match_result["matching_skills"],
        missing_skills=match_result["missing_skills"],
        matching_experience=match_result["matching_experience"],
        missing_keywords=match_result["missing_keywords"],
        relevant_projects=match_result["relevant_projects"]
    )
    db.add(job_match)

    # Generate and persist skill gaps
    all_candidate_skills = (
        (resume.analysis.technical_skills or []) +
        (resume.analysis.tools_and_technologies or [])
    )
    gaps_data = generate_skill_gaps_for_match(
        missing_skills=match_result["missing_skills"],
        candidate_skills=all_candidate_skills
    )

    for g in gaps_data:
        gap_record = SkillGap(
            id=str(uuid.uuid4()),
            match_id=match_id,
            category=g["category"],
            skill_name=g["skill_name"],
            importance=g["importance"],
            why_it_matters=g["why_it_matters"],
            suggested_learning_topic=g["suggested_learning_topic"],
            equivalent_experience_detected=g["equivalent_experience_detected"]
        )
        db.add(gap_record)

    db.commit()
    db.refresh(job_match)
    return job_match

@router.post("/compare", response_model=ResponseEnvelope[JobMatchOut], status_code=status.HTTP_201_CREATED)
def compare_resume_with_job(
    payload: JobMatchRequest,
    db: Session = Depends(get_db)
):
    """
    Compares an uploaded resume with an existing job description.
    Calculates 5-factor mathematical match score, missing skills, and relevant projects.
    """
    resume = db.query(Resume).filter(Resume.id == payload.resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    job = db.query(JobDescription).filter(JobDescription.id == payload.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found.")

    job_match = run_and_persist_match(resume, job, db)
    return ResponseEnvelope(
        success=True,
        message="Match analysis completed successfully.",
        data=JobMatchOut.model_validate(job_match)
    )

@router.post("/quick-compare", response_model=ResponseEnvelope[JobMatchOut], status_code=status.HTTP_201_CREATED)
def quick_compare(
    payload: QuickCompareRequest,
    db: Session = Depends(get_db)
):
    """
    All-in-one endpoint: Parses a pasted job description, matches against the resume,
    and returns full scores, breakdown, and skill gaps in a single round-trip.
    """
    resume = db.query(Resume).filter(Resume.id == payload.resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    # Create job description
    job = create_and_analyze_job(
        title=payload.job_title,
        raw_text=payload.job_text,
        company=payload.company,
        db=db
    )

    job_match = run_and_persist_match(resume, job, db)
    return ResponseEnvelope(
        success=True,
        message="Job created and match analysis completed.",
        data=JobMatchOut.model_validate(job_match)
    )

@router.get("/{match_id}", response_model=ResponseEnvelope[JobMatchOut])
def get_match_result(
    match_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve full match score breakdown and project alignment."""
    match = db.query(JobMatch).filter(JobMatch.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match result not found.")
    return ResponseEnvelope(success=True, data=JobMatchOut.model_validate(match))

@router.get("/{match_id}/skill-gaps", response_model=ResponseEnvelope[SkillGapSummary])
def get_skill_gaps(
    match_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve structured skill gaps grouped across the 8 standard domains."""
    match = db.query(JobMatch).filter(JobMatch.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match result not found.")

    gaps = db.query(SkillGap).filter(SkillGap.match_id == match_id).all()
    categories_dict: Dict[str, List[SkillGapOut]] = {}
    
    crit_count = 0
    high_count = 0

    for g in gaps:
        out = SkillGapOut.model_validate(g)
        if out.importance == "Critical":
            crit_count += 1
        elif out.importance == "High":
            high_count += 1
            
        if out.category not in categories_dict:
            categories_dict[out.category] = []
        categories_dict[out.category].append(out)

    summary = SkillGapSummary(
        match_id=match_id,
        total_gaps=len(gaps),
        critical_gaps_count=crit_count,
        high_gaps_count=high_count,
        categories=categories_dict
    )
    return ResponseEnvelope(success=True, data=summary)
