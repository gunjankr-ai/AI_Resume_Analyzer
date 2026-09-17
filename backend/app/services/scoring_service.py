import re
from typing import Dict, Any, List, Tuple
from app.ai.taxonomy import get_skill_info, find_skills_in_text

def normalize_skill(skill: str) -> str:
    """Normalize skill string for fair comparison."""
    return skill.strip().lower()

def check_skill_match(candidate_skills: List[str], target_skill: str) -> Tuple[bool, bool]:
    """
    Returns (direct_match: bool, equivalent_match: bool)
    """
    target_norm = normalize_skill(target_skill)
    target_info = get_skill_info(target_skill)
    equivalents = [normalize_skill(e) for e in target_info.get("equivalents", [])] if target_info else []

    candidate_norms = [normalize_skill(s) for s in candidate_skills]

    # Direct match
    if target_norm in candidate_norms:
        return True, False

    # Check aliases
    if target_info:
        for alias in target_info.get("aliases", []):
            if normalize_skill(alias) in candidate_norms:
                return True, False

    # Check equivalents
    for eq in equivalents:
        if eq in candidate_norms:
            return False, True

    return False, False

def calculate_candidate_years(work_experience: List[Dict[str, Any]]) -> float:
    """Estimate total candidate experience in years from work history."""
    if not work_experience:
        return 2.0  # Conservative estimate
    
    total_years = 0.0
    year_pattern = re.compile(r'\b(19\d{2}|20\d{2})\b')

    for exp in work_experience:
        duration_str = str(exp.get("duration", ""))
        # Check if duration mentions years directly e.g. "3 years"
        yr_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:years|yrs)', duration_str, re.IGNORECASE)
        if yr_match:
            total_years += float(yr_match.group(1))
            continue

        # Check start and end years
        dates = year_pattern.findall(duration_str)
        if len(dates) >= 2:
            diff = int(dates[1]) - int(dates[0])
            total_years += max(1.0, float(diff))
        elif len(dates) == 1:
            # e.g. "2021 - Present"
            total_years += max(1.0, 2026 - int(dates[0]))
        else:
            total_years += 1.5

    return round(min(25.0, max(1.0, total_years)), 1)

def match_resume_to_job(
    resume_analysis: Dict[str, Any],
    job_description: Dict[str, Any],
    resume_raw_text: str
) -> Dict[str, Any]:
    """
    Computes a completely transparent, weighted match score between a resume and job description.
    """
    candidate_tech = resume_analysis.get("technical_skills", [])
    candidate_tools = resume_analysis.get("tools_and_technologies", [])
    candidate_all_skills = candidate_tech + candidate_tools + resume_analysis.get("soft_skills", [])

    req_skills = job_description.get("required_skills", [])
    pref_skills = job_description.get("preferred_skills", [])
    job_tools = job_description.get("tools_and_technologies", [])
    job_keywords = job_description.get("important_keywords", [])

    # 1. Technical Skills Score (35% weight)
    matching_skills = []
    missing_skills = []
    matched_req_count = 0
    matched_pref_count = 0

    for s in req_skills:
        direct, equiv = check_skill_match(candidate_all_skills, s)
        if direct:
            matching_skills.append(s)
            matched_req_count += 1
        elif equiv:
            matching_skills.append(f"{s} (Equivalent experience)")
            matched_req_count += 0.85
        else:
            missing_skills.append(s)

    for s in pref_skills:
        direct, equiv = check_skill_match(candidate_all_skills, s)
        if direct:
            matching_skills.append(s)
            matched_pref_count += 1
        elif equiv:
            matching_skills.append(f"{s} (Equivalent)")
            matched_pref_count += 0.85
        else:
            if s not in missing_skills:
                missing_skills.append(s)

    total_req = len(req_skills) or 1
    total_pref = len(pref_skills) or 1
    req_ratio = min(1.0, matched_req_count / total_req)
    pref_ratio = min(1.0, matched_pref_count / total_pref) if pref_skills else 1.0
    tech_skills_score = round(((req_ratio * 0.75) + (pref_ratio * 0.25)) * 100, 1)

    # 2. Tools & Infrastructure Score (15% weight)
    matched_tools = 0
    for t in job_tools:
        direct, equiv = check_skill_match(candidate_tools + candidate_tech, t)
        if direct or equiv:
            matched_tools += 1
            if t not in matching_skills:
                matching_skills.append(t)
        else:
            if t not in missing_skills:
                missing_skills.append(t)

    tools_score = round((matched_tools / (len(job_tools) or 1)) * 100, 1)
    tools_score = min(100.0, tools_score)

    # 3. Experience Score (25% weight)
    exp_req = job_description.get("experience_requirements", {})
    min_years_req = float(exp_req.get("min_years", 3.0) or 3.0)
    candidate_years = calculate_candidate_years(resume_analysis.get("work_experience", []))
    
    exp_ratio = candidate_years / min_years_req
    experience_score = round(min(100.0, exp_ratio * 100), 1)

    # 4. Education Score (10% weight)
    edu_list = resume_analysis.get("education", [])
    has_degree = len(edu_list) > 0
    education_score = 95.0 if has_degree else 60.0

    # 5. Keyword Overlap Score (15% weight)
    resume_text_lower = resume_raw_text.lower()
    matched_kws = []
    missing_kws = []
    for kw in job_keywords:
        if kw.lower() in resume_text_lower:
            matched_kws.append(kw)
        else:
            missing_kws.append(kw)

    keyword_score = round((len(matched_kws) / (len(job_keywords) or 1)) * 100, 1) if job_keywords else 85.0

    # Overall Match Formula
    overall = (
        (tech_skills_score * 0.35) +
        (tools_score * 0.15) +
        (experience_score * 0.25) +
        (education_score * 0.10) +
        (keyword_score * 0.15)
    )
    overall_percentage = round(min(100.0, max(0.0, overall)), 1)

    formula_explanation = (
        f"Match Score ({overall_percentage}%) = "
        f"(Tech Skills: {tech_skills_score}% × 35%) + "
        f"(Tools & Cloud: {tools_score}% × 15%) + "
        f"(Experience: {experience_score}% × 25%) + "
        f"(Education: {education_score}% × 10%) + "
        f"(Keywords: {keyword_score}% × 15%)"
    )

    # Match Relevant Projects
    projects = resume_analysis.get("projects", [])
    relevant_projects = []
    for p in projects:
        p_name = p.get("name", "Project")
        p_desc = p.get("description", "")
        p_tech = p.get("technologies", [])
        overlap = [t for t in p_tech if t.lower() in [s.lower() for s in (req_skills + job_tools)]]
        if overlap or any(kw.lower() in p_desc.lower() for kw in job_keywords[:5]):
            relevant_projects.append({
                "name": p_name,
                "description": p_desc,
                "technologies": p_tech,
                "match_reason": f"Demonstrates hands-on application of {', '.join(overlap) if overlap else 'relevant domain techniques'}."
            })

    return {
        "overall_match_percentage": overall_percentage,
        "score_breakdown": {
            "technical_skills_score": tech_skills_score,
            "tools_score": tools_score,
            "experience_score": experience_score,
            "education_score": education_score,
            "keyword_score": keyword_score,
            "weights": {
                "technical_skills": 0.35,
                "tools_cloud_db": 0.15,
                "experience": 0.25,
                "education": 0.10,
                "keywords": 0.15
            },
            "formula_explanation": formula_explanation
        },
        "matching_skills": list(dict.fromkeys(matching_skills)),
        "missing_skills": list(dict.fromkeys(missing_skills)),
        "matching_experience": {
            "years_matched": candidate_years,
            "required_years": min_years_req,
            "relevant_roles": [exp.get("role", "") for exp in resume_analysis.get("work_experience", [])[:3]],
            "details": f"Candidate possesses {candidate_years} estimated years of experience versus {min_years_req} years required."
        },
        "missing_keywords": missing_kws[:12],
        "relevant_projects": relevant_projects
    }
