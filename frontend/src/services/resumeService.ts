import { api } from "./api";
import { Resume, ResumeListItem, ResumeAnalysis } from "../types/resume";

export const resumeService = {
  uploadResume: async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<Resume> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/resumes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data.data;
  },

  getResume: async (id: string): Promise<Resume> => {
    const response = await api.get(`/resumes/${id}`);
    return response.data.data;
  },

  listResumes: async (): Promise<ResumeListItem[]> => {
    const response = await api.get("/resumes");
    return response.data.data;
  },

  analyzeResume: async (id: string): Promise<ResumeAnalysis> => {
    const response = await api.post(`/resumes/${id}/analyze`);
    return response.data.data;
  },

  loadSampleResume: async (): Promise<Resume> => {
    const response = await api.post("/resumes/load-sample");
    return response.data.data;
  },

  deleteResume: async (id: string): Promise<void> => {
    await api.delete(`/resumes/${id}`);
  },
};
