import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { matchService } from "../services/matchService";
import { dashboardService } from "../services/dashboardService";
import { SkillGapItem, SkillGapSummary } from "../types/skillgap";
import { SkillGapTable } from "../components/skillgap/SkillGapTable";
import { CardSkeleton } from "../components/common/SkeletonLoader";
import { 
  Layers, 
  Target, 
  ArrowRight, 
  AlertCircle, 
  BookOpen, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

export const SkillGapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const matchIdParam = searchParams.get("match_id");

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SkillGapSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchGaps = async () => {
      setLoading(true);
      setError(null);

      let activeMatchId = matchIdParam;

      // If no matchIdParam, check recent matches from dashboard overview
      if (!activeMatchId) {
        try {
          const overview = await dashboardService.getOverview();
          if (overview.recent_matches && overview.recent_matches.length > 0) {
            activeMatchId = overview.recent_matches[0].id;
            setRecentMatches(overview.recent_matches);
          }
        } catch {
          // Ignore
        }
      }

      if (activeMatchId) {
        try {
          const data = await matchService.getSkillGaps(activeMatchId);
          setSummary(data);
        } catch (err: any) {
          setError(err.message || "Failed to load skill gaps.");
        }
      }

      setLoading(false);
    };

    fetchGaps();
  }, [matchIdParam]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  // Flatten all gaps across categories
  const allGaps: SkillGapItem[] = [];
  if (summary && summary.categories) {
    Object.values(summary.categories).forEach((items) => {
      allGaps.push(...items);
    });
  }

  if (!summary || allGaps.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Skill Gaps to Display</h3>
        <p className="text-xs text-slate-500">
          Run a job match comparison first to generate a structured skill gap roadmap across the 8 technical domains.
        </p>
        <div className="pt-2">
          <Link
            to="/job-match"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xs"
          >
            Go to Job Matching
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Step 4 of 4
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Domain Skill Roadmap</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Skill Gap Identification & Learning Roadmap
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200/60"
          >
            <span>View Executive Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Gaps</span>
          <div className="text-2xl font-black text-slate-900">{summary.total_gaps}</div>
          <p className="text-[11px] text-slate-500">Missing from target job specs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-100 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Critical Gaps</span>
          <div className="text-2xl font-black text-rose-600">{summary.critical_gaps_count}</div>
          <p className="text-[11px] text-slate-500">Must address to pass technical filters</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-100 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">High Priority</span>
          <div className="text-2xl font-black text-amber-600">{summary.high_gaps_count}</div>
          <p className="text-[11px] text-slate-500">Strongly recommended by employer</p>
        </div>
      </div>

      {/* Main Table */}
      <SkillGapTable gaps={allGaps} />
    </div>
  );
};
