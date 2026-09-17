import re
import unicodedata
from typing import Dict, Optional, List

EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
PHONE_REGEX = re.compile(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
LINKEDIN_REGEX = re.compile(r'(https?://)?(www\.)?linkedin\.com/(in|pub)/[a-zA-Z0-9_-]+/?', re.IGNORECASE)
GITHUB_REGEX = re.compile(r'(https?://)?(www\.)?github\.com/[a-zA-Z0-9_-]+/?', re.IGNORECASE)
URL_REGEX = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')

def clean_text(text: str) -> str:
    """Normalize whitespace, remove non-printable chars, and fix unicode characters."""
    if not text:
        return ""
    # Normalize unicode
    text = unicodedata.normalize("NFKD", text)
    # Replace common unicode quotes and dashes
    text = text.replace("\u2018", "'").replace("\u2019", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    text = text.replace("\u2022", "\n* ").replace("\u25cf", "\n* ").replace("\u00b7", "\n* ")
    # Replace multiple spaces with a single space, but preserve newlines
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        cleaned = re.sub(r'[ \t]+', ' ', line).strip()
        if cleaned:
            cleaned_lines.append(cleaned)
    return "\n".join(cleaned_lines)

def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extract email, phone, linkedin, github, and URLs via regex."""
    emails = EMAIL_REGEX.findall(text)
    phones = PHONE_REGEX.findall(text)
    linkedins = LINKEDIN_REGEX.findall(text)
    githubs = GITHUB_REGEX.findall(text)

    email = emails[0] if emails else None
    
    # Clean phone match
    phone = None
    if phones:
        phone_match = re.search(PHONE_REGEX, text)
        if phone_match:
            phone = phone_match.group(0).strip()

    linkedin = None
    if linkedins:
        li_match = re.search(LINKEDIN_REGEX, text)
        if li_match:
            raw_li = li_match.group(0).strip()
            linkedin = raw_li if raw_li.startswith("http") else f"https://{raw_li}"

    github = None
    if githubs:
        gh_match = re.search(GITHUB_REGEX, text)
        if gh_match:
            raw_gh = gh_match.group(0).strip()
            github = raw_gh if raw_gh.startswith("http") else f"https://{raw_gh}"

    # Extract location heuristically (City, State / Country pattern)
    location = None
    loc_match = re.search(r'\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}\b|[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z]+)', text[:500])
    if loc_match:
        location = loc_match.group(0).strip()

    return {
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "portfolio": None,
        "location": location
    }

def detect_sections(text: str) -> Dict[str, str]:
    """Segment text into standard resume sections."""
    section_patterns = {
        "summary": r'(?:summary|professional summary|profile|about me|objective)',
        "experience": r'(?:experience|work experience|employment history|work history|professional experience)',
        "education": r'(?:education|academic background|academics|qualifications)',
        "skills": r'(?:skills|technical skills|core competencies|technologies|expertise)',
        "projects": r'(?:projects|personal projects|key projects|academic projects)',
        "certifications": r'(?:certifications|certificates|licenses|courses)',
    }
    
    # Find all occurrences of headers
    found_sections = {}
    lines = text.splitlines()
    current_section = "header"
    buffer: List[str] = []

    for line in lines:
        cleaned_line = line.strip().lower()
        # Check if line looks like a header (short, matches section keyword)
        matched_header = None
        if len(cleaned_line) < 35:
            for sec_name, pattern in section_patterns.items():
                if re.fullmatch(pattern, cleaned_line.strip(":").strip()) or re.search(r'^' + pattern + r'[:\s]*$', cleaned_line):
                    matched_header = sec_name
                    break
        
        if matched_header:
            if buffer:
                found_sections[current_section] = "\n".join(buffer)
                buffer = []
            current_section = matched_header
        else:
            buffer.append(line)

    if buffer:
        found_sections[current_section] = "\n".join(buffer)

    return found_sections
