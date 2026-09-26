import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Branding */}
        <Link
          to="/requests"
          className="flex items-center gap-2.5 group transition-transform active:scale-[0.98]"
          aria-label="Requestly Home"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <Layers size={18} />
          </div>
          <span className="font-semibold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Requestly
          </span>
        </Link>

        {/* User Info (Minimal & Clean) */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center shadow-xs">
            SC
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">Sarah Chen</span>
            <span className="text-[11px] text-slate-500 font-normal">Platform Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};
