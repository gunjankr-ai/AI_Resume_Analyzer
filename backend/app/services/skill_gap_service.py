from typing import List, Dict, Any
from app.ai.taxonomy import get_skill_info, SKILL_CATEGORIES

def generate_skill_gaps_for_match(
    missing_skills: List[str],
    candidate_skills: List[str]
) -> List[Dict[str, Any]]:
    """
    Generates structured skill gaps categorized into the 8 required domains:
    - Programming
    - Technical Skills
    - Frameworks
    - Databases
    - Cloud
    - Tools
    - Soft Skills
    - Domain Skills

    Checks for equivalent experience to prevent false positives.
    Provides Importance, Why it matters, and Suggested learning topic.
    """
    gaps: List[Dict[str, Any]] = []
    candidate_skills_lower = [s.lower() for s in candidate_skills]

    for skill in missing_skills:
        info = get_skill_info(skill)
        
        # Check equivalent experience
        has_equiv = False
        if info:
            for eq in info.get("equivalents", []):
                if eq.lower() in candidate_skills_lower:
                    has_equiv = True
                    break
        
        if has_equiv:
            # If resume demonstrates equivalent experience, do not penalize as a critical missing skill
            importance = "Low"
            category = info.get("category", "Technical Skills") if info else "Technical Skills"
            why_it_matters = f"The job explicitly specifies {skill}, though your resume demonstrates related experience with {info.get('equivalents', ['equivalent tools'])[0]}."
            learning_topic = f"Review migration guides and syntactic differences from {info.get('equivalents', ['equivalent technologies'])[0]} to {skill}."
        elif info:
            category = info.get("category", "Technical Skills")
            importance = info.get("importance", "High")
            why_it_matters = info.get("why_it_matters", f"{skill} is an important requirement for this engineering role.")
            learning_topic = info.get("suggested_learning_topic", f"Core concepts and modern production patterns of {skill}.")
        else:
            category = "Technical Skills"
            importance = "Medium"
            why_it_matters = f"{skill} is requested by the employer to support project delivery and system reliability."
            learning_topic = f"Foundations, architecture, and common best practices for {skill}."

        gaps.append({
            "category": category,
            "skill_name": skill,
            "importance": importance,
            "why_it_matters": why_it_matters,
            "suggested_learning_topic": learning_topic,
            "equivalent_experience_detected": has_equiv
        })

    # Sort gaps by importance: Critical > High > Medium > Low
    priority_map = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    gaps.sort(key=lambda g: priority_map.get(g["importance"], 4))
    return gaps
