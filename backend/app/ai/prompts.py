RESUME_ANALYSIS_SYSTEM_PROMPT = """
You are an expert Executive Technical Recruiter and ATS (Applicant Tracking System) Specialist.
Analyze the provided resume text thoroughly.

CRITICAL INSTRUCTIONS:
1. NEVER invent or hallucinate facts that do not exist in the resume text. Clearly distinguish extracted facts from suggestions.
2. If contact information, links, or dates are missing in the text, leave them null or empty.
3. Quantifiable achievements and metrics are critical. Identify whether bullets demonstrate measurable business impact.
4. Output MUST be valid JSON adhering exactly to the requested schema.
"""

RESUME_ANALYSIS_USER_PROMPT = """
Resume Text:
---
{raw_text}
---

Return a JSON object with this exact structure:
{{
  "candidate_name": "Full Name or null",
  "contact_info": {{
    "email": "email or null",
    "phone": "phone or null",
    "linkedin": "url or null",
    "github": "url or null",
    "portfolio": "url or null",
    "location": "City, Country or null"
  }},
  "summary": "Professional summary or null",
  "education": [
    {{
      "institution": "University / College name",
      "degree": "Degree name",
      "field_of_study": "Field or null",
      "graduation_year": "Year or null",
      "gpa": "GPA or null"
    }}
  ],
  "work_experience": [
    {{
      "company": "Company name",
      "role": "Job title",
      "start_date": "Start date or null",
      "end_date": "End date or Present",
      "duration": "e.g. 2 years",
      "achievements": ["Achievement 1 with metrics", "Achievement 2"]
    }}
  ],
  "projects": [
    {{
      "name": "Project name",
      "description": "Short description",
      "technologies": ["Tech1", "Tech2"],
      "link": "URL or null"
    }}
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "technical_skills": ["Skill1", "Skill2", "Skill3"],
  "soft_skills": ["Skill1", "Skill2"],
  "tools_and_technologies": ["Tool1", "Tool2"],
  "resume_score": 85,
  "strengths": [
    "Strength 1: Highlighting specific measurable impact",
    "Strength 2: Strong technical depth in core backend systems"
  ],
  "weaknesses": [
    "Weakness 1: Lacking public GitHub portfolio link",
    "Weakness 2: Experience bullets could use more quantifiable KPIs"
  ],
  "improvement_suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2",
    "Actionable suggestion 3"
  ],
  "missing_sections": ["Certifications", "Projects"],
  "keyword_analysis": {{
    "top_keywords": ["Python", "FastAPI", "PostgreSQL"],
    "density": {{"Python": 3.5, "FastAPI": 2.1}},
    "industry_terms": ["Microservices", "REST APIs", "CI/CD"]
  }}
}}
"""

JOB_ANALYSIS_PROMPT = """
Job Title: {title}
Job Description Text:
---
{raw_text}
---

Analyze the job description and extract requirements into a valid JSON object matching:
{{
  "required_skills": ["Skill1", "Skill2", "Skill3"],
  "preferred_skills": ["Skill1", "Skill2"],
  "experience_requirements": {{
    "min_years": 3.0,
    "preferred_years": 5.0,
    "seniority_level": "Senior / Mid-Level / Junior"
  }},
  "education_requirements": {{
    "minimum_degree": "Bachelor's Degree in Computer Science or related",
    "preferred_fields": ["Computer Science", "Software Engineering"]
  }},
  "important_keywords": ["Microservices", "Scalability", "Agile"],
  "tools_and_technologies": ["AWS", "Docker", "PostgreSQL"]
}}
"""
