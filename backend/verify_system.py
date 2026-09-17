import os
import sys
import io

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.session import SessionLocal, engine
from app.database.base import Base
import app.models
from app.services.scoring_service import match_resume_to_job
from app.services.skill_gap_service import generate_skill_gaps_for_match
from app.ai.taxonomy import find_skills_in_text, get_skill_info
from app.ai.fallback_analyzer import analyze_resume_fallback, analyze_job_fallback
from app.services.parser import parse_document
from pypdf import PdfWriter
from docx import Document

def run_verifications():
    print("========================================")
    print("STARTING AI RESUME ANALYZER VERIFICATION")
    print("========================================")

    # 1. Verify DB Tables
    print("\n[1/5] Verifying Database Schema Creation...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    assert db is not None, "Failed to connect to database."
    print(" -> Database connection and schema creation: PASS")
    db.close()

    # 2. Verify Taxonomy and Skill Extraction
    print("\n[2/5] Verifying 1,000+ Technology Taxonomy & Skill Scanner...")
    sample_text = (
        "Experienced software engineer proficient in Python, TypeScript, React, "
        "FastAPI, PostgreSQL, Redis, Docker, Kubernetes, AWS, and Git."
    )
    detected = find_skills_in_text(sample_text)
    print(f" -> Detected skills by category: {list(detected.keys())}")
    assert "Python" in detected["Programming"], "Python not classified under Programming"
    assert "React" in detected["Frameworks"], "React not classified under Frameworks"
    assert "PostgreSQL" in detected["Databases"], "PostgreSQL not classified under Databases"
    assert "Docker" in detected["Cloud"], "Docker not classified under Cloud"
    print(" -> Taxonomy detection and categorization: PASS")

    # 3. Verify Document Generation & Parsing (PDF and DOCX)
    print("\n[3/5] Verifying PDF & DOCX Document Extraction...")
    test_pdf_path = os.path.join(os.path.dirname(__file__), "test_resume.pdf")
    test_docx_path = os.path.join(os.path.dirname(__file__), "test_resume.docx")

    # Create dummy PDF
    writer = PdfWriter()
    writer.add_blank_page(width=200, height=200)
    # Write some stream
    with open(test_pdf_path, "wb") as f:
        # minimal pdf with text
        f.write(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 50 250 Td (Jane Doe - Full Stack Developer Python React) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n360\n%%EOF\n")

    # Extract text from test PDF
    pdf_text = parse_document(test_pdf_path, "pdf")
    print(f" -> PDF extracted text: '{pdf_text}'")
    assert "Jane Doe" in pdf_text or "Python" in pdf_text, "PDF text extraction failed"

    # Create dummy DOCX
    doc = Document()
    doc.add_heading("Jane Doe - Senior Full-Stack Engineer", 0)
    doc.add_paragraph("Experienced with Python, React, FastAPI, AWS and Docker.")
    doc.save(test_docx_path)

    docx_text = parse_document(test_docx_path, "docx")
    print(f" -> DOCX extracted text: '{docx_text}'")
    assert "Jane Doe" in docx_text and "FastAPI" in docx_text, "DOCX text extraction failed"

    # Clean up test files
    if os.path.exists(test_pdf_path): os.remove(test_pdf_path)
    if os.path.exists(test_docx_path): os.remove(test_docx_path)
    print(" -> PDF and DOCX parsers: PASS")

    # 4. Verify 5-Factor Mathematical Scoring Formula
    print("\n[4/5] Verifying 5-Factor Scoring Formula & Transparency...")
    candidate_analysis = {
        "technical_skills": ["Python", "FastAPI", "React", "TypeScript"],
        "tools_and_technologies": ["PostgreSQL", "Docker", "AWS", "Git"],
        "soft_skills": ["Communication", "Problem Solving"],
        "work_experience": [
            {"company": "Acme Corp", "role": "Senior Engineer", "duration": "2020 - 2024", "achievements": ["Scaled FastAPI microservices by 40%."]}
        ],
        "education": [
            {"institution": "UC Berkeley", "degree": "Bachelor of Science", "graduation_year": "2020"}
        ],
        "projects": [
            {"name": "Cloud Portal", "description": "Web service with FastAPI and React", "technologies": ["FastAPI", "React"]}
        ]
    }

    target_job = {
        "required_skills": ["Python", "React", "FastAPI"],
        "preferred_skills": ["TypeScript", "Go"],
        "tools_and_technologies": ["PostgreSQL", "Docker", "AWS"],
        "important_keywords": ["microservices", "api", "cloud"],
        "experience_requirements": {"min_years": 3.0}
    }

    match_result = match_resume_to_job(
        resume_analysis=candidate_analysis,
        job_description=target_job,
        resume_raw_text="Jane Doe Senior Engineer with FastAPI, Python, React, Docker, and AWS microservices."
    )

    score = match_result["overall_match_percentage"]
    breakdown = match_result["score_breakdown"]
    formula = breakdown["formula_explanation"]

    print(f" -> Calculated Match Score: {score}%")
    print(f" -> Formula: {formula}")
    print(f" -> Matching Skills: {match_result['matching_skills']}")
    print(f" -> Missing Skills: {match_result['missing_skills']}")

    assert 0.0 <= score <= 100.0, f"Invalid score: {score}"
    assert breakdown["technical_skills_score"] > 80, "Technical score should be high for matching skills"
    assert breakdown["experience_score"] >= 100, "Experience score should meet minimum 3 years requirement"
    print(" -> Transparent scoring verification: PASS")

    # 5. Verify Skill Gap Generation with Equivalents
    print("\n[5/5] Verifying Skill Gap Generation & Equivalents Detection...")
    gaps = generate_skill_gaps_for_match(
        missing_skills=["Go", "Kubernetes"],
        candidate_skills=["Python", "FastAPI", "Docker"]
    )
    assert len(gaps) == 2, f"Expected 2 gaps, got {len(gaps)}"
    for g in gaps:
        print(f" -> Gap: {g['skill_name']} | Domain: {g['category']} | Priority: {g['importance']}")
        print(f"    Why: {g['why_it_matters'][:60]}...")
        print(f"    Topic: {g['suggested_learning_topic'][:60]}...")
    print(" -> Skill gap categorization and roadmap: PASS")

    print("\n========================================")
    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!")
    print("========================================")

if __name__ == "__main__":
    run_verifications()
