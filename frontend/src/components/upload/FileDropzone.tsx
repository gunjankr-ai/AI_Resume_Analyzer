import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  FileCode
} from "lucide-react";

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  onUseSample?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelected,
  onUseSample,
  isUploading = false,
  uploadProgress = 0,
  error = null,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndHandleFile = (file: File) => {
    setValidationError(null);
    const validExtensions = ["pdf", "docx"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !validExtensions.includes(ext)) {
      setValidationError("Invalid file format. Please upload a PDF (.pdf) or Word document (.docx).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setValidationError("File exceeds the 15MB size limit. Please upload a smaller document.");
      return;
    }

    if (file.size === 0) {
      setValidationError("The uploaded file is empty (0 bytes).");
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const activeError = error || validationError;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-indigo-600 bg-indigo-50/70 scale-[1.01]"
            : "border-slate-300 hover:border-indigo-400 bg-white shadow-xs hover:shadow-md"
        } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              selectedFile
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-indigo-50 text-indigo-600 border border-indigo-100"
            }`}
          >
            {selectedFile ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <UploadCloud className="w-8 h-8 animate-bounce" />
            )}
          </div>

          {/* Heading and details */}
          <div className="space-y-1">
            {selectedFile ? (
              <>
                <p className="text-base font-bold text-slate-800">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                </p>
              </>
            ) : (
              <>
                <p className="text-base sm:text-lg font-bold text-slate-800">
                  Drag and drop your resume here, or{" "}
                  <span className="text-indigo-600 hover:underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500">
                  Supports PDF (.pdf) and Word documents (.docx) up to 15MB
                </p>
              </>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="w-full max-w-md pt-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Extracting text & analyzing sections...</span>
                <span>{uploadProgress > 0 ? `${uploadProgress}%` : "Processing"}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(uploadProgress, 25)}%` }}
                />
              </div>
            </div>
          )}

          {/* Supported tags */}
          <div className="flex items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              <FileText className="w-3 h-3 text-red-500" /> PDF Document
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              <FileCode className="w-3 h-3 text-blue-500" /> Word DOCX
            </span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {activeError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Upload Notice</p>
            <p className="text-xs text-rose-600 mt-0.5">{activeError}</p>
          </div>
        </div>
      )}

      {/* Sample Resume Option */}
      {onUseSample && (
        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={onUseSample}
            disabled={isUploading}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors border border-indigo-200/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Try with Sample Senior Engineer Resume
          </button>
        </div>
      )}
    </div>
  );
};
