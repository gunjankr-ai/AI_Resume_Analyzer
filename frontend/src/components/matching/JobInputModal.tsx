import React, { useState } from "react";
import { Briefcase, Sparkles, X, Send } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

interface JobInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, rawText: string, company?: string) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const JobInputModal: React.FC<JobInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUseSample = async () => {
    try {
      const sample = await dashboardService.getSampleData();
      setTitle(sample.job_title);
      setCompany(sample.company);
      setRawText(sample.sample_job);
      setError(null);
    } catch {
      // Fallback local sample
      setTitle("Senior Full-Stack Cloud Engineer");
      setCompany("Horizon Cloud Systems");
      setRawText(`We are looking for a Senior Full-Stack Cloud Engineer with 5+ years experience in Python, FastAPI, React, TypeScript, and AWS.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please specify a target Job Title.");
      return;
    }
    if (rawText.trim().length < 20) {
      setError("Please paste the job description text (at least 20 characters).");
      return;
    }
    setError(null);
    onSubmit(title.trim(), rawText.trim(), company.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add Target Job Description</h3>
              <p className="text-xs text-slate-500">Paste job requirements for automated matching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Google"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Job Description Text *
              </label>
              <button
                type="button"
                onClick={handleUseSample}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Fill Sample Senior Job
              </button>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste the job description including responsibilities, required skills, tools, and qualifications..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sans"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-3 rounded-xl border border-rose-200">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Running Match Analysis..." : "Analyze Match"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
