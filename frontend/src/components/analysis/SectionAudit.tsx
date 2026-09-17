import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface SectionAuditProps {
  missingSections: string[];
}

export const SectionAudit: React.FC<SectionAuditProps> = ({ missingSections }) => {
  const allCoreSections = [
    { name: "Professional Summary", key: "Summary" },
    { name: "Work Experience", key: "Experience" },
    { name: "Technical Skills", key: "Skills" },
    { name: "Education", key: "Education" },
    { name: "Projects", key: "Projects" },
    { name: "Certifications", key: "Certifications" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">ATS Section Audit</h4>
          <p className="text-xs text-slate-500">Checking against standard recruiter parsers</p>
        </div>
        {missingSections.length === 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Sections Present
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" /> {missingSections.length} Incomplete
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allCoreSections.map((sec) => {
          const isMissing = missingSections.some(
            (m) => m.toLowerCase() === sec.key.toLowerCase()
          );
          return (
            <div
              key={sec.key}
              className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                isMissing
                  ? "bg-rose-50/60 border-rose-200 text-rose-800"
                  : "bg-emerald-50/60 border-emerald-200 text-emerald-800"
              }`}
            >
              <span className="text-xs font-semibold">{sec.name}</span>
              {isMissing ? (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
