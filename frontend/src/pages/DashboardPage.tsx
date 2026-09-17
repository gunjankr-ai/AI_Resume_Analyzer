import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";
import { DashboardOverview } from "../types/dashboard";
import { CardSkeleton } from "../components/common/SkeletonLoader";
import { ScoreBadge } from "../components/common/ScoreBadge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from "recharts";
import { 
  FileText, 
  Target, 
  Layers, 
  BarChart3, 
  UploadCloud, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Cpu
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await dashboardService.getOverview();
      setOverview(data);
    } catch {
      // Fallback data
      setOverview({
        total_resumes: 0,
        total_job_descriptions: 0,
        total_matches: 0,
        average_match_score: 0,
        top_detected_skills: [],
        top_missing_skills: [],
        recent_matches: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const detectedData = overview?.top_detected_skills || [];
  const missingData = overview?.top_missing_skills || [];
  const recentMatches = overview?.recent_matches || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
            Executive Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Platform Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time candidate profile metrics, benchmark scores, and skill market distributions
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Resume</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Analyzed Resumes</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{overview?.total_resumes || 0}</div>
          <p className="text-[11px] text-slate-500">Candidate dossiers parsed</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Target Job Specs</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{overview?.total_job_descriptions || 0}</div>
          <p className="text-[11px] text-slate-500">Benchmark roles evaluated</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Comparisons Executed</span>
            <Layers className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{overview?.total_matches || 0}</div>
          <p className="text-[11px] text-slate-500">5-factor scored matches</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Match Fit</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {overview?.average_match_score || 0}%
          </div>
          <p className="text-[11px] text-slate-500">Platform-wide average fit</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Detected Skills */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Candidate Skills</h3>
              <p className="text-xs text-slate-500">Most frequently detected across uploaded resumes</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Verified
            </span>
          </div>

          {detectedData.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detectedData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                    width={80}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-xl text-xs shadow-md">
                            <span className="font-bold">{payload[0].payload.skill}:</span>{" "}
                            {payload[0].value} occurrences
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#6366F1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center italic">
              Upload resumes to generate skill frequency telemetry.
            </p>
          )}
        </div>

        {/* Top Missing Skills */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Skill Gaps In Demand</h3>
              <p className="text-xs text-slate-500">Requested by jobs but missing in resumes</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
              High Demand
            </span>
          </div>

          {missingData.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={missingData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                    width={80}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-xl text-xs shadow-md">
                            <span className="font-bold">{payload[0].payload.skill}:</span>{" "}
                            {payload[0].value} gap mentions
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#F43F5E" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center italic">
              Execute job comparisons to visualize marketplace skill gaps.
            </p>
          )}
        </div>
      </div>

      {/* Recent Matches Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Match History</h3>
            <p className="text-xs text-slate-500">Audit trail of evaluations performed in this database</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {recentMatches.length} Matches
          </span>
        </div>

        {recentMatches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Match Score</th>
                  <th className="py-3 px-4">Date Evaluated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentMatches.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.candidate_name || "Candidate"}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-indigo-600">
                      {item.job_title}
                    </td>
                    <td className="py-3.5 px-4">
                      <ScoreBadge score={item.match_percentage} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {item.created_at}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/job-match?resume_id=${item.resume_id}&match_id=${item.id}`}
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>Breakdown</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">No match comparisons performed yet.</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
            >
              <span>Upload a resume to run your first match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
