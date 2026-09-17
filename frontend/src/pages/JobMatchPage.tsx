import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { matchService } from "../services/matchService";
import { resumeService } from "../services/resumeService";
import { dashboardService } from "../services/dashboardService";
import { JobMatch } from "../types/match";
import { Resume } from "../types/resume";
import { MatchBreakdownCard } from "../components/matching/MatchBreakdownCard";
import { KeywordPills } from "../components/matching/KeywordPills";
import { RelevantProjectsCard } from "../components/matching/RelevantProjectsCard";
import { MatchRadarChart } from "../components/charts/MatchRadarChart";
import { ScoreDonut } from "../components/charts/ScoreDonut";
import { CardSkeleton } from "../components/common/SkeletonLoader";
import { 
  Target, 
  Sparkles, 
  ArrowRight, 
  Send, 
  Layers, 
  AlertCircle, 
  FileText,
  Briefcase
} from "lucide-react";

export const JobMatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resume_id") || sessionStorage.getItem("active_resume_id");
  const matchIdParam = searchParams.get("match_id");

  const [resume, setResume] = useState<Resume | null>(null);
  const [match, setMatch] = useState<JobMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Job form inputs
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobText, setJobText] = useState("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        if (resumeId) {
          const res = await resumeService.getResume(resumeId);
          setResume(res);
        }

        if (matchIdParam) {
          const matchResult = await matchService.getMatch(matchIdParam);
          setMatch(matchResult);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load match data.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [resumeId, matchIdParam]);

  const handleUseSampleJob = async () => {
    try {
      const sample = await dashboardService.getSampleData();
      setJobTitle(sample.job_title);
      setCompany(sample.company);
      setJobText(sample.sample_job);
      setError(null);
    } catch {
      setJobTitle("Senior Full-Stack Cloud Engineer");
      setCompany("Horizon Cloud Systems");
      setJobText("Looking for a Senior Full-Stack Engineer with Python, FastAPI, React, TypeScript, Docker, and AWS.");
    }
  };

  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeId) {
      setError("Please upload or select a resume first.");
      return;
    }
    if (!jobTitle.trim()) {
      setError("Please provide a job title.");
      return;
    }
    if (jobText.trim().length < 20) {
      setError("Job description text must be at least 20 characters.");
      return;
    }

    setMatching(true);
    setError(null);

    try {
      const result = await matchService.quickCompare({
        resume_id: resumeId,
        job_title: jobTitle.trim(),
        company: company.trim() || undefined,
        job_text: jobText.trim(),
      });
      setMatch(result);
    } catch (err: any) {
      setError(err.message || "Failed to execute job comparison.");
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!resumeId) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Upload a Resume First</h3>
        <p className="text-xs text-slate-500">
          To perform job matching, upload a candidate resume to evaluate against the target job requirements.
        </p>
        <div className="pt-2">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xs"
          >
            Go to Upload
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Step 3 of 4
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-bold">
              Candidate: {resume?.analysis?.candidate_name || resume?.file_name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Job Description Matching & Fit Analysis
          </h1>
        </div>

        {match && (
          <Link
            to={`/skill-gaps?match_id=${match.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Layers className="w-4 h-4" />
            <span>View Skill Gaps ({match.missing_skills.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* If No Match Yet: Show Paste Form */}
      {!match && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>Enter Target Job Requirements</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste any job listing to benchmark required vs candidate competencies
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseSampleJob}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors border border-indigo-200/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Fill Sample Senior Job</span>
            </button>
          </div>

          <form onSubmit={handleRunMatch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Cloud Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, OpenAI, Horizon Cloud"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Description Text *
              </label>
              <textarea
                rows={9}
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the target job description text here..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={matching}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {matching ? "Analyzing Fit & Scoring..." : "Calculate Transparent Match"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Match Results Display */}
      {match && (
        <div className="space-y-8 animate-in fade-in">
          {/* Main 5-Factor Score Breakdown */}
          <MatchBreakdownCard
            overallPercentage={match.overall_match_percentage}
            breakdown={match.score_breakdown}
            jobTitle={jobTitle || "Evaluated Role"}
            company={company || undefined}
          />

          {/* Visual Radar & Donut Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-2">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Multi-Dimensional Capability Radar</h3>
                <p className="text-xs text-slate-500">Visual mapping across 5 core evaluation vectors</p>
              </div>
              <MatchRadarChart breakdown={match.score_breakdown} />
            </div>

            {/* Score donut & quick stats */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center space-y-4 text-center">
              <ScoreDonut
                score={match.overall_match_percentage}
                size={150}
                strokeWidth={14}
                label="Overall Fit"
                sublabel="Calculated Match"
              />
              <div className="w-full pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Matched</span>
                  <span className="font-bold text-emerald-600 text-sm">{match.matching_skills.length} Skills</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Missing</span>
                  <span className="font-bold text-rose-600 text-sm">{match.missing_skills.length} Skills</span>
                </div>
              </div>
            </div>
          </div>

          {/* Keyword and Experience alignment */}
          <KeywordPills
            matchingSkills={match.matching_skills}
            missingSkills={match.missing_skills}
            missingKeywords={match.missing_keywords}
            matchingExperience={match.matching_experience}
          />

          {/* Relevant Projects Card */}
          <RelevantProjectsCard projects={match.relevant_projects} />

          {/* Re-match with another job prompt */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-100 rounded-3xl border border-slate-200 text-xs">
            <span className="text-slate-600">Want to test against a different job description?</span>
            <button
              onClick={() => setMatch(null)}
              className="px-4 py-2 bg-white text-slate-800 font-bold rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Test Another Job Listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
