import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { LandingPage } from "./pages/LandingPage";
import { ResumeUploadPage } from "./pages/ResumeUploadPage";
import { ResumeAnalysisPage } from "./pages/ResumeAnalysisPage";
import { JobMatchPage } from "./pages/JobMatchPage";
import { SkillGapPage } from "./pages/SkillGapPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<ResumeUploadPage />} />
          <Route path="/analysis" element={<ResumeAnalysisPage />} />
          <Route path="/job-match" element={<JobMatchPage />} />
          <Route path="/skill-gaps" element={<SkillGapPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
