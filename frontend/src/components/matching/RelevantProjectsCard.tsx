import React from "react";
import { FolderGit2, CheckCircle2 } from "lucide-react";
import { RelevantProject } from "../../types/match";

interface RelevantProjectsCardProps {
  projects: RelevantProject[];
}

export const RelevantProjectsCard: React.FC<RelevantProjectsCardProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
          <FolderGit2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Relevant Projects Matched to Job
          </h3>
          <p className="text-xs text-slate-500">
            Portfolio experiences that substantiate target role requirements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-indigo-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Matched
              </span>
            </div>

            {proj.description && (
              <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
            )}

            {proj.match_reason && (
              <div className="text-[11px] text-indigo-700 bg-indigo-50/60 p-2 rounded-xl border border-indigo-100 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{proj.match_reason}</span>
              </div>
            )}

            {proj.technologies && proj.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
