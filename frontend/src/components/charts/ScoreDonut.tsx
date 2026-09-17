import React from "react";

interface ScoreDonutProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const ScoreDonut: React.FC<ScoreDonutProps> = ({
  score,
  size = 140,
  strokeWidth = 12,
  label = "ATS Score",
  sublabel = "Out of 100",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 80) return "#10B981"; // Emerald
    if (val >= 65) return "#3B82F6"; // Blue
    if (val >= 50) return "#F59E0B"; // Amber
    return "#F43F5E"; // Rose
  };

  const strokeColor = getColor(clampedScore);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {Math.round(clampedScore)}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 -mt-1">
            %
          </span>
        </div>
      </div>

      {label && (
        <div className="mt-2 text-center">
          <span className="text-xs font-bold text-slate-800 block">{label}</span>
          {sublabel && <span className="text-[11px] text-slate-400">{sublabel}</span>}
        </div>
      )}
    </div>
  );
};
