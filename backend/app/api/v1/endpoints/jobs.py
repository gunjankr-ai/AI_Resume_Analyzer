from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.common import ResponseEnvelope
from app.schemas.job import JobDescriptionCreate, JobDescriptionOut
from app.services.job_service import (
    create_and_analyze_job,
    get_job_by_id,
    list_all_jobs,
    delete_job
)

router = APIRouter(prefix="/jobs", tags=["Job Descriptions"])

@router.post("", response_model=ResponseEnvelope[JobDescriptionOut], status_code=status.HTTP_201_CREATED)
def submit_and_analyze_job(
    payload: JobDescriptionCreate,
    db: Session = Depends(get_db)
):
    """
    Submit and parse a job description to extract required skills,
    preferred skills, experience benchmarks, and domain keywords.
    """
    job = create_and_analyze_job(
        title=payload.title,
        raw_text=payload.raw_text,
        company=payload.company,
        db=db
    )
    return ResponseEnvelope(
        success=True,
        message="Job description analyzed successfully.",
        data=JobDescriptionOut.model_validate(job)
    )

@router.get("", response_model=ResponseEnvelope[List[JobDescriptionOut]])
def list_jobs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List stored job descriptions."""
    jobs = list_all_jobs(db, skip=skip, limit=limit)
    return ResponseEnvelope(
        success=True,
        data=[JobDescriptionOut.model_validate(j) for j in jobs]
    )

@router.get("/{job_id}", response_model=ResponseEnvelope[JobDescriptionOut])
def get_job(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Get parsed job description requirements by ID."""
    job = get_job_by_id(job_id, db)
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found.")
    return ResponseEnvelope(success=True, data=JobDescriptionOut.model_validate(job))

@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
def remove_job(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Delete a job description and its matches."""
    delete_job(job_id, db)
    return {"success": True, "message": "Job description deleted."}
