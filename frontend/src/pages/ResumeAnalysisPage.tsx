import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resumeService } from "../services/resumeService";
import { Resume, ResumeAnalysis } from "../types/resume";
import { ContactCard } from "../components/analysis/ContactCard";
import { SkillsGrid } from "../components/analysis/SkillsGrid";
import { ExperienceTimeline } from "../components/analysis/ExperienceTimeline";
import { SectionAudit } from "../components/analysis/SectionAudit";
import { StrengthsWeaknesses } from "../components/analysis/StrengthsWeaknesses";
import { ScoreDonut } from "../components/charts/ScoreDonut";
import { CardSkeleton } from "../components/common/SkeletonLoader";
import { DeleteModal } from "../components/common/DeleteModal";
import { 
  Target, 
  Trash2, 
  RefreshCw, 
  ArrowRight, 
  FileText, 
  Hash,
  Sparkles,
  AlertCircle
} from "lucide-react";

export const ResumeAnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get("id") || sessionStorage.getItem("active_resume_id");

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResumeData = async () => {
    if (!resumeId) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const data = await resumeService.getResume(resumeId);
      setResume(data);
      sessionStorage.setItem("active_resume_id", data.id);
    } catch (err: any) {
      setError(err.message || "Failed to load resume analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, [resumeId]);

  const handleRefreshAnalysis = async () => {
    if (!resumeId) return;
    setRefreshing(true);
    try {
      await resumeService.analyzeResume(resumeId);
      await fetchResumeData();
    } catch (err: any) {
      setError(err.message || "Failed to refresh analysis.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteData = async () => {
    if (!resumeId) return;
    setIsDeleting(true);
    try {
      await resumeService.deleteResume(resumeId);
      sessionStorage.removeItem("active_resume_id");
      navigate("/upload");
    } catch (err: any) {
      setError(err.message || "Failed to delete resume.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!resumeId || (!resume && !loading)) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Resume Selected</h3>
        <p className="text-xs text-slate-500">
          Upload a resume first to view comprehensive dossier extraction and ATS score analytics.
        </p>
        <div className="pt-2">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xs"
          >
            Upload Resume Now
          </Link>
        </div>
      </div>
    );
  }

  const analysis: ResumeAnalysis = resume?.analysis || {
    id: "",
    resume_id: resume?.id || "",
    contact_info: {},
    summary: "",
    education: [],
    work_experience: [],
    projects: [],
    certifications: [],
    technical_skills: [],
    soft_skills: [],
    tools_and_technologies: [],
    resume_score: 75,
    strengths: [],
    weaknesses: [],
    improvement_suggestions: [],
    missing_sections: [],
    keyword_analysis: { top_keywords: [], density: {}, industry_terms: [] },
    created_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Step 2 of 4
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">{resume?.file_name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Resume Analysis & Fact Extraction
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefreshAnalysis}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            title="Re-run AI analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-600" : ""}`} />
            <span>{refreshing ? "Analyzing..." : "Re-Analyze"}</span>
          </button>

          <Link
            to={`/job-match?resume_id=${resume?.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>Match With Target Job</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setIsDeleteOpen(true)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
            title="Permanently delete data"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top Overview: Candidate Dossier + Score Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContactCard
            candidateName={analysis.candidate_name}
            contactInfo={analysis.contact_info}
            summary={analysis.summary}
          />
        </div>

        {/* ATS Quality Score Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Overall ATS Readiness
          </span>
          <ScoreDonut
            score={analysis.resume_score}
            size={150}
            strokeWidth={14}
            label="Resume Score"
            sublabel="Completeness & Impact"
          />
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Calculated based on section completeness, contact channels, quantified KPI metrics, and technology density.
          </p>
        </div>
      </div>

      {/* ATS Section Audit */}
      <SectionAudit missingSections={analysis.missing_sections || []} />

      {/* Skills Grid */}
      <SkillsGrid
        technicalSkills={analysis.technical_skills || []}
        toolsAndTech={analysis.tools_and_technologies || []}
        softSkills={analysis.soft_skills || []}
      />

      {/* Work Experience & Education Timeline */}
      <ExperienceTimeline
        workExperience={analysis.work_experience || []}
        education={analysis.education || []}
        projects={analysis.projects || []}
      />

      {/* Strengths, Weaknesses, and Actionable Suggestions */}
      <StrengthsWeaknesses
        strengths={analysis.strengths || []}
        weaknesses={analysis.weaknesses || []}
        suggestions={analysis.improvement_suggestions || []}
      />

      {/* Keyword Analysis Bar */}
      {analysis.keyword_analysis?.top_keywords && analysis.keyword_analysis.top_keywords.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Hash className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Resume Keyword Frequency & ATS Density
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.keyword_analysis.top_keywords.map((kw, i) => {
              const densityVal = analysis.keyword_analysis.density?.[kw];
              return (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5"
                >
                  <span className="font-bold">{kw}</span>
                  {densityVal && (
                    <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {densityVal}%
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom CTA to next step */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">Ready to see how you match against a job?</h3>
          <p className="text-xs text-indigo-100">
            Compare this resume with real requirements, uncover missing skills, and calculate match percentage.
          </p>
        </div>
        <Link
          to={`/job-match?resume_id=${resume?.id}`}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-indigo-900 bg-white hover:bg-slate-100 rounded-2xl shadow-sm transition-transform hover:scale-105 shrink-0"
        >
          <span>Benchmark Against Job</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteData}
        isDeleting={isDeleting}
      />
    </div>
  );
};
