import React from "react";
import { Calculator, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { ScoreBreakdown } from "../../types/match";
import { ScoreBadge } from "../common/ScoreBadge";

interface MatchBreakdownCardProps {
  overallPercentage: number;
  breakdown: ScoreBreakdown;
  jobTitle?: string;
  company?: string | null;
}

export const MatchBreakdownCard: React.FC<MatchBreakdownCardProps> = ({
  overallPercentage,
  breakdown,
  jobTitle = "Target Role",
  company,
}) => {
  const factors = [
    {
      label: "Technical Skills",
      weight: "35%",
      score: breakdown.technical_skills_score,
      desc: "Direct & equivalent programming languages, frameworks, and engineering concepts",
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
    },
    {
      label: "Experience Relevance",
      weight: "25%",
      score: breakdown.experience_score,
      desc: "Candidate career tenure and role seniority against job requirements",
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      label: "Tools, Cloud & DB",
      weight: "15%",
      score: breakdown.tools_score,
      desc: "Databases, containerization, cloud infrastructure (AWS/GCP), and DevOps tools",
      color: "bg-violet-500",
      textColor: "text-violet-600",
    },
    {
      label: "Domain Keywords",
      weight: "15%",
      score: breakdown.keyword_score,
      desc: "Industry terminology, methodologies, and context-specific keywords",
      color: "bg-amber-500",
      textColor: "text-amber-600",
    },
    {
      label: "Education Parity",
      weight: "10%",
      score: breakdown.education_score,
      desc: "Minimum educational qualifications or accredited professional credentials",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
            Match Evaluation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            {jobTitle}
          </h2>
          {company && <p className="text-sm font-medium text-slate-500">{company}</p>}
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="text-right">
            <span className="text-xs text-slate-500 uppercase font-semibold block">Overall Match</span>
            <ScoreBadge score={overallPercentage} size="lg" showLabel={false} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {Math.round(overallPercentage)}%
          </div>
        </div>
      </div>

      {/* Formula Explanation Alert */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3">
        <Calculator className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
            Audited Mathematical Breakdown (No Black Box)
          </h4>
          <p className="text-xs text-indigo-900/80 font-mono leading-relaxed">
            {breakdown.formula_explanation}
          </p>
        </div>
      </div>

      {/* 5-Factor Progress Bars */}
      <div className="space-y-4">
        {factors.map((f, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{f.label}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                  Weight: {f.weight}
                </span>
              </div>
              <span className={`font-mono font-bold ${f.textColor}`}>
                {Math.round(f.score)}%
              </span>
            </div>
            
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${f.color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, f.score))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
