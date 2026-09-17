import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ScoreBreakdown } from "../../types/match";

interface MatchRadarChartProps {
  breakdown: ScoreBreakdown;
}

export const MatchRadarChart: React.FC<MatchRadarChartProps> = ({ breakdown }) => {
  const data = [
    { subject: "Technical Skills", score: breakdown.technical_skills_score, fullMark: 100 },
    { subject: "Experience", score: breakdown.experience_score, fullMark: 100 },
    { subject: "Tools & Cloud", score: breakdown.tools_score, fullMark: 100 },
    { subject: "Keywords", score: breakdown.keyword_score, fullMark: 100 },
    { subject: "Education", score: breakdown.education_score, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
          <Radar
            name="Candidate Fit"
            dataKey="score"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.4}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                    <p className="font-bold">{item.subject}</p>
                    <p className="text-indigo-300 font-mono">Score: {item.score}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
