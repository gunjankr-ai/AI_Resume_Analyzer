import { api } from "./api";
import { JobDescription, JobDescriptionCreate } from "../types/job";

export const jobService = {
  submitJob: async (payload: JobDescriptionCreate): Promise<JobDescription> => {
    const response = await api.post("/jobs", payload);
    return response.data.data;
  },

  listJobs: async (): Promise<JobDescription[]> => {
    const response = await api.get("/jobs");
    return response.data.data;
  },

  getJob: async (id: string): Promise<JobDescription> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },
};
