import json
import logging
from typing import Dict, Any, Optional
from app.config.settings import settings
from app.ai.prompts import RESUME_ANALYSIS_SYSTEM_PROMPT, RESUME_ANALYSIS_USER_PROMPT, JOB_ANALYSIS_PROMPT
from app.ai.fallback_analyzer import analyze_resume_fallback, analyze_job_fallback

logger = logging.getLogger("ai_analyzer")

def clean_json_response(raw_resp: str) -> Dict[str, Any]:
    """Strip markdown code fencing and load JSON."""
    text = raw_resp.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        # Remove first line (e.g. ```json) and last line (```)
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return json.loads(text)

def call_gemini(prompt: str, system_instruction: Optional[str] = None) -> Optional[str]:
    """Call Google Gemini Generative AI."""
    if not settings.GEMINI_API_KEY:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )
        full_content = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
        response = model.generate_content(full_content)
        return response.text
    except Exception as e:
        logger.warning(f"Gemini API call failed: {e}. Falling back to NLP engine.")
        return None

def call_openai(prompt: str, system_instruction: Optional[str] = None) -> Optional[str]:
    """Call OpenAI compatible API."""
    if not settings.OPENAI_API_KEY:
        return None
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=messages,
            temperature=0.2
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.warning(f"OpenAI API call failed: {e}. Falling back to NLP engine.")
        return None

def analyze_resume_ai(raw_text: str) -> Dict[str, Any]:
    """
    Analyzes resume text using Gemini/OpenAI if configured;
    falls back cleanly to deterministic NLP parser if unavailable.
    """
    raw_response = None
    if settings.GEMINI_API_KEY:
        raw_response = call_gemini(
            RESUME_ANALYSIS_USER_PROMPT.format(raw_text=raw_text[:8000]),
            system_instruction=RESUME_ANALYSIS_SYSTEM_PROMPT
        )
    elif settings.OPENAI_API_KEY:
        raw_response = call_openai(
            RESUME_ANALYSIS_USER_PROMPT.format(raw_text=raw_text[:8000]),
            system_instruction=RESUME_ANALYSIS_SYSTEM_PROMPT
        )

    if raw_response:
        try:
            parsed = clean_json_response(raw_response)
            if "resume_score" in parsed and "candidate_name" in parsed:
                return parsed
        except Exception as e:
            logger.warning(f"Failed to parse LLM JSON: {e}. Using deterministic engine.")

    # High-accuracy fallback NLP
    return analyze_resume_fallback(raw_text)

def analyze_job_ai(raw_text: str, title: str) -> Dict[str, Any]:
    """
    Analyzes job description text using Gemini/OpenAI if configured;
    falls back cleanly to deterministic NLP parser.
    """
    raw_response = None
    prompt = JOB_ANALYSIS_PROMPT.format(title=title, raw_text=raw_text[:8000])
    
    if settings.GEMINI_API_KEY:
        raw_response = call_gemini(prompt)
    elif settings.OPENAI_API_KEY:
        raw_response = call_openai(prompt)

    if raw_response:
        try:
            parsed = clean_json_response(raw_response)
            if "required_skills" in parsed:
                return parsed
        except Exception as e:
            logger.warning(f"Failed to parse LLM Job JSON: {e}. Using deterministic engine.")

    return analyze_job_fallback(raw_text, title)
