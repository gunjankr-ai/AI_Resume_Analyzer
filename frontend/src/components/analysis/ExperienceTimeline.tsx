import React from "react";
import { Briefcase, GraduationCap, FolderGit2, Calendar, Award } from "lucide-react";
import { WorkExperienceItem, EducationItem, ProjectItem } from "../../types/resume";

interface ExperienceTimelineProps {
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  workExperience,
  education,
  projects,
}) => {
  return (
    <div className="space-y-6">
      {/* Work Experience */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Work Experience</h3>
              <p className="text-xs text-slate-500">Employment history & career trajectory</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {workExperience.length} {workExperience.length === 1 ? "Role" : "Roles"}
          </span>
        </div>

        {workExperience.length > 0 ? (
          <div className="space-y-6">
            {workExperience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-slate-200 space-y-2">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-xs" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-base font-bold text-slate-900">{exp.role}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.duration || `${exp.start_date || ""} - ${exp.end_date || "Present"}`}</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-indigo-600">{exp.company}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                        <span className="text-indigo-400 font-bold mt-0.5">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No work experience entries extracted.</p>
        )}
      </div>

      {/* Education & Projects Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Education Credentials</h3>
              <p className="text-xs text-slate-500">Degrees & universities</p>
            </div>
          </div>

          {education.length > 0 ? (
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{edu.degree || "Degree"}</h4>
                    {edu.graduation_year && (
                      <span className="text-xs font-semibold text-slate-500">{edu.graduation_year}</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-purple-700">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>GPA / Grade: {edu.gpa}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No education credentials detected.</p>
          )}
        </div>

        {/* Projects */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Featured Projects</h3>
              <p className="text-xs text-slate-500">Portfolio initiatives & builds</p>
            </div>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                  {proj.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No standalone projects section detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};
