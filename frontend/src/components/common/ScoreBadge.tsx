import React from "react";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  size = "md",
  showLabel = true,
}) => {
  const getBadgeStyle = (val: number) => {
    if (val >= 80) {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        ring: "text-emerald-500",
        label: "Strong Match",
      };
    }
    if (val >= 65) {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        ring: "text-blue-500",
        label: "Competitive",
      };
    }
    if (val >= 50) {
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        ring: "text-amber-500",
        label: "Moderate Gap",
      };
    }
    return {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      ring: "text-rose-500",
      label: "Significant Gap",
    };
  };

  const style = getBadgeStyle(score);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 font-medium",
    md: "text-sm px-2.5 py-1 font-semibold",
    lg: "text-lg px-3.5 py-1.5 font-bold",
    xl: "text-3xl px-5 py-3 font-black",
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center border rounded-xl shadow-xs transition-all ${style.bg} ${sizeClasses[size]}`}
      >
        <span>{Math.round(score)}%</span>
      </span>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 hidden sm:inline">
          {style.label}
        </span>
      )}
    </div>
  );
};
