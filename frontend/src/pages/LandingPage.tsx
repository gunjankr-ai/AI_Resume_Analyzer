import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  Target, 
  Cpu, 
  FileText, 
  Layers, 
  ChevronDown, 
  Zap, 
  BarChart3,
  HelpCircle
} from "lucide-react";
import { dashboardService } from "../services/dashboardService";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleTryDemo = async () => {
    navigate("/upload");
  };

  const faqs = [
    {
      q: "How does ResuMatch AI calculate the Job Match Score?",
      a: "Unlike opaque black-box AI tools, ResuMatch AI utilizes a completely transparent 5-factor weighted formula: Technical Skills (35%), Experience Relevance (25%), Tools & Cloud Infrastructure (15%), Domain Keywords (15%), and Education Parity (10%). Every match breakdown includes the exact percentages and formula details.",
    },
    {
      q: "Does ResuMatch hallucinate or fabricate facts from my resume?",
      a: "No. Our parsing architecture strictly separates extracted facts (work tenure, companies, degrees, links) from AI-generated qualitative suggestions. If a link or metric is missing, the system notes the omission instead of making up information.",
    },
    {
      q: "What happens if a job asks for a skill I have equivalent experience with?",
      a: "Our built-in taxonomy includes comprehensive technology equivalents (e.g. JavaScript ↔ TypeScript, PostgreSQL ↔ MySQL, AWS ↔ GCP). When equivalent experience is detected, our system gives partial or full credit and marks it as 'Equivalent Found' rather than a critical missing gap.",
    },
    {
      q: "Is my personal resume data stored or sold?",
      a: "Never. ResuMatch AI does not train public AI models on your resume data. Furthermore, every user has the power to permanently purge their uploaded files, extracted dossier, and match records with a single click.",
    },
    {
      q: "Which file formats are supported?",
      a: "We support searchable PDF (.pdf) and Microsoft Word (.docx) documents up to 15MB.",
    },
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Next-Gen Full-Stack AI Resume Intelligence</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Stop Guessing Why Your Resume <br className="hidden sm:inline" />
          Gets Filtered Out by <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">ATS Algorithms</span>.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload your resume in PDF or DOCX, benchmark it against any target job description, and receive a transparent mathematical match score with an actionable skill-gap roadmap.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200"
          >
            <UploadCloud className="w-5 h-5" />
            Upload Resume Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-2xl border border-slate-200 shadow-xs transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-slate-500" />
            Explore Live Dashboard
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            100% Transparent Scoring
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            1,000+ Technology Taxonomy
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Single-Click Data Deletion
          </span>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Engineered For Precision
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything You Need to Outsmart the Screening Filter
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Combining rigorous document parsing, deterministic tech classification, and state-of-the-art LLM evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multi-Format Parsing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accepts both PDF and DOCX files. Automatically cleans unicode, extracts contact information, and segments work history, education, and projects.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Audited Mathematical Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No black-box mystery numbers. Every score includes a detailed 5-factor breakdown showing technical skills, experience tenure, tools, keywords, and education parity.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">8-Domain Skill Gap Mapping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Categorizes missing skills into Programming, Frameworks, Databases, Cloud, Tools, and Soft Skills. Explains importance and provides targeted learning topics.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Equivalent Experience Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Intelligently prevents false penalties. If a job requires TypeScript and you have extensive JavaScript or Node.js background, the system recognizes related parity.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Recruiter Strengths & Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates bullet points against Google's XYZ formula. Identifies missing resume sections and audits keyword density before you submit an application.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Privacy & Data Purge</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your resume belongs to you. Delete your uploaded document, extracted facts, and matching records anytime with zero trace remaining on server disks.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Four Simple Steps
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-xs text-slate-500">From raw document to interview-ready optimization</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">Upload Resume</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drop your PDF or DOCX file. Our engine validates magic bytes and extracts clean text.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">Fact Extraction</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Identifies candidate name, contact channels, work timeline, credentials, and skills.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">Paste Target Job</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add any job listing. Our system parses required skills, years of experience, and keywords.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-900">Get Roadmap</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspect transparent scoring breakdown and customized learning topics for missing skills.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:bg-slate-50/80 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-tr from-indigo-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Ready to Test Your Resume Score?
        </h2>
        <p className="text-sm text-indigo-200 max-w-lg mx-auto">
          Upload your resume now or try our instant sample dataset to see your transparent score breakdown in seconds.
        </p>
        <div className="pt-2">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-indigo-900 bg-white hover:bg-slate-100 rounded-2xl shadow-lg transition-transform hover:scale-105"
          >
            <UploadCloud className="w-5 h-5 text-indigo-600" />
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};
