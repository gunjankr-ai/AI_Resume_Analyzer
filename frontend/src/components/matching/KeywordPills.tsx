import React from "react";
import { Check, X, Tag, Clock } from "lucide-react";
import { MatchingExperience } from "../../types/match";

interface KeywordPillsProps {
  matchingSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  matchingExperience: MatchingExperience;
}

export const KeywordPills: React.FC<KeywordPillsProps> = ({
  matchingSkills,
  missingSkills,
  missingKeywords,
  matchingExperience,
}) => {
  return (
    <div className="space-y-6">
      {/* Experience Match Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Experience Alignment</h4>
            <p className="text-xs text-slate-500 mt-0.5">{matchingExperience.details}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Candidate</span>
            <span className="text-sm font-bold text-slate-800">{matchingExperience.years_matched} Yrs</span>
          </div>
          <div className="text-slate-300 font-bold">vs</div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Job Req</span>
            <span className="text-sm font-bold text-slate-800">{matchingExperience.required_years} Yrs</span>
          </div>
        </div>
      </div>

      {/* Matched vs Missing 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-base font-bold text-slate-900">
                Matching Skills & Technologies
              </h4>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {matchingSkills.length} Verified
            </span>
          </div>

          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No matching skills detected.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h4 className="text-base font-bold text-slate-900">
                Missing Required Skills
              </h4>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {missingSkills.length} Missing
            </span>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium"
                >
                  <X className="w-3.5 h-3.5 text-rose-600" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> No required skills missing! Perfect skill coverage.
            </p>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      {missingKeywords.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900">
              Important Job Keywords Not Detected in Resume
            </h4>
          </div>
          <p className="text-xs text-slate-500">
            Consider incorporating these terms naturally into your bullet points or summary to optimize ATS keyword density:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {missingKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
