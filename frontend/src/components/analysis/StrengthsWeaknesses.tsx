import React from "react";
import { CheckCircle, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({
  strengths,
  weaknesses,
  suggestions,
}) => {
  return (
    <div className="space-y-6">
      {/* Strengths & Weaknesses 2-column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Key Resume Strengths</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  AI Evaluated
                </span>
              </h3>
              <p className="text-xs text-slate-500">Standout competitive advantages</p>
            </div>
          </div>

          <ul className="space-y-3">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 text-xs text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses & Critiques */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Resume Vulnerabilities</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  AI Evaluated
                </span>
              </h3>
              <p className="text-xs text-slate-500">Recruiter red flags or missing context</p>
            </div>
          </div>

          <ul className="space-y-3">
            {weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/40 border border-amber-100/80 text-xs text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  !
                </span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Actionable Recommendations</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-medium">
                  High Impact
                </span>
              </h3>
              <p className="text-xs text-indigo-200/70">Concrete tweaks to elevate ATS ranking</p>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors space-y-2"
            >
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
                <span className="w-5 h-5 rounded-full bg-indigo-500/40 flex items-center justify-center text-[10px] text-white">
                  {idx + 1}
                </span>
                <span>Optimization Priority #{idx + 1}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{sug}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
