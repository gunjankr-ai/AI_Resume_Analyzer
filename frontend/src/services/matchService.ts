import { api } from "./api";
import { JobMatch, QuickComparePayload } from "../types/match";
import { SkillGapSummary } from "../types/skillgap";

export const matchService = {
  compare: async (resumeId: string, jobId: string): Promise<JobMatch> => {
    const response = await api.post("/matches/compare", {
      resume_id: resumeId,
      job_id: jobId,
    });
    return response.data.data;
  },

  quickCompare: async (payload: QuickComparePayload): Promise<JobMatch> => {
    const response = await api.post("/matches/quick-compare", payload);
    return response.data.data;
  },

  getMatch: async (matchId: string): Promise<JobMatch> => {
    const response = await api.get(`/matches/${matchId}`);
    return response.data.data;
  },

  getSkillGaps: async (matchId: string): Promise<SkillGapSummary> => {
    const response = await api.get(`/matches/${matchId}/skill-gaps`);
    return response.data.data;
  },
};
