from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.resume import Resume, ResumeAnalysis
from app.models.job import JobDescription
from app.models.match import JobMatch
from app.models.skill import SkillGap
from app.schemas.common import ResponseEnvelope
from app.schemas.analysis import DashboardOverviewOut, RecentMatchItem

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/overview", response_model=ResponseEnvelope[DashboardOverviewOut])
def get_dashboard_overview(db: Session = Depends(get_db)):
    """Aggregate statistics across all resumes, job descriptions, and matches."""
    resumes = db.query(Resume).all()
    jobs = db.query(JobDescription).all()
    matches = db.query(JobMatch).order_by(JobMatch.created_at.desc()).all()

    # Calculate average score
    avg_score = 0.0
    if matches:
        avg_score = round(sum(m.overall_match_percentage for m in matches) / len(matches), 1)

    # Top detected skills
    detected_counter = Counter()
    for r in resumes:
        if r.analysis:
            for s in (r.analysis.technical_skills or []):
                detected_counter[s] += 1
            for s in (r.analysis.tools_and_technologies or []):
                detected_counter[s] += 1

    top_detected = [
        {"skill": skill, "count": count}
        for skill, count in detected_counter.most_common(8)
    ]

    # Top missing skills
    missing_counter = Counter()
    gaps = db.query(SkillGap).all()
    for g in gaps:
        missing_counter[g.skill_name] += 1

    top_missing = [
        {"skill": skill, "count": count}
        for skill, count in missing_counter.most_common(8)
    ]

    # Recent matches
    recent_items = []
    for m in matches[:6]:
        cand_name = m.resume.analysis.candidate_name if (m.resume and m.resume.analysis) else "Candidate"
        job_title = m.job.title if m.job else "Target Role"
        recent_items.append(RecentMatchItem(
            id=m.id,
            resume_id=m.resume_id,
            candidate_name=cand_name,
            job_id=m.job_id,
            job_title=job_title,
            match_percentage=m.overall_match_percentage,
            created_at=m.created_at.strftime("%b %d, %Y")
        ))

    overview = DashboardOverviewOut(
        total_resumes=len(resumes),
        total_job_descriptions=len(jobs),
        total_matches=len(matches),
        average_match_score=avg_score,
        top_detected_skills=top_detected,
        top_missing_skills=top_missing,
        recent_matches=recent_items
    )
    return ResponseEnvelope(success=True, data=overview)

@router.get("/sample-data")
def get_sample_data():
    """Provides sample resume text and sample job descriptions for easy testing."""
    sample_resume = """
ALEXANDER WRIGHT
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
* AI Document Summarizer: Microservice utilizing FastAPI and vector embeddings to extract key insights from technical PDFs.
"""

    sample_job = """
Title: Senior Full-Stack Cloud Engineer
Company: Horizon Cloud Systems
Location: Remote / San Francisco, CA

About the Role:
Horizon Cloud Systems is seeking an experienced Senior Full-Stack Cloud Engineer to lead the development of our next-generation cloud intelligence platform. You will work across modern frontend frameworks and distributed backend services.

Key Responsibilities:
* Design, build, and maintain scalable microservices using Python, FastAPI, and PostgreSQL.
* Develop intuitive, accessible, and responsive user interfaces using React, TypeScript, and Tailwind CSS.
* Architect infrastructure deployments on AWS using Docker, Kubernetes, and Terraform.
* Implement robust asynchronous messaging with Redis and Kafka.
* Participate in system architecture reviews and foster an inclusive culture of engineering excellence.

Requirements:
* 5+ years of software engineering experience in modern full-stack development.
* Deep proficiency in Python and modern TypeScript/JavaScript.
* Strong hands-on experience with relational databases (PostgreSQL) and query optimization.
* Production experience with Docker containerization and CI/CD pipelines (GitHub Actions).
* Solid understanding of RESTful API design, microservices architecture, and unit testing.

Preferred Qualifications:
* Experience with cloud orchestration tools such as Kubernetes and Terraform.
* Familiarity with caching systems (Redis) and message queues (RabbitMQ or Kafka).
* Bachelor's or Master's degree in Computer Science or equivalent engineering experience.
"""

    return {
        "sample_resume": sample_resume.strip(),
        "sample_job": sample_job.strip(),
        "job_title": "Senior Full-Stack Cloud Engineer",
        "company": "Horizon Cloud Systems"
    }
