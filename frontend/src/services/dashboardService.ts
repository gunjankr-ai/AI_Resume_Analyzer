import { api } from "./api";
import { DashboardOverview, SampleData } from "../types/dashboard";

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get("/dashboard/overview");
    return response.data.data;
  },

  getSampleData: async (): Promise<SampleData> => {
    const response = await api.get("/dashboard/sample-data");
    return response.data;
  },
};
