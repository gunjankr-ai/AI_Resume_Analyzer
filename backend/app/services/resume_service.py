import os
import uuid
from typing import Optional, List
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.config.settings import settings
from app.models.resume import Resume, ResumeAnalysis
from app.utils.file_validator import validate_uploaded_file
from app.services.parser import parse_document
from app.ai.llm_client import analyze_resume_ai

def create_resume_from_upload(file: UploadFile, content: bytes, db: Session) -> Resume:
    """Validates file, writes to disk, extracts text, and stores in database."""
    base_name, ext = validate_uploaded_file(file, content)
    
    unique_id = str(uuid.uuid4())
    stored_filename = f"{unique_id}_{base_name}"
    file_path = os.path.join(settings.UPLOAD_DIR, stored_filename)
    
    with open(file_path, "wb") as f:
        f.write(content)

    # Extract text from document
    raw_text = parse_document(file_path, ext)

    resume = Resume(
        id=unique_id,
        file_name=base_name,
        file_type=ext,
        file_size_bytes=len(content),
        file_path=file_path,
        raw_text=raw_text
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Trigger automatic initial analysis
    analyze_and_store_resume(resume.id, db)
    db.refresh(resume)

    return resume

def analyze_and_store_resume(resume_id: str, db: Session) -> ResumeAnalysis:
    """Runs AI/NLP analysis on resume and saves/updates analysis record."""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    analysis_data = analyze_resume_ai(resume.raw_text)

    # Check if analysis already exists
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.resume_id == resume_id).first()
    if not analysis:
        analysis = ResumeAnalysis(
            id=str(uuid.uuid4()),
            resume_id=resume_id
        )
        db.add(analysis)

    analysis.candidate_name = analysis_data.get("candidate_name")
    analysis.contact_info = analysis_data.get("contact_info", {})
    analysis.summary = analysis_data.get("summary")
    analysis.education = analysis_data.get("education", [])
    analysis.work_experience = analysis_data.get("work_experience", [])
    analysis.projects = analysis_data.get("projects", [])
    analysis.certifications = analysis_data.get("certifications", [])
    analysis.technical_skills = analysis_data.get("technical_skills", [])
    analysis.soft_skills = analysis_data.get("soft_skills", [])
    analysis.tools_and_technologies = analysis_data.get("tools_and_technologies", [])
    analysis.resume_score = analysis_data.get("resume_score", 70)
    analysis.strengths = analysis_data.get("strengths", [])
    analysis.weaknesses = analysis_data.get("weaknesses", [])
    analysis.improvement_suggestions = analysis_data.get("improvement_suggestions", [])
    analysis.missing_sections = analysis_data.get("missing_sections", [])
    analysis.keyword_analysis = analysis_data.get("keyword_analysis", {})

    db.commit()
    db.refresh(analysis)
    return analysis

def get_resume_by_id(resume_id: str, db: Session) -> Optional[Resume]:
    return db.query(Resume).filter(Resume.id == resume_id).first()

def list_all_resumes(db: Session, skip: int = 0, limit: int = 50) -> List[Resume]:
    return db.query(Resume).order_by(Resume.created_at.desc()).offset(skip).limit(limit).all()

def delete_resume_and_data(resume_id: str, db: Session) -> bool:
    """Deletes resume, associated disk file, and cascades database deletions."""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    # Remove file from disk
    if os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except OSError:
            pass

    db.delete(resume)
    db.commit()
    return True

def create_sample_resume(db: Session) -> Resume:
    """Generates and parses a preloaded senior engineer resume in DOCX format."""
    from docx import Document
    sample_text = """ALEXANDER WRIGHT
San Francisco, CA | (415) 555-0192 | alex.wright@email.com | github.com/alexwright | linkedin.com/in/alexwright

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 6+ years of experience designing and deploying distributed cloud web applications. Proven track record improving system latency by 45% and leading engineering teams across React, TypeScript, Python, FastAPI, and AWS microservice environments.

WORK EXPERIENCE
Senior Full-Stack Engineer | TechNova Solutions | San Francisco, CA | 2022 - Present
* Architected and delivered high-concurrency microservices using FastAPI, Python, and PostgreSQL, handling 15M+ daily requests.
* Spearheaded migration from legacy monolithic frontend to React, TypeScript, and Tailwind CSS, reducing page load times by 42%.
* Implemented distributed caching layer with Redis, reducing primary database load by 35% during peak traffic spikes.
* Mentored 5 junior and mid-level software engineers through structured code reviews and system architecture design sessions.

Full-Stack Developer | Apex Digital Systems | San Jose, CA | 2019 - 2022
* Engineered RESTful APIs and interactive web portals utilizing Node.js, Express, React, and MongoDB.
* Automated CI/CD pipelines via GitHub Actions and Docker containers, cutting release deployment duration from 4 hours to 15 minutes.
* Integrated Stripe payment gateway with webhook verification and zero-downtime ledger reconciliation.
* Collaborated in 2-week Agile/Scrum sprints with product managers and UX designers to deliver enterprise customer dashboards.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2015 - 2019
GPA: 3.82 / 4.0 | Dean's Honor List

TECHNICAL SKILLS
* Programming: Python, TypeScript, JavaScript, SQL, Go, HTML5, CSS3
* Frameworks: React, Next.js, FastAPI, Node.js, Express, Tailwind CSS
* Databases: PostgreSQL, MongoDB, Redis, SQLAlchemy
* Cloud & DevOps: AWS (EC2, S3, Lambda, ECS), Docker, Kubernetes, CI/CD (GitHub Actions), Linux
* Practices: System Design, Microservices, REST APIs, GraphQL, Unit Testing (Pytest, Jest), Agile/Scrum

KEY PROJECTS
* CloudScale Analytics Platform: High-throughput telemetry processing pipeline built with Go, Redis, and React dashboard.
* AI Document Summarizer: Microservice utilizing FastAPI and vector embeddings to extract key insights from technical PDFs."""

    unique_id = str(uuid.uuid4())
    filename = f"{unique_id}_Alexander_Wright_Resume.docx"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    doc = Document()
    for line in sample_text.splitlines():
        if line.strip():
            doc.add_paragraph(line.strip())
    doc.save(file_path)

    size = os.path.getsize(file_path)
    raw_text = parse_document(file_path, "docx")

    resume = Resume(
        id=unique_id,
        file_name="Alexander_Wright_Resume.docx",
        file_type="docx",
        file_size_bytes=size,
        file_path=file_path,
        raw_text=raw_text
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    analyze_and_store_resume(resume.id, db)
    db.refresh(resume)
    return resume

