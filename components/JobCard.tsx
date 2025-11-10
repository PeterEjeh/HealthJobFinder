import React, { useState } from 'react';
import type { Job } from '../types.ts';

interface JobCardProps {
  job: Job;
}

const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(job.applyLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy link.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
        <div>
          <h3 className="text-lg font-bold text-cyan-800">{job.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <BriefcaseIcon className="h-4 w-4 text-slate-400" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 text-slate-400" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleShare}
            className={`inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-full hover:bg-slate-200 transition-colors text-sm whitespace-nowrap ${isCopied ? 'bg-green-100 text-green-800' : ''}`}
            aria-label="Share job link"
          >
            {isCopied ? (
              <>
                <CheckIcon className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <ShareIcon className="h-4 w-4" />
                Share
              </>
            )}
          </button>
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cyan-100 text-cyan-800 font-semibold py-2 px-5 rounded-full hover:bg-cyan-200 transition-colors text-sm whitespace-nowrap"
          >
            Apply Now
          </a>
        </div>
      </div>
      <p className="mt-4 text-slate-700 text-sm leading-relaxed">
        {job.description}
      </p>

      {job.requiredDocuments && job.requiredDocuments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
            <DocumentTextIcon className="h-4 w-4" />
            Required Documents
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.requiredDocuments.map((doc, index) => (
              <span key={index} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};