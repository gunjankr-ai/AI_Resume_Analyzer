import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Cpu, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">ResuMatch AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent, mathematical resume analysis and job matching. Detect missing skills, audit ATS compliance, and optimize your career potential.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              FastAPI & Dual AI/NLP Engine Live
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Core Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/upload" className="hover:text-white transition-colors">Resume Upload</Link>
              </li>
              <li>
                <Link to="/analysis" className="hover:text-white transition-colors">Resume Breakdown</Link>
              </li>
              <li>
                <Link to="/job-match" className="hover:text-white transition-colors">Job Matching</Link>
              </li>
              <li>
                <Link to="/skill-gaps" className="hover:text-white transition-colors">Skill Gap Dashboard</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Executive Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Transparent Scoring */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Scoring Framework</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between">
                <span>Technical Skills</span>
                <span className="text-slate-300 font-mono">35%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Experience Relevance</span>
                <span className="text-slate-300 font-mono">25%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Tools, Cloud & DB</span>
                <span className="text-slate-300 font-mono">15%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Domain Keywords</span>
                <span className="text-slate-300 font-mono">15%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Education Parity</span>
                <span className="text-slate-300 font-mono">10%</span>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Privacy by Design
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Your resume data is processed securely and is never used to train public AI models. You have total ownership and can purge your files and records with a single click.
            </p>
            <div className="pt-1">
              <a
                href="http://127.0.0.1:8001/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                <span>Interactive Swagger API</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ResuMatch AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              Pydantic v2 + SQLAlchemy
            </span>
            <span>Zero Black-Box Scoring</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
