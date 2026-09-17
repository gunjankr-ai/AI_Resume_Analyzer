import React from "react";
import { Code, Wrench, Users } from "lucide-react";

interface SkillsGridProps {
  technicalSkills: string[];
  toolsAndTech: string[];
  softSkills: string[];
}

export const SkillsGrid: React.FC<SkillsGridProps> = ({
  technicalSkills,
  toolsAndTech,
  softSkills,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Detected Skills & Competencies</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              {technicalSkills.length + toolsAndTech.length + softSkills.length} Found
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Extracted directly from resume text</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Technical Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <Code className="w-4 h-4 text-indigo-600" />
            <span>Core Technical Skills & Languages ({technicalSkills.length})</span>
          </div>
          {technicalSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-50/70 text-indigo-800 border border-indigo-200/60 shadow-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No specific technical skills detected.</p>
          )}
        </div>

        {/* Tools and Technologies */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <Wrench className="w-4 h-4 text-violet-600" />
            <span>Tools, Cloud & Databases ({toolsAndTech.length})</span>
          </div>
          {toolsAndTech.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {toolsAndTech.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-violet-50/70 text-violet-800 border border-violet-200/60 shadow-xs"
                >
                  {tool}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No infrastructure tools detected.</p>
          )}
        </div>

        {/* Soft Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Professional & Soft Skills ({softSkills.length})</span>
          </div>
          {softSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {softSkills.map((soft) => (
                <span
                  key={soft}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-emerald-50/70 text-emerald-800 border border-emerald-200/60 shadow-xs"
                >
                  {soft}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No soft skills explicitly listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};
