import React from 'react';
import type { Job, GroundingSource, Tab, AppError } from '../types.ts';
import { JobCard } from './JobCard.tsx';
import { Resources } from './Resources.tsx';

interface ResultsPanelProps {
  jobs: Job[];
  insights: string;
  sources: GroundingSource[];
  isLoading: boolean;
  error: AppError | null;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full p-10">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-600"></div>
  </div>
);

const EmptyState: React.FC<{ tab: Tab }> = ({ tab }) => (
    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-slate-700">No {tab === 'listings' ? 'Jobs' : 'Insights'} Found</h3>
      <p className="mt-2 text-slate-500">
        {tab === 'listings'
          ? 'Try adjusting your filters or broadening your search criteria.'
          : 'Enter some criteria and run a search to generate market insights.'}
      </p>
    </div>
);

const SourceList: React.FC<{ sources: GroundingSource[] }> = ({ sources }) => {
  if (sources.length === 0) return null;
  return (
    <div className="mt-8 p-4 bg-slate-100 rounded-lg">
      <h4 className="text-sm font-bold text-slate-600 mb-2">Sources:</h4>
      <ul className="list-disc list-inside space-y-1">
        {sources.map((source, index) => (
          <li key={index} className="text-xs">
            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:underline break-all">
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

const WifiOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 13a10 10 0 0 1 5.24-2.76"/><path d="M12 20h.01"/></svg>
);

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

const ErrorDisplay: React.FC<{ error: AppError }> = ({ error }) => {
  const getErrorContent = () => {
    switch (error.type) {
      case 'network':
        return {
          icon: <WifiOffIcon className="h-6 w-6 text-yellow-500" />,
          title: "Network Error",
          message: error.message
        };
      case 'api':
        return {
          icon: <AlertTriangleIcon className="h-6 w-6 text-red-500" />,
          title: "Service Unavailable",
          message: error.message
        };
      case 'parsing':
        return {
          icon: <CodeIcon className="h-6 w-6 text-orange-500" />,
          title: "Invalid Response",
          message: error.message
        };
      case 'unknown':
      default:
        return {
          icon: <AlertTriangleIcon className="h-6 w-6 text-red-500" />,
          title: "An Error Occurred",
          message: error.message || "Something went wrong. Please refresh the page and try again."
        };
    }
  };

  const { icon, title, message } = getErrorContent();

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert">
      <div className="flex">
        <div className="py-1">{icon}</div>
        <div className="ml-3">
          <p className="text-sm font-bold text-red-800">{title}</p>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};


export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  jobs,
  insights,
  sources,
  isLoading,
  error,
  activeTab,
  setActiveTab,
}) => {
  const renderContent = () => {
    if (isLoading && (activeTab === 'listings' || activeTab === 'insights')) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay error={error} />;
    }
    if (activeTab === 'listings') {
      return jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job, index) => <JobCard key={index} job={job} />)}
          <SourceList sources={sources} />
        </div>
      ) : (
        <EmptyState tab="listings" />
      );
    }
    if (activeTab === 'insights') {
      return insights ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }} />
           <SourceList sources={sources} />
        </div>
      ) : (
        <EmptyState tab="insights" />
      );
    }
    if (activeTab === 'resources') {
      return <Resources />;
    }
    return null;
  };

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('listings')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'listings'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Job Listings
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Market Insights
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'resources'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verified Resources
          </button>
        </nav>
      </div>
      
      {renderContent()}
    </div>
  );
};