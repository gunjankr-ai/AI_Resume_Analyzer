import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  Sparkles, 
  Target, 
  Layers, 
  LayoutDashboard, 
  UploadCloud,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Upload", path: "/upload", icon: UploadCloud },
    { name: "Resume Analysis", path: "/analysis", icon: FileText },
    { name: "Job Match", path: "/job-match", icon: Target },
    { name: "Skill Gaps", path: "/skill-gaps", icon: Layers },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                ResuMatch <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">AI</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Intelligent Career Matcher</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-indigo-600" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Security Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy Verified</span>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all duration-150"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Resume
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  active
                    ? "text-indigo-600 bg-indigo-50 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-indigo-600" : "text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-semibold text-white bg-indigo-600 rounded-xl shadow-sm"
            >
              <UploadCloud className="w-5 h-5" />
              Upload Resume
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
