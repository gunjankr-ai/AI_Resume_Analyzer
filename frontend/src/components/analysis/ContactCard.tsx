import React from "react";
import { Mail, Phone, MapPin, Globe, Code, User } from "lucide-react";
import { ContactInfo } from "../../types/resume";

interface ContactCardProps {
  candidateName?: string | null;
  contactInfo: ContactInfo;
  summary?: string | null;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  candidateName,
  contactInfo,
  summary,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-100">
            {candidateName ? candidateName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {candidateName || "Extracted Candidate Profile"}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Extracted Fact
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Parsed verbatim from uploaded document</p>
          </div>
        </div>
      </div>

      {/* Contact Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {contactInfo.email ? (
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-xs text-slate-700 truncate"
          >
            <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{contactInfo.email}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-slate-300 shrink-0" />
            <span>Email not listed</span>
          </div>
        )}

        {contactInfo.phone ? (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 truncate">
            <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{contactInfo.phone}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
            <Phone className="w-4 h-4 text-slate-300 shrink-0" />
            <span>Phone not listed</span>
          </div>
        )}

        {contactInfo.location ? (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 truncate">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{contactInfo.location}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
            <span>Location not listed</span>
          </div>
        )}

        {contactInfo.linkedin ? (
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-xs text-blue-700 truncate"
          >
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">LinkedIn Profile</span>
          </a>
        ) : (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
            <Globe className="w-4 h-4 text-slate-300 shrink-0" />
            <span>LinkedIn not listed</span>
          </div>
        )}

        {contactInfo.github && (
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-400 hover:bg-slate-100 transition-colors text-xs text-slate-900 truncate"
          >
            <Code className="w-4 h-4 text-slate-800 shrink-0" />
            <span className="truncate">GitHub Profile</span>
          </a>
        )}
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Professional Summary
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
};
