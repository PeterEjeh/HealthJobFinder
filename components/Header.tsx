import React from 'react';

const StethoscopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V7a2 2 0 0 0-2-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-2a2 2 0 0 1 2-2h1a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H6a2 2 0 0 0-2 2Z"/>
    <path d="M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StethoscopeIcon className="w-8 h-8 text-cyan-600" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            HealthJobFinder
          </h1>
        </div>
      </div>
    </header>
  );
};
