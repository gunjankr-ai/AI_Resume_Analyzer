import React, { useState } from "react";
import { 
  AlertCircle, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Info,
  Sparkles,
  Filter
} from "lucide-react";
import { SkillGapItem, SkillCategory, SkillImportance } from "../../types/skillgap";

interface SkillGapTableProps {
  gaps: SkillGapItem[];
}

export const SkillGapTable: React.FC<SkillGapTableProps> = ({ gaps }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Programming",
    "Technical Skills",
    "Frameworks",
    "Databases",
    "Cloud",
    "Tools",
    "Soft Skills",
    "Domain Skills",
  ];

  const filteredGaps = gaps.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.why_it_matters.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suggested_learning_topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getImportanceBadge = (importance: SkillImportance, hasEquiv: boolean) => {
    if (hasEquiv) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Equivalent Found
        </span>
      );
    }
    switch (importance) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Critical
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            High Priority
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Nice-to-have
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Visual Skill Gap Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
              {gaps.length} Total Gaps
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Skill requirements cross-referenced with your resume and verified equivalents
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search missing skills or topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table Display */}
      {filteredGaps.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Skill & Category</th>
                  <th className="py-3.5 px-4">Importance</th>
                  <th className="py-3.5 px-4">Why It Matters</th>
                  <th className="py-3.5 px-4">Suggested Learning Topic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredGaps.map((item) => (
                  <tr key={item.id || item.skill_name} className="hover:bg-slate-50/60 transition-colors">
                    {/* Skill & Category */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-sm">{item.skill_name}</div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                        {item.category}
                      </span>
                    </td>

                    {/* Importance */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      {getImportanceBadge(item.importance, item.equivalent_experience_detected)}
                    </td>

                    {/* Why It Matters */}
                    <td className="py-4 px-4 align-top max-w-xs leading-relaxed text-slate-600">
                      {item.why_it_matters}
                    </td>

                    {/* Suggested Learning Topic */}
                    <td className="py-4 px-4 align-top max-w-sm">
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/70 text-indigo-900 leading-relaxed">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{item.suggested_learning_topic}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No matching skill gaps found</h4>
          <p className="text-xs text-slate-500">
            {searchQuery
              ? `No skills matched your search "${searchQuery}".`
              : `Your resume demonstrates all required competencies in the ${selectedCategory} category.`}
          </p>
        </div>
      )}
    </div>
  );
};
