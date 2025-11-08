import React from 'react';
import type { Job, GroundingSource, Tab } from '../types';
import { JobCard } from './JobCard';

interface ResultsPanelProps {
  jobs: Job[];
  insights: string;
  sources: GroundingSource[];
  isLoading: boolean;
  error: string | null;
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
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      );
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
        </nav>
      </div>
      
      {renderContent()}
    </div>
  );
};
