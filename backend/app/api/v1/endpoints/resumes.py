from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.common import ResponseEnvelope
from app.schemas.resume import ResumeOut, ResumeListItem, ResumeAnalysisOut
from app.services.resume_service import (
    create_resume_from_upload,
    create_sample_resume,
    get_resume_by_id,
    list_all_resumes,
    analyze_and_store_resume,
    delete_resume_and_data
)

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResponseEnvelope[ResumeOut], status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and validate a PDF or DOCX resume, extract its text content,
    and trigger automated AI/NLP candidate profiling.
    """
    content = await file.read()
    resume = create_resume_from_upload(file, content, db)
    return ResponseEnvelope(
        success=True,
        message="Resume uploaded and analyzed successfully.",
        data=ResumeOut.model_validate(resume)
    )

@router.post("/load-sample", response_model=ResponseEnvelope[ResumeOut], status_code=status.HTTP_201_CREATED)
def load_sample_resume(
    db: Session = Depends(get_db)
):
    """
    Convenience endpoint for instant testing: loads, parses, and profiles
    the preloaded senior engineer resume in one click.
    """
    resume = create_sample_resume(db)
    return ResponseEnvelope(
        success=True,
        message="Sample resume loaded and analyzed.",
        data=ResumeOut.model_validate(resume)
    )

@router.get("", response_model=ResponseEnvelope[List[ResumeListItem]])
def list_resumes(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List all uploaded resumes with summary information."""
    resumes = list_all_resumes(db, skip=skip, limit=limit)
    items = []
    for r in resumes:
        items.append(ResumeListItem(
            id=r.id,
            file_name=r.file_name,
            file_type=r.file_type,
            file_size_bytes=r.file_size_bytes,
            candidate_name=r.analysis.candidate_name if r.analysis else "Candidate",
            resume_score=r.analysis.resume_score if r.analysis else None,
            created_at=r.created_at
        ))
    return ResponseEnvelope(success=True, data=items)

@router.get("/{resume_id}", response_model=ResponseEnvelope[ResumeOut])
def get_resume(
    resume_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve full resume details including extracted text and analysis."""
    resume = get_resume_by_id(resume_id, db)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return ResponseEnvelope(success=True, data=ResumeOut.model_validate(resume))

@router.post("/{resume_id}/analyze", response_model=ResponseEnvelope[ResumeAnalysisOut])
def trigger_resume_analysis(
    resume_id: str,
    db: Session = Depends(get_db)
):
    """Re-run AI/NLP analysis on an existing resume."""
    analysis = analyze_and_store_resume(resume_id, db)
    return ResponseEnvelope(
        success=True,
        message="Resume analysis refreshed.",
        data=ResumeAnalysisOut.model_validate(analysis)
    )

@router.get("/{resume_id}/analysis", response_model=ResponseEnvelope[ResumeAnalysisOut])
def get_resume_analysis(
    resume_id: str,
    db: Session = Depends(get_db)
):
    """Get standalone analysis data (skills, scores, suggestions, strengths)."""
    resume = get_resume_by_id(resume_id, db)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    if not resume.analysis:
        analysis = analyze_and_store_resume(resume_id, db)
        return ResponseEnvelope(success=True, data=ResumeAnalysisOut.model_validate(analysis))
    return ResponseEnvelope(success=True, data=ResumeAnalysisOut.model_validate(resume.analysis))

@router.delete("/{resume_id}", status_code=status.HTTP_200_OK)
def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db)
):
    """
    Privacy & Data Deletion: Permanently purges the uploaded resume,
    the stored file on disk, and all associated match/analysis records.
    """
    delete_resume_and_data(resume_id, db)
    return {"success": True, "message": "Resume and associated data permanently purged."}
