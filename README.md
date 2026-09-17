# ResuMatch AI — Production-Quality AI Resume Analyzer & Job Fit Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00.svg?style=flat&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **ResuMatch AI** is a full-stack, enterprise-grade platform that parses resumes (PDF and Word DOCX), extracts structured candidate facts without hallucination, compares profiles against target job descriptions, calculates a **transparent 5-factor mathematical score**, identifies missing competencies across **8 standard tech domains**, and provides actionable learning recommendations.

---

## 🌟 Key Capabilities

- 📄 **Multi-Format Document Parsing**: High-fidelity text and table extraction from searchable PDFs (`pypdf`) and Microsoft Word documents (`python-docx`) with magic byte validation and 15MB file limits.
- 🎯 **Fact-First Dossier Extraction**: Strictly separates extracted candidate facts (contact details, work timeline, degrees, verified tech stack) from AI-generated suggestions. Never invents non-existent information.
- 🧮 **Transparent 5-Factor Mathematical Scoring**: Zero black-box numbers. Displays the exact audited mathematical formula:
  $$\text{Match Score} = (S_{\text{tech}} \times 35\%) + (S_{\text{tools}} \times 15\%) + (S_{\text{exp}} \times 25\%) + (S_{\text{edu}} \times 10\%) + (S_{\text{kw}} \times 15\%)$$
- 🗺️ **8-Domain Skill Gap Mapping**: Categorizes missing skills into:
  1. *Programming*
  2. *Technical Skills*
  3. *Frameworks*
  4. *Databases*
  5. *Cloud*
  6. *Tools*
  7. *Soft Skills*
  8. *Domain Skills*
  Each gap provides: **Skill Name → Category → Priority (Critical / High / Medium / Nice-to-have) → Why It Matters → Suggested Learning Topic**.
- 🔄 **Equivalent Experience Engine**: Prevents false penalties by recognizing equivalent technologies (e.g. JavaScript ↔ TypeScript, PostgreSQL ↔ MySQL, AWS ↔ GCP) and marking them as *Equivalent Found*.
- 📊 **Executive Telemetry Dashboard**: Aggregate analytics tracking candidate skill frequency distributions, market skill gaps, and recent match evaluations with multi-dimensional radar charts.
- 🛡️ **Privacy by Design & Single-Click Data Purge**: Full GDPR/CCPA compliance. Users can permanently purge uploaded files from disk and execute cascading database deletions with a single click.
- 🤖 **Dual-Mode AI Engine**: Seamlessly supports Google Gemini and OpenAI when configured via `.env`, while featuring a built-in 1,000+ technology taxonomy and deterministic NLP parser so the application functions with 100% accuracy right out of the box with zero API keys required.

---

## 🏗️ Architecture & Tech Stack

```
+-----------------------------------------------------------------------------------+
|                               FRONTEND (React 19 + Vite)                          |
|  - TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, React Router DOM          |
|  - Pages: Landing, Upload, Resume Analysis, Job Match, Skill Gaps, Dashboard      |
+------------------------------------------+----------------------------------------+
                                           | HTTP / REST (Port 8001 / Proxy 5173)
                                           v
+-----------------------------------------------------------------------------------+
|                               BACKEND (FastAPI + Python 3.13)                     |
|  - REST API Routers: /resumes, /jobs, /matches, /dashboard                        |
|  - Document Extraction: pypdf (PDF) & python-docx (DOCX)                          |
|  - Scoring Engine: 5-Factor audited mathematical weighting                        |
|  - Skill Gap Engine: 8-domain taxonomy mapping & equivalent experience checking   |
|  - AI/NLP: Google Gemini / OpenAI + deterministic fallback parser                 |
|  - Data Layer: SQLAlchemy ORM (SQLite zero-friction / PostgreSQL production)      |
+-----------------------------------------------------------------------------------+
```

---

## 📁 Repository Structure

```
d:\ai-resume-analyzer\
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entrypoint, middleware, CORS
│   │   ├── config/
│   │   │   └── settings.py             # BaseSettings, upload limits, API keys
│   │   ├── database/
│   │   │   ├── base.py                 # Declarative Base
│   │   │   └── session.py              # Engine and SessionLocal
│   │   ├── models/                     # SQLAlchemy ORM models
│   │   │   ├── resume.py               # Resume and ResumeAnalysis tables
│   │   │   ├── job.py                  # JobDescription table
│   │   │   ├── match.py                # JobMatch table
│   │   │   └── skill.py                # SkillGap table
│   │   ├── schemas/                    # Pydantic v2 schemas
│   │   │   ├── common.py               # Standard response wrappers
│   │   │   ├── resume.py               # Dossier, education, work history
│   │   │   ├── job.py                  # Requirements and keywords
│   │   │   ├── match.py                # Score breakdown and projects
│   │   │   └── analysis.py             # Skill gaps and dashboard metrics
│   │   ├── services/
│   │   │   ├── parser.py               # PDF and DOCX text extraction
│   │   │   ├── resume_service.py       # Resume ingestion, analysis, and purge
│   │   │   ├── job_service.py          # Job description parsing
│   │   │   ├── scoring_service.py      # 5-factor mathematical scoring
│   │   │   └── skill_gap_service.py    # 8-domain gap mapping and topics
│   │   ├── ai/
│   │   │   ├── llm_client.py           # Gemini & OpenAI client abstraction
│   │   │   ├── fallback_analyzer.py    # Deterministic NLP parser
│   │   │   ├── prompts.py              # Few-shot structured JSON prompts
│   │   │   └── taxonomy.py             # 1,000+ technology taxonomy dictionary
│   │   └── api/v1/
│   │       ├── router.py               # Unified API router
│   │       └── endpoints/
│   │           ├── resumes.py          # Upload, analyze, delete resumes
│   │           ├── jobs.py             # Job requirements management
│   │           ├── matches.py          # Job matching & skill gap endpoints
│   │           └── dashboard.py        # Analytics & sample data
│   ├── requirements.txt                # Python backend dependencies
│   ├── verify_system.py                # Automated component verification script
│   ├── test_e2e.py                     # Live HTTP end-to-end integration test
│   └── .env.example                    # Environment template
│
└── frontend/
    ├── src/
    │   ├── layouts/
    │   │   └── MainLayout.tsx          # Responsive navbar and footer
    │   ├── pages/
    │   │   ├── LandingPage.tsx         # SaaS landing page (Hero, FAQ, etc.)
    │   │   ├── ResumeUploadPage.tsx    # Upload view with progress and sample
    │   │   ├── ResumeAnalysisPage.tsx  # Extracted facts, score, strengths
    │   │   ├── JobMatchPage.tsx        # 5-factor match score & radar chart
    │   │   ├── SkillGapPage.tsx        # 8-domain visual skill gap dashboard
    │   │   └── DashboardPage.tsx       # Platform analytics & match history
    │   ├── components/
    │   │   ├── common/                 # Navbar, Footer, ScoreBadge, DeleteModal
    │   │   ├── upload/                 # FileDropzone with progress bar
    │   │   ├── analysis/               # ContactCard, SkillsGrid, Timeline, Audit
    │   │   ├── matching/               # MatchBreakdownCard, RadarChart, Projects
    │   │   └── skillgap/               # SkillGapTable with category filters
    │   ├── services/                   # Axios API service methods
    │   └── types/                      # TypeScript definitions
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10 or higher (Tested on Python 3.13)
- **Node.js**: 18.x or higher (Tested on Node v24)
- **Git**

---

### Step 1: Backend Setup

1. Open a terminal in the project directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* If you want to enable cloud LLM enhancement, set your API key in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   # or OPENAI_API_KEY=your_openai_api_key_here
   ```
   *Note: If no API key is set, the application automatically uses its high-accuracy built-in 1,000+ technology taxonomy and deterministic NLP parser!*

5. Run the automated backend verification suite:
   ```bash
   python verify_system.py
   ```

6. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
   ```
   - REST API: `http://127.0.0.1:8001`
   - Interactive Swagger Documentation: `http://127.0.0.1:8001/docs`

---

### Step 2: Frontend Setup

1. Open a second terminal window:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5173
   ```

---

## 📡 REST API Reference

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `POST` | `/resumes/upload` | Upload & validate PDF/DOCX resume, extract text, run analysis | `201 Created` |
| `POST` | `/resumes/load-sample` | Instantly load and profile preloaded Senior Engineer resume | `201 Created` |
| `GET`  | `/resumes` | List uploaded resumes with summary scores | `200 OK` |
| `GET`  | `/resumes/{id}` | Retrieve resume text and candidate analysis dossier | `200 OK` |
| `POST` | `/resumes/{id}/analyze` | Refresh / re-run AI and NLP analysis | `200 OK` |
| `DELETE` | `/resumes/{id}` | Permanently delete file from disk and purge database records | `200 OK` |
| `POST` | `/jobs` | Submit and parse a job description text | `201 Created` |
| `GET`  | `/jobs/{id}` | Get parsed job requirements by ID | `200 OK` |
| `POST` | `/matches/compare` | Compare a stored resume with a stored job description | `201 Created` |
| `POST` | `/matches/quick-compare` | Paste job text and run immediate 5-factor match in 1 step | `201 Created` |
| `GET`  | `/matches/{id}` | Retrieve match result, radar vectors, and relevant projects | `200 OK` |
| `GET`  | `/matches/{id}/skill-gaps` | Get categorized skill gaps with learning roadmap | `200 OK` |
| `GET`  | `/dashboard/overview` | Platform telemetry: total analyzed, average score, top skills | `200 OK` |
| `GET`  | `/dashboard/sample-data` | Retrieve sample resume and job description text | `200 OK` |

---

## 🧪 Testing & Verification

### 1. Automated Verification Suite
Verifies database schema creation, 1,000+ technology taxonomy detection, PDF & DOCX binary parsing, 5-factor mathematical scoring bounds, and skill gap generation:
```bash
cd backend
python verify_system.py
```

### 2. Live HTTP Integration Pipeline Test
Tests the complete end-to-end API pipeline through live HTTP requests (Upload DOCX → Parse facts → Match job → Check 8-domain skill gaps → Verify dashboard telemetry → Execute GDPR data purge):
```bash
cd backend
python test_e2e.py
```

### 3. Frontend Production Build Check
Verifies that all TypeScript types, React components, and Tailwind styling compile cleanly:
```bash
cd frontend
npm run build
```

---

## 🔐 Security & Privacy Architecture

1. **File Type & Magic Byte Validation**: Inspects binary header bytes (`%PDF-` for PDF, `PK\x03\x04` for DOCX) to prevent malicious file renaming or corrupted uploads.
2. **File Size Enforcement**: Hard limit of 15MB enforced at the API gateway layer.
3. **No Model Training on User Data**: User resumes and extracted dossiers are processed locally in private storage and never fed to public LLM datasets.
4. **Instant GDPR/CCPA Purge**: Clicking "Delete Permanently" deletes the document from storage and executes cascading deletions across all linked database records.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
