import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileDropzone } from "../components/upload/FileDropzone";
import { resumeService } from "../services/resumeService";
import { dashboardService } from "../services/dashboardService";
import { ResumeListItem } from "../types/resume";
import { 
  FileText, 
  Trash2, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Layers
} from "lucide-react";
import { DeleteModal } from "../components/common/DeleteModal";

export const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Deletion modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResumes = async () => {
    try {
      const list = await resumeService.listResumes();
      setResumes(list);
    } catch {
      // Ignore if empty
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileSelected = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(15);
    setError(null);

    try {
      const resume = await resumeService.uploadResume(file, (percent) => {
        setUploadProgress(percent);
      });
      // Store active resume in session storage for quick access across pages
      sessionStorage.setItem("active_resume_id", resume.id);
      navigate(`/analysis?id=${resume.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to upload and parse resume.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUseSample = async () => {
    setIsUploading(true);
    setUploadProgress(40);
    setError(null);

    try {
      setUploadProgress(70);
      const resume = await resumeService.loadSampleResume();
      setUploadProgress(100);
      sessionStorage.setItem("active_resume_id", resume.id);
      navigate(`/analysis?id=${resume.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to load sample resume.");
      setIsUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await resumeService.deleteResume(deleteTargetId);
      if (sessionStorage.getItem("active_resume_id") === deleteTargetId) {
        sessionStorage.removeItem("active_resume_id");
      }
      setDeleteTargetId(null);
      await fetchResumes();
    } catch (err: any) {
      setError(err.message || "Failed to delete resume.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Step 1: Document Ingestion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Upload Your Resume
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Upload your resume in PDF or DOCX format. Our parser extracts credentials, dates, skills, and sections with zero fabrication.
        </p>
      </div>

      {/* Upload Zone */}
      <FileDropzone
        onFileSelected={handleFileSelected}
        onUseSample={handleUseSample}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        error={error}
      />

      {/* Security notice */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Privacy Guarantee:</strong> Files are validated locally. Your resume will never be shared or used to train external LLM models.
          </span>
        </div>
        <span className="hidden sm:inline text-slate-400 font-mono">15MB Max Size</span>
      </div>

      {/* Existing Uploaded Resumes */}
      {resumes.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recently Analyzed Resumes</h3>
              <p className="text-xs text-slate-500">Select an existing resume or delete past uploads</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {resumes.length} In Session
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {resumes.map((r) => (
              <div
                key={r.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{r.candidate_name || r.file_name}</h4>
                      {r.resume_score !== null && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {r.resume_score}% Score
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {r.file_name} • {(r.file_size_bytes / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      sessionStorage.setItem("active_resume_id", r.id);
                      navigate(`/analysis?id=${r.id}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    <span>View Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTargetId(r.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete resume permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
