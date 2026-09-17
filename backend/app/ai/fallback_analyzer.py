import re
from typing import Dict, Any, List, Optional
from collections import Counter
from app.utils.text_cleaner import extract_contact_info, detect_sections, clean_text
from app.ai.taxonomy import find_skills_in_text, SKILL_DEFINITIONS

COMMON_DEGREES = [
    r"bachelor(?:'s)?(?:\s+of\s+[a-zA-Z\s]+)?",
    r"master(?:'s)?(?:\s+of\s+[a-zA-Z\s]+)?",
    r"ph\.?d\.?",
    r"b\.?s\.?",
    r"m\.?s\.?",
    r"b\.?tech\.?",
    r"m\.?tech\.?",
    r"b\.?e\.?",
    r"associate(?:'s)?"
]

COMMON_ROLES = [
    r"software\s+engineer",
    r"senior\s+software\s+engineer",
    r"full[- ]?stack\s+developer",
    r"full[- ]?stack\s+engineer",
    r"backend\s+developer",
    r"backend\s+engineer",
    r"frontend\s+developer",
    r"frontend\s+engineer",
    r"devops\s+engineer",
    r"cloud\s+architect",
    r"system\s+architect",
    r"data\s+engineer",
    r"machine\s+learning\s+engineer",
    r"ai\s+engineer",
    r"technical\s+lead",
    r"engineering\s+manager",
    r"product\s+manager"
]

def extract_candidate_name(text: str) -> Optional[str]:
    """Extract candidate name from the top lines of the resume."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for line in lines[:5]:
        # Skip if contains email, phone, or standard header words
        if "@" in line or any(char.isdigit() for char in line):
            continue
        lower = line.lower()
        if any(skip in lower for skip in ["resume", "curriculum", "vitae", "profile", "page", "summary"]):
            continue
        words = line.split()
        if 2 <= len(words) <= 4 and all(w[0].isupper() for w in words if w):
            return line
    return lines[0] if lines else "Candidate"

def extract_education(text: str, sections: Dict[str, str]) -> List[Dict[str, Any]]:
    """Extract structured education entries from the education section."""
    edu_text = sections.get("education", text)
    lines = [l.strip() for l in edu_text.splitlines() if l.strip()]
    entries = []
    
    current_entry: Dict[str, Any] = {}
    for line in lines:
        degree_match = None
        for pat in COMMON_DEGREES:
            m = re.search(r'\b' + pat + r'\b', line, re.IGNORECASE)
            if m:
                degree_match = m.group(0).title()
                break
        
        # Check for institution
        inst_match = re.search(r'\b(?:university|college|institute|polytechnic|academy|school)\b.*', line, re.IGNORECASE)
        # Check for year
        year_match = re.search(r'\b(19\d{2}|20\d{2})\b', line)
        # Check for GPA
        gpa_match = re.search(r'\b(?:gpa|cgpa)[:\s]*([0-4]\.\d{1,2}|[0-9]\.\d{1,2}/10)\b', line, re.IGNORECASE)

        if degree_match or inst_match or year_match:
            institution = line
            if inst_match:
                institution = line
            degree = degree_match or "Bachelor of Science"
            year = year_match.group(0) if year_match else None
            gpa = gpa_match.group(1) if gpa_match else None
            
            entries.append({
                "institution": institution,
                "degree": degree,
                "field_of_study": "Computer Science or Related Field",
                "graduation_year": year,
                "gpa": gpa
            })
            if len(entries) >= 3:
                break

    if not entries:
        # Fallback default if section is present but unstructured
        if "education" in sections:
            entries.append({
                "institution": lines[0] if lines else "University Degree",
                "degree": "Bachelor's Degree",
                "field_of_study": "Computer Science / STEM",
                "graduation_year": None,
                "gpa": None
            })

    return entries

def extract_work_experience(text: str, sections: Dict[str, str]) -> List[Dict[str, Any]]:
    """Extract structured work experience entries."""
    exp_text = sections.get("experience", text)
    lines = [l.strip() for l in exp_text.splitlines() if l.strip()]
    entries = []
    
    current_role = None
    current_company = None
    current_bullets = []
    current_dates = None

    date_pattern = re.compile(r'\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\.?\s*\d{4}\s*[-–—to]+\s*(?:present|current|now|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\.?\s*\d{4})\b', re.IGNORECASE)

    for line in lines:
        is_date = date_pattern.search(line)
        is_bullet = line.startswith(("-", "*", "•", "–")) or re.match(r'^\d+\.', line)

        if is_date and not is_bullet:
            if current_role or current_company:
                entries.append({
                    "company": current_company or "Technology Company",
                    "role": current_role or "Software Engineer",
                    "duration": current_dates or "2+ Years",
                    "start_date": current_dates.split("-")[0].strip() if current_dates and "-" in current_dates else None,
                    "end_date": current_dates.split("-")[1].strip() if current_dates and "-" in current_dates else "Present",
                    "achievements": current_bullets if current_bullets else [line]
                })
                current_bullets = []
            
            current_dates = is_date.group(0)
            # Try to get company / role from the same line or line without dates
            clean_role_line = re.sub(date_pattern, '', line).strip(" |,-")
            if clean_role_line:
                current_role = clean_role_line
            else:
                current_role = "Senior Engineer"
        elif is_bullet:
            bullet_clean = re.sub(r'^[-*•–\d.]+\s*', '', line).strip()
            if len(bullet_clean) > 10:
                current_bullets.append(bullet_clean)
        else:
            # Possible company / role line
            if len(line) < 60 and not current_company:
                current_company = line

    # Flush last entry
    if current_role or current_bullets or current_company:
        entries.append({
            "company": current_company or "Technology Organization",
            "role": current_role or "Software Engineer",
            "duration": current_dates or "Recent",
            "start_date": None,
            "end_date": "Present",
            "achievements": current_bullets if current_bullets else ["Engineered key services and collaborated with cross-functional team."]
        })

    return entries[:5]

def extract_projects(text: str, sections: Dict[str, str]) -> List[Dict[str, Any]]:
    """Extract project entries."""
    proj_text = sections.get("projects", "")
    if not proj_text:
        return []
    lines = [l.strip() for l in proj_text.splitlines() if l.strip()]
    projects = []
    curr_name = None
    curr_desc = []
    
    for line in lines:
        if line.startswith(("-", "*", "•")):
            curr_desc.append(line.lstrip("-*• "))
        elif len(line) < 50:
            if curr_name:
                projects.append({
                    "name": curr_name,
                    "description": " ".join(curr_desc) if curr_desc else "Software project implementation",
                    "technologies": [],
                    "link": None
                })
                curr_desc = []
            curr_name = line

    if curr_name:
        projects.append({
            "name": curr_name,
            "description": " ".join(curr_desc) if curr_desc else "Project implementation",
            "technologies": [],
            "link": None
        })

    return projects[:4]

def perform_keyword_analysis(text: str) -> Dict[str, Any]:
    """Calculate word frequency and identify industry terms."""
    words = re.findall(r'\b[a-zA-Z]{3,20}\b', text.lower())
    stop_words = {
        "and", "the", "with", "for", "that", "this", "from", "have", "been", "will",
        "were", "their", "which", "about", "other", "into", "more", "such", "through",
        "work", "using", "team", "used", "year", "years", "including", "across"
    }
    filtered = [w for w in words if w not in stop_words]
    counts = Counter(filtered)
    total = len(filtered) or 1
    
    top_keywords = [w for w, _ in counts.most_common(12)]
    density = {w: round((cnt / total) * 100, 2) for w, cnt in counts.most_common(8)}
    
    industry_terms = []
    for skill in SKILL_DEFINITIONS.keys():
        if skill.lower() in text.lower():
            industry_terms.append(skill)

    return {
        "top_keywords": top_keywords,
        "density": density,
        "industry_terms": list(set(industry_terms))[:15]
    }

def analyze_resume_fallback(raw_text: str) -> Dict[str, Any]:
    """
    Complete deterministic NLP resume analysis.
    Extracts structured facts and computes realistic scores, strengths, and recommendations.
    """
    clean = clean_text(raw_text)
    sections = detect_sections(clean)
    contact = extract_contact_info(clean)
    name = extract_candidate_name(clean)
    skills_by_category = find_skills_in_text(clean)
    
    # Flatten skills
    technical_skills = (
        skills_by_category.get("Programming", []) +
        skills_by_category.get("Technical Skills", []) +
        skills_by_category.get("Frameworks", [])
    )
    tools_and_tech = (
        skills_by_category.get("Databases", []) +
        skills_by_category.get("Cloud", []) +
        skills_by_category.get("Tools", [])
    )
    soft_skills = skills_by_category.get("Soft Skills", [])

    education = extract_education(clean, sections)
    work_exp = extract_work_experience(clean, sections)
    projects = extract_projects(clean, sections)

    # Detect summary
    summary_text = sections.get("summary", "")
    if not summary_text:
        # First paragraph under header
        paragraphs = clean.split("\n\n")
        if len(paragraphs) > 1 and len(paragraphs[1]) > 50:
            summary_text = paragraphs[1][:300]
        else:
            summary_text = f"Experienced professional with expertise in {', '.join(technical_skills[:4]) if technical_skills else 'software engineering'}."

    # Identify missing sections
    missing_sections = []
    standard_sections = ["summary", "experience", "education", "skills", "projects"]
    for s in standard_sections:
        if s not in sections and (s != "skills" or len(technical_skills) == 0):
            missing_sections.append(s.capitalize())

    # Calculate Resume Score (0-100)
    score = 50 # Base
    if contact.get("email"): score += 5
    if contact.get("phone"): score += 5
    if contact.get("linkedin") or contact.get("github"): score += 5
    if len(technical_skills) >= 5: score += 10
    if len(education) >= 1: score += 10
    if len(work_exp) >= 1: score += 10
    if len(projects) >= 1: score += 5
    # Check for quantifiable metrics (e.g. %, $, numbers)
    has_metrics = bool(re.search(r'\b\d+%\b|\$\d+|\b\d+x\b|\bincreased\b|\breduced\b', clean, re.IGNORECASE))
    if has_metrics: score += 10
    score = min(100, max(20, score))

    # Determine strengths
    strengths = []
    if len(technical_skills) >= 6:
        strengths.append(f"Strong demonstrated skill set across core technologies: {', '.join(technical_skills[:4])}.")
    if has_metrics:
        strengths.append("Effective use of quantifiable impact metrics (percentages, KPIs) in work descriptions.")
    if contact.get("linkedin") or contact.get("github"):
        strengths.append("Professional profile links (LinkedIn/GitHub) are clearly accessible.")
    if len(work_exp) >= 2:
        strengths.append("Demonstrated career progression across multiple engineering engagements.")
    if not strengths:
        strengths.append("Clear foundational technical terminology and educational background.")

    # Determine weaknesses & suggestions
    weaknesses = []
    suggestions = []
    if missing_sections:
        weaknesses.append(f"Missing recommended resume section(s): {', '.join(missing_sections)}.")
        suggestions.append(f"Add dedicated sections for {', '.join(missing_sections)} to pass ATS parsers cleanly.")
    if not has_metrics:
        weaknesses.append("Descriptions focus mostly on duties rather than measurable results and business outcomes.")
        suggestions.append("Apply the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]' with specific numbers.")
    if not contact.get("github"):
        weaknesses.append("Missing public code portfolio or GitHub profile link.")
        suggestions.append("Include a link to an active GitHub profile or technical portfolio to showcase real code.")
    if len(tools_and_tech) < 3:
        weaknesses.append("Limited explicit mentions of cloud infrastructure (AWS/GCP), CI/CD pipelines, or containerization.")
        suggestions.append("Highlight hands-on experience with Docker, CI/CD pipelines, and cloud services (AWS/GCP/Azure).")

    keyword_analysis = perform_keyword_analysis(clean)

    return {
        "candidate_name": name,
        "contact_info": contact,
        "summary": summary_text,
        "education": education,
        "work_experience": work_exp,
        "projects": projects,
        "certifications": [],
        "technical_skills": list(set(technical_skills)),
        "soft_skills": list(set(soft_skills)) if soft_skills else ["Communication", "Problem Solving", "Team Collaboration"],
        "tools_and_technologies": list(set(tools_and_tech)),
        "resume_score": score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvement_suggestions": suggestions,
        "missing_sections": missing_sections,
        "keyword_analysis": keyword_analysis
    }

def analyze_job_fallback(raw_text: str, title: str) -> Dict[str, Any]:
    """
    Extracts required skills, experience, education, and keywords from job description text.
    """
    clean = clean_text(raw_text)
    detected_skills = find_skills_in_text(clean)
    
    # Flatten detected skills
    all_tech = (
        detected_skills.get("Programming", []) +
        detected_skills.get("Frameworks", []) +
        detected_skills.get("Technical Skills", [])
    )
    tools_and_cloud = (
        detected_skills.get("Databases", []) +
        detected_skills.get("Cloud", []) +
        detected_skills.get("Tools", [])
    )

    # Required vs preferred
    # Split text into required vs preferred if headings exist
    req_split = re.split(r'(?:preferred|nice to have|plus|bonus)', clean, flags=re.IGNORECASE)
    req_text = req_split[0]
    pref_text = req_split[1] if len(req_split) > 1 else ""

    required_skills = []
    preferred_skills = []

    for s in all_tech:
        if s.lower() in pref_text.lower() and s.lower() not in req_text.lower():
            preferred_skills.append(s)
        else:
            required_skills.append(s)

    # Extract years of experience
    exp_match = re.search(r'(\d+)\+?\s*(?:-\s*(\d+))?\s*(?:years|yrs)(?:\s+of)?\s+experience', clean, re.IGNORECASE)
    min_years = 3.0
    pref_years = 5.0
    if exp_match:
        min_years = float(exp_match.group(1))
        if exp_match.group(2):
            pref_years = float(exp_match.group(2))
        else:
            pref_years = min_years + 2.0

    # Seniority level
    seniority = "Mid-Level"
    title_lower = title.lower()
    if any(w in title_lower for w in ["senior", "sr", "staff", "principal", "lead"]):
        seniority = "Senior"
    elif any(w in title_lower for w in ["junior", "jr", "entry", "associate", "intern"]):
        seniority = "Junior / Entry"

    # Education requirements
    degree = "Bachelor's Degree"
    if "master" in clean.lower():
        degree = "Master's Degree (Preferred)"

    kw_analysis = perform_keyword_analysis(clean)

    return {
        "required_skills": required_skills[:12],
        "preferred_skills": preferred_skills[:8],
        "experience_requirements": {
            "min_years": min_years,
            "preferred_years": pref_years,
            "seniority_level": seniority
        },
        "education_requirements": {
            "minimum_degree": degree,
            "preferred_fields": ["Computer Science", "Software Engineering", "Information Technology"]
        },
        "important_keywords": kw_analysis.get("top_keywords", [])[:10],
        "tools_and_technologies": tools_and_cloud[:10]
    }
